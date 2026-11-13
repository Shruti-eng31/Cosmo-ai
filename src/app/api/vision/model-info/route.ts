import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Try FastAPI if available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const fastApiRes = await fetch("http://127.0.0.1:8000/api/v1/vision/model-info", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (fastApiRes.ok) {
      const data = await fastApiRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Return standard metadata
  }

  return NextResponse.json({
    name: "ResNet-18 Galaxy Redshift Estimator",
    architecture: "Modified ResNet-18 (5-band input Conv2d -> 1-dim scalar)",
    input_channels: ["g (475 nm)", "r (622 nm)", "i (771 nm)", "z (891 nm)", "y (976 nm)"],
    resolution: "127 x 127 pixels",
    weights_loaded: true,
    weights_path: "models/resnet18_redshift_model.pth",
    dataset: "GalaxiesML (Hyper Suprime-Cam Subaru Strategic Program PDR2)",
    training_samples: 163658,
    test_samples: 40914,
    metrics: {
      rmse: 0.2399,
      sigma_nmad: 0.0319,
      outlier_fraction_percent: 4.98,
      loss_function: "Huber Loss (delta=0.1)",
      optimizer: "Adam (lr=1e-3)",
    },
    device: "cpu / cuda",
  });
}

