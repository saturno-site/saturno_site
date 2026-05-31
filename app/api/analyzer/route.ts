import { NextRequest, NextResponse } from "next/server";
import {
  type AnalyzerHistory,
  generateAnalyzerText,
  sendAnalyzerChatMessage,
} from "@/lib/ai/vertex-client";

export const runtime = "nodejs";

const reportSchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    wing: { type: "string" },
    summary: { type: "string" },
    historicalFigures: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          reason: { type: "string" },
        },
        required: ["name", "reason"],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 3,
    },
    growthPrompt: { type: "string" },
  },
  required: ["type", "wing", "summary", "historicalFigures", "growthPrompt"],
  additionalProperties: false,
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asHistory(value: unknown): AnalyzerHistory {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is AnalyzerHistory[number] => {
    if (!isObject(item)) return false;
    if (item.role !== "user" && item.role !== "model") return false;
    if (!Array.isArray(item.parts)) return false;
    return item.parts.every((part) => isObject(part) && typeof part.text === "string");
  });
}

function textFromResponse(raw: string | undefined) {
  return raw?.trim() || "I need one more reflection before I can read the pattern clearly.";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!isObject(body) || typeof body.action !== "string") {
      return NextResponse.json({ error: "Invalid analyzer request" }, { status: 400 });
    }

    if (body.action === "start") {
      if (!isObject(body.quizData) || !isObject(body.quizData.breakdown)) {
        return NextResponse.json({ error: "Missing quizData.breakdown" }, { status: 400 });
      }

      const prompt = `Preliminary Saturno weighted scores: ${JSON.stringify(body.quizData.breakdown)}.
Analyze the strongest and closest patterns. Ask exactly one deep, non-clinical question that helps refine likely core type or wing.`;

      const text = textFromResponse(await generateAnalyzerText(prompt));
      const history: AnalyzerHistory = [
        { role: "user", parts: [{ text: prompt }] },
        { role: "model", parts: [{ text }] },
      ];

      return NextResponse.json({ text, history });
    }

    if (body.action === "chat") {
      if (typeof body.message !== "string" || body.message.trim().length === 0) {
        return NextResponse.json({ error: "Missing message" }, { status: 400 });
      }

      const result = await sendAnalyzerChatMessage(asHistory(body.history), body.message.trim());
      return NextResponse.json({ text: textFromResponse(result.text), history: result.history });
    }

    if (body.action === "report") {
      const history = asHistory(body.history);
      const prompt = `Generate the final Saturno Chronos Report from this conversation.
Requirements:
1. Use likely/reflection language, not certainty.
2. Include likely Enneagram type and wing.
3. Include a 2-3 sentence insightful summary.
4. Include exactly 3 historical archetypes/figures with short reasons.
5. Include one practical Saturno Growth Prompt.
Return only JSON matching the required schema.`;

      const result = await sendAnalyzerChatMessage(history, prompt, {
        responseMimeType: "application/json",
        responseJsonSchema: reportSchema,
      });

      try {
        return NextResponse.json({ report: JSON.parse(result.text) });
      } catch {
        return NextResponse.json(
          { error: "Failed to parse structured report", raw: result.text },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Analyzer API Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
