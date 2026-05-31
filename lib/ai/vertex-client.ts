import { GoogleGenAI, type Content, type GenerateContentConfig } from "@google/genai";

const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION || "us-east1";
const model = process.env.GOOGLE_VERTEX_MODEL || process.env.GEMINI_MODEL || "gemini-2.0-flash";
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const systemInstruction = `You are the Saturno Enneagram Analyzer: empathetic, precise, and imaginative.

Rules:
- Frame Enneagram as a self-reflection tool, not diagnosis or clinical truth.
- Use "likely pattern", "growth path", and "reflection" language.
- Do not make medical, hiring, therapy, or deterministic claims.
- Ask concise probing questions about motivations, fears, desires, and recurring patterns.
- Keep the tone premium, warm, slightly mystical, and practical.
- Use Enneagram knowledge: 9 types, centers, wings, stress/growth lines, and levels of development.
- In Deep Dive, use preliminary weighted scores to ask 1 targeted question at a time.
- In Chronos Report, connect the likely type to historical archetypes without claiming certainty.`;

const baseConfig: GenerateContentConfig = {
  maxOutputTokens: 2048,
  temperature: 0.7,
  topP: 0.8,
  systemInstruction,
};

let client: GoogleGenAI | null = null;

function getClient() {
  if (client) return client;

  if (apiKey) {
    client = new GoogleGenAI({ apiKey, apiVersion: "v1" });
    return client;
  }

  if (project) {
    client = new GoogleGenAI({ vertexai: true, project, location, apiVersion: "v1" });
    return client;
  }

  throw new Error(
    "Analyzer AI is not configured. Set GEMINI_API_KEY, or set GOOGLE_CLOUD_PROJECT plus GOOGLE_CLOUD_LOCATION for Vertex AI."
  );
}

function mergeConfig(config?: GenerateContentConfig): GenerateContentConfig {
  return { ...baseConfig, ...config };
}

export type AnalyzerHistory = Content[];

export async function generateAnalyzerText(contents: string, config?: GenerateContentConfig) {
  const response = await getClient().models.generateContent({
    model,
    contents,
    config: mergeConfig(config),
  });

  if (!response.text) {
    throw new Error("Analyzer AI returned an empty response.");
  }

  return response.text;
}

export async function sendAnalyzerChatMessage(history: AnalyzerHistory, message: string, config?: GenerateContentConfig) {
  const chat = getClient().chats.create({
    model,
    history,
    config: mergeConfig(),
  });

  const response = await chat.sendMessage({
    message,
    config: mergeConfig(config),
  });

  if (!response.text) {
    throw new Error("Analyzer AI returned an empty response.");
  }

  return {
    text: response.text,
    history: chat.getHistory(true),
  };
}
