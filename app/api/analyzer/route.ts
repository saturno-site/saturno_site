import { NextRequest, NextResponse } from "next/server";
import { generativeModel } from "@/lib/ai/vertex-client";

export async function POST(req: NextRequest) {
  try {
    const { action, quizData, message, history } = await req.json();

    if (action === "start") {
      // Start the deep dive session based on quiz results
      const prompt = `I have completed the preliminary quiz. Here are my weighted scores: ${JSON.stringify(
        quizData.breakdown
      )}. 
      Based on these scores, please analyze my profile and ask me one deep, probing question to help refine my type or identify my wing.`;

      const result = await generativeModel.generateContent(prompt);
      const response = result.response;
      const text = response.candidates?.[0].content.parts[0].text;

      return NextResponse.json({ text, history: [{ role: "user", parts: [{ text: prompt }] }, { role: "model", parts: [{ text }] }] });
    }

    if (action === "chat") {
      // Continue the conversation
      const chat = generativeModel.startChat({ history });
      const result = await chat.sendMessage(message);
      const response = result.response;
      const text = response.candidates?.[0].content.parts[0].text;

      return NextResponse.json({ text });
    }

    if (action === "report") {
      // Generate the final Chronos Report
      const prompt = `Based on our conversation and my quiz results, please generate a final "Chronos Report". 
      1. Confirm my definitive Enneagram Type and Wing.
      2. Provide a 2-3 sentence deeply insightful summary.
      3. Name 3 famous historical figures who share this type and briefly explain why.
      4. Provide a "Saturno Growth Prompt" for my type.
      
      Format the response as a clean JSON object with keys: "type", "wing", "summary", "historicalFigures" (array of {name, reason}), and "growthPrompt".`;

      const chat = generativeModel.startChat({ history });
      const result = await chat.sendMessage(prompt);
      const response = result.response;
      const text = response.candidates?.[0].content.parts[0].text;

      // Extract JSON from the response (Gemini might wrap it in markdown)
      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      const report = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to generate structured report", raw: text };

      return NextResponse.json({ report });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Analyzer API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
