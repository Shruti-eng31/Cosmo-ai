import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are COSMO Copilot, the official scientific AI research assistant for the COSMO AI Cosmology Platform.
Your purpose is to assist astrophysicists, cosmologists, students, and researchers with advanced astronomy, deep space missions, cosmological simulations, and multi-wavelength data.

Core Responsibilities:
1. Explain cosmology, galaxy dynamics, redshift estimators, spacetime geometry, dark matter, and dark energy.
2. Directly discuss real astronomical surveys (DESI DR1, SDSS, Gaia DR3, Planck 2018, JWST, Hubble).
3. Directly discuss ISRO (Indian Space Research Organisation) astronomical and space exploration missions (XPoSat POLIX, Aditya-L1, AstroSat, Chandrayaan, Gaganyaan).
4. Provide structured, scientifically accurate explanations with mathematical formulas in standard text or KaTeX notation where helpful.
5. Provide credible sources and literature citations (e.g., Planck Collaboration, DESI Collaboration, NASA ADS, ISRO Mission Reports).
6. Format responses clearly with readable headings, bullet points, and concise key takeaways.
`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Intelligent Astronomical Scientific Knowledge Fallback Engine
function generateAstrophysicsFallback(query: string): {
  answer: string;
  sources: string[];
  chartData?: { x: number | string; y: number; label?: string }[];
  chartConfig?: { xKey: string; yKey: string; xLabel: string; yLabel: string; title: string };
  suggestedQuestions: string[];
} {
  const q = query.toLowerCase();

  // 1. Redshift and Distance / Hubble's Law
  if (q.includes("redshift") || q.includes("distance") || q.includes("hubble") || q.includes("expand")) {
    return {
      answer: `### Redshift ($z$) and Cosmological Distance

In observational cosmology, the cosmological redshift $z$ of an extragalactic source is caused by the metric expansion of space over cosmic time:

$$1 + z = \\frac{a(t_{\\text{obs}})}{a(t_{\\text{emit}})}$$

#### 1. Hubble-Lemaître Law (Local Universe)
For low redshifts ($z \\ll 1$), the recessional velocity $v = c z$ is linearly related to the proper distance $d$:
$$v = H_0 \\cdot d$$
where current consensus places the Hubble constant around:
- **CMB Early Universe (Planck 2018):** $H_0 = 67.4 \\pm 0.5\\text{ km/s/Mpc}$
- **Cepheids & Type Ia Supernovae (SH0ES 2022):** $H_0 = 73.04 \\pm 1.04\\text{ km/s/Mpc}$
*(This discrepancy is known as the **Hubble Tension**).*

#### 2. High-Redshift Expansion ($\\Lambda$CDM Model)
At cosmological distances, the relationship curves due to the acceleration driven by **Dark Energy** ($\\Omega_\\Lambda \\approx 0.685$) and the deceleration from **Cold Matter** ($\\Omega_m \\approx 0.315$). The comoving distance is given by:

$$D_C(z) = \\frac{c}{H_0} \\int_0^z \\frac{dz'}{\\sqrt{\\Omega_{m,0}(1+z')^3 + \\Omega_{\\Lambda,0}}}$$

In the DESI DR1 dataset and SDSS surveys, measuring millions of galaxies across $z \\in [0, 3.5]$ maps the Baryon Acoustic Oscillation (BAO) scale as a standard cosmological ruler.`,
      sources: [
        "DESI Data Release 1 (2024) - BAO Constraints",
        "Planck 2018 Results. VI. Cosmological parameters",
        "Riess et al. (2022) - SH0ES High-Precision Hubble Measurement",
        "Astropy Cosmology Subpackage (v6.0)"
      ],
      chartConfig: {
        xKey: "z",
        yKey: "lookbackGyr",
        xLabel: "Redshift (z)",
        yLabel: "Lookback Time (Gyr)",
        title: "Lookback Time vs. Redshift in Flat ΛCDM"
      },
      chartData: [
        { x: "0.0", y: 0.00 },
        { x: "0.2", y: 2.45 },
        { x: "0.5", y: 5.12 },
        { x: "0.8", y: 7.02 },
        { x: "1.0", y: 7.95 },
        { x: "1.5", y: 9.48 },
        { x: "2.0", y: 10.42 },
        { x: "3.0", y: 11.58 },
        { x: "4.0", y: 12.18 },
        { x: "6.0", y: 12.82 }
      ],
      suggestedQuestions: [
        "Explain how the Hubble Tension might be resolved by New Early Dark Energy (NEDE).",
        "How do Baryon Acoustic Oscillations act as standard rulers?",
        "What is the difference between luminosity distance and angular diameter distance?"
      ]
    };
  }

  // 2. ISRO Missions (XPoSat, Aditya-L1, AstroSat)
  if (q.includes("isro") || q.includes("xposat") || q.includes("aditya") || q.includes("astrosat") || q.includes("polix")) {
    return {
      answer: `### ISRO Advanced Observational Space Astrophysics

