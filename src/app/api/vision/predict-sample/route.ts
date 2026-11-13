import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function runPythonSamplePredict(sampleId: string): Promise<any> {
  const rootDir = process.cwd();
  const scriptPath = path.join(rootDir, "predict.py");

  const venvPython = path.join(rootDir, "backend", "venv", "Scripts", "python.exe");
  let pythonCmd = "python";
  try {
    await fs.access(venvPython);
    pythonCmd = `"${venvPython}"`;
  } catch {
    pythonCmd = "python";
  }

  const command = `${pythonCmd} "${scriptPath}" --sample "${sampleId}" --json`;

  return new Promise((resolve, reject) => {
    exec(command, { cwd: rootDir, timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("[Vision Sample Predict] Python error:", error, stderr);
        return reject(new Error(stderr || error.message));
      }

      const match = stdout.match(/__COSMO_JSON_START__([\s\S]*?)__COSMO_JSON_END__/);
      if (match && match[1]) {
        try {
          const parsed = JSON.parse(match[1].trim());
          return resolve(parsed);
        } catch (e: any) {
          return reject(new Error("Failed to parse prediction JSON: " + e.message));
        }
      }

      reject(new Error("No valid prediction output found in: " + stdout));
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({ sample_id: "hsc-starburst" }));
    const sampleId = body.sample_id || "hsc-starburst";

    // 1. Try FastAPI if available
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const fastApiRes = await fetch("http://127.0.0.1:8000/api/v1/vision/predict-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sample_id: sampleId }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (fastApiRes.ok) {
        const data = await fastApiRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fallback to direct Python
    }

    // 2. Direct Python Execution
    const prediction = await runPythonSamplePredict(sampleId);
    return NextResponse.json(prediction);
  } catch (err: any) {
    console.error("[API /api/vision/predict-sample] Execution failed:", err);
    return NextResponse.json(
      { detail: err.message || "Sample prediction failed" },
      { status: 500 }
    );
  }
}

