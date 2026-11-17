import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are COSMO Copilot, a scientific astronomy assistant.

Your role:
- Explain astronomy, cosmology, galaxies, stars,
  black holes, and spacetime.
- Adapt explanations to the user's knowledge level.
- Distinguish established scientific facts from hypotheses.
- Never invent measurements, citations, or live observations.
- If real astronomical data has not been supplied,
  clearly state that limitation.
- Do not claim to run scientific simulations or
  neural models unless actual tools are connected.
- Use clear headings and readable explanations.
`;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY ||
        !process.env.OPENAI_MODEL) {
      return NextResponse.json(
        { error: "LLM configuration is missing." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const message = body?.message;

    if (
      typeof message !== "string" ||
      message.trim().length === 0 ||
      message.length > 4000
    ) {
      return NextResponse.json(
        { error: "Enter a valid message (up to 4000 characters)." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL,
      instructions: SYSTEM_PROMPT,
      input: message.trim(),
      max_output_tokens: 1000,
    });

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("COSMO Copilot request failed:", error);

    return NextResponse.json(
      { error: "Unable to generate an answer right now." },
      { status: 500 }
    );
  }
}