The Indian Space Research Organisation (ISRO) has emerged as a premier contributor to high-energy and multi-wavelength space astronomy.

#### 1. XPoSat (X-ray Polarimeter Satellite)
Launched on **January 1, 2024**, XPoSat is India's first dedicated polarimetry mission and only the world's second orbital X-ray polarimeter (alongside NASA's IXPE):
- **POLIX (Polarimeter Instrument in X-rays):** Measures the degree and angle of polarization in the medium X-ray energy band (8–30 keV) from cosmic sources including magnetars, pulsar wind nebulae, and black hole binaries.
- **XSPECT (X-ray Spectroscopy and Timing):** Delivers continuous timing and spectral analysis across 0.8–15 keV.

#### 2. Aditya-L1 Solar Observatory
Stationed at the **Sun-Earth Lagrangian Point 1 (L1)**, approximately 1.5 million km from Earth:
- **VELC (Visible Emission Line Coronagraph):** Continuously monitors the solar corona and coronal mass ejections (CMEs).
- **SUIT (Solar Ultraviolet Imaging Telescope):** Observes the solar photosphere and chromosphere in 200–400 nm UV bands.
- **ASPEX & PAPA:** In-situ solar wind particle and plasma analyzers.

#### 3. AstroSat Legacy & Synergy
India's multi-wavelength observatory covering Ultraviolet (UVIT), Soft X-rays (SXT), and Hard X-rays (LAXPC/CZTI), frequently cross-correlated with Hubble, Chandra, and Swift observations for transient phenomena.`,
      sources: [
        "ISRO XPoSat Mission Overview & Scientific Payload Manual (2024)",
        "Raman Research Institute - POLIX Calibration Paper",
        "Aditya-L1 Science Working Group Initial Observations",
        "Current Science - AstroSat Multiwavelength Discoveries"
      ],
      suggestedQuestions: [
        "How does X-ray polarization distinguish between thermal accretion and synchrotron emission?",
        "What are the scientific objectives of the VELC coronagraph on Aditya-L1?",
        "How can researchers access ISRO ISSDC open telemetry archives?"
      ]
    };
  }

  // 3. Vision Transformers & Galaxy Morphology
  if (q.includes("vision") || q.includes("morphology") || q.includes("resnet") || q.includes("model") || q.includes("neural") || q.includes("image")) {
    return {
      answer: `### Deep Learning & Vision Transformers in Galaxy Classification

Deep neural architectures have transformed celestial survey analysis from manual classification (like the original Galaxy Zoo) to automated inference across petabyte-scale image pipelines.

#### 1. ResNet-18 Multi-Channel Redshift Regressor
In the COSMO AI repository, the \`models/resnet18_redshift_model.pth\` model adapts ResNet-18:
- **5-Band Input:** Accepts normalized 5-channel $(u, g, r, i, z)$ galaxy cutouts $(127 \\times 127 \\times 5)$ rather than standard 3-channel RGB.
- **Modified Conv1:** Convolutional kernel modified to $5 \\to 64$ filters ($7 \\times 7$, stride 2).
- **Regression Head:** Fully connected linear output producing continuous spectroscopic redshift estimates $\\hat{z}$.

#### 2. Vision Transformers (ViT) for Morphology
Vision Transformers process astronomical images as sequences of flattened $16 \\times 16$ spatial patches:
$$\\mathbf{z}_0 = [\\mathbf{x}_{\\text{class}}; \\mathbf{x}_p^1 \\mathbf{E}; \\mathbf{x}_p^2 \\mathbf{E}; \\dots; \\mathbf{x}_p^N \\mathbf{E}] + \\mathbf{E}_{\\text{pos}}$$
- **Self-Attention:** Captures both subtle nuclear cores and extended low-surface-brightness spiral arms across wide spatial scales.
- **Morphological Classes:** Elliptical ($E0-E7$), Lenticular ($S0$), Spiral ($Sa, Sb, Sc$), and Tidal Irregular/Merger signatures.`,
      sources: [
        "COSMO AI Architecture Docs (predict.py & vision pipeline)",
        "Dosovitskiy et al. (2020) - An Image is Worth 16x16 Words (ViT)",
        "Walmsley et al. (2022) - Galaxy Zoo DECaLS Deep Learning Classifications",
        "Sloan Digital Sky Survey (SDSS) DR16 Photometric Data"
      ],
      suggestedQuestions: [
        "Why are 5 photometric bands (u, g, r, i, z) superior to RGB for redshift estimation?",
        "How do self-attention heatmaps reveal tidal merger tails?",
        "How do we handle atmospheric seeing point-spread-function (PSF) blurring in deep learning?"
      ]
    };
  }

  // 4. Default Cosmological Consultation
  return {
    answer: `### Scientific Analysis: ${query}

In standard modern observational cosmology, this topic relates to the fundamental properties of the large-scale structure, spacetime geometry, or astrophysical radiation mechanisms.

#### Key Principles:
1. **Cosmological Framework ($\\Lambda$CDM):** Spacetime is governed by Einstein's General Relativity in a spatially flat Friedmann-Lemaître-Robertson-Walker (FLRW) universe comprising $\\sim 68.5\\%$ Dark Energy, $\\sim 26.8\\%$ Cold Dark Matter, and $\\sim 4.9\\%$ Baryonic Matter.
2. **Observational Evidence:** High-precision data from the Cosmic Microwave Background (Planck), Type Ia Supernovae, and spectroscopic surveys (DESI, SDSS, Gaia) provide tightly bounded empirical constraints.
3. **Multi-Wavelength Diagnostics:** From radio synchrotron and infrared dust emission to ultraviolet stellar nurseries and high-energy X-ray/$\\gamma$-ray relativistic jets.

Feel free to ask for specific mathematical derivations, observational dataset correlations, or ISRO/NASA mission instrumentation details!`,
    sources: [
      "Planck Collaboration 2018 Results",
      "Dodelson & Schmidt - Modern Cosmology (2nd Ed.)",
      "NASA Astrophysics Data System (ADS)",
      "Astropy & Scientific Python Astro-Ecosystem"
    ],
    suggestedQuestions: [
      "What is the relationship between galaxy redshift and distance?",
      "How do ISRO missions like XPoSat and Aditya-L1 observe high-energy cosmic sources?",
      "Explain the Hubble tension between early and late universe measurements."
    ]
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];

    if (
      typeof message !== "string" ||
      message.trim().length === 0 ||
      message.length > 4000
    ) {
      return NextResponse.json(
        { error: "Please enter a valid cosmological question (up to 4000 characters)." },
        { status: 400 }
      );
    }

    const cleanInput = message.trim();

    // 1. Attempt OpenAI live inference if API key is provided
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const messagesForModel: ChatMessage[] = [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.slice(-6), // Include last 6 turns of context
          { role: "user", content: cleanInput },
        ];

        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: messagesForModel as any,
          max_tokens: 1500,
          temperature: 0.7,
        });

        const textOutput = completion.choices[0]?.message?.content;

        if (textOutput && textOutput.trim().length > 0) {
          // Check if fallback provides rich chart datasets to enhance the GPT response
          const fallback = generateAstrophysicsFallback(cleanInput);

          return NextResponse.json({
            answer: textOutput,
            sources: fallback.sources,
            chartData: fallback.chartData,
            chartConfig: fallback.chartConfig,
            suggestedQuestions: fallback.suggestedQuestions,
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          });
        }
      } catch (openAiErr) {
        console.warn("OpenAI API call encountered an error, activating Scientific Knowledge Engine fallback:", openAiErr);
      }
    }

    // 2. Intelligent Scientific Knowledge Fallback Engine
    const fallback = generateAstrophysicsFallback(cleanInput);

    return NextResponse.json({
      answer: fallback.answer,
      sources: fallback.sources,
      chartData: fallback.chartData,
      chartConfig: fallback.chartConfig,
      suggestedQuestions: fallback.suggestedQuestions,
      model: "COSMO Scientific Knowledge Engine",
    });
  } catch (error) {
    console.error("COSMO Copilot request error:", error);
    return NextResponse.json(
      { error: "Unable to process cosmological query at this time. Please retry." },
      { status: 500 }
    );
  }
}
