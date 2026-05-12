import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

export async function POST(req: Request) {
  try {
    const { message, history, context } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message required" }, { status: 400 });
    }

    const systemPrompt = `You are Wavefront Copilot, an elite onchain intelligence AI designed to answer user questions about specific tokens.
You are currently analyzing a token with the following context:

Token Context:
- Symbol: ${context?.symbol ?? "Unknown"}
- Risk Grade: ${context?.riskGrade ?? "Unknown"} (Score: ${context?.riskScore ?? "Unknown"}/100)
- Liquidity Score: ${context?.metrics?.liquidityScore ?? "Unknown"}/100
- Holder Distribution Score: ${context?.metrics?.holderScore ?? "Unknown"}/100
- Security Score: ${context?.metrics?.securityScore ?? "Unknown"}/100
- Flags: ${(context?.flags ?? []).join(", ") || "None"}

Your persona:
- Sharp, precise, data-driven like a Bloomberg Terminal analyst.
- Keep answers extremely concise (max 3-4 sentences).
- If the user asks a general question, answer it, but relate it to the token context if possible.
- DO NOT hallucinate data. If you don't know, say "Insufficient data".
- Use **double asterisks** to bold key metrics in your response.`;

    const historyText = Array.isArray(history) && history.length > 0
      ? history.map((m: { role: string; content: string }) =>
          `${m.role === "user" ? "User" : "Copilot"}: ${m.content}`
        ).join("\n")
      : "None";

    const prompt = `${systemPrompt}\n\nChat History:\n${historyText}\n\nUser: ${message}\nCopilot:`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      text: response.text?.trim() ?? "I cannot analyze that right now.",
    });
  } catch (error) {
    console.error("Copilot error:", error);
    return NextResponse.json({ success: false, error: "Analysis failed" }, { status: 500 });
  }
}
