import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";

async function runPythonPredict(filePath: string): Promise<any> {
  const rootDir = process.cwd();
  const scriptPath = path.join(rootDir, "predict.py");

  // Determine python command (try backend venv first, then system python)
  const venvPython = path.join(rootDir, "backend", "venv", "Scripts", "python.exe");
  let pythonCmd = "python";
  try {
    await fs.access(venvPython);
    pythonCmd = `"${venvPython}"`;
  } catch {
    pythonCmd = "python";
  }

  const command = `${pythonCmd} "${scriptPath}" --file "${filePath}" --json`;

  return new Promise((resolve, reject) => {
    exec(command, { cwd: rootDir, timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("[Vision Predict] Python error:", error, stderr);
        return reject(new Error(stderr || error.message));
      }

      const match = stdout.match(/__COSMO_JSON_START__([\s\S]*?)__COSMO_JSON_END__/);
      if (match && match[1]) {
        try {
          const parsed = JSON.parse(match[1].trim());
          return resolve(parsed);
        } catch (e: any) {
          return reject(new Error("Failed to parse prediction JSON from Python output: " + e.message));
        }
      }

      reject(new Error("No valid prediction output found in: " + stdout));
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ detail: "No file provided in form data." }, { status: 400 });
    }

    // 1. Try FastAPI backend if running
    try {
      const fastApiFormData = new FormData();
      fastApiFormData.append("file", file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const fastApiRes = await fetch("http://127.0.0.1:8000/api/v1/vision/predict", {
        method: "POST",
        body: fastApiFormData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (fastApiRes.ok) {
        const data = await fastApiRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // FastAPI not running; fallback to direct Python execution
    }

    // 2. Direct Python Execution
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempDir = os.tmpdir();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const tempFilePath = path.join(tempDir, `cosmo_${Date.now()}_${safeName}`);

    await fs.writeFile(tempFilePath, buffer);

    try {
      const prediction = await runPythonPredict(tempFilePath);
      return NextResponse.json(prediction);
    } finally {
      // Clean up temporary file
      await fs.unlink(tempFilePath).catch(() => {});
    }
  } catch (err: any) {
    console.error("[API /api/vision/predict] Execution failed:", err);
    return NextResponse.json(
      { detail: err.message || "Model execution failed" },
      { status: 500 }
    );
  }
}

