// src/app/api/ai-whiteboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { streamVideo } from "@/lib/stream-video";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { agents, meetings } from "@/db/schema";
// import { createWorker } from "tesseract.js";
// import { StreamChat } from "stream-chat";
import { streamChat } from "@/lib/stream-chat";
// import {realtimeClient} from "web";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { elements, appState, meetingId, imageBase64 } = await req.json();

  // 1. Ekstrak elemen text dari Excalidraw scene
  const texts = elements
    .filter((el: any) => el.type === "text" && el.text && el.text.trim())
    .map((el: any) => el.text);

  // 2. (Opsional) OCR jika perlu, tambahkan di sini
  let ocrText = "";
  if (imageBase64) {
    try {
      const pureBase64 = imageBase64.startsWith("data:")
        ? imageBase64.split(",")[1]
        : imageBase64;

      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract and transcribe all text visible in this whiteboard image. Only return the text content, no explanations:",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${pureBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });
      ocrText = visionResponse.choices[0]?.message?.content?.trim() ?? "";
    } catch (err) {
      console.error("Vision API Error:", err);
      ocrText = "";
    }
  }

  // 3. Generate summary/context untuk AI
  const whiteboardSummary =
    [
      texts.length ? "Direct text from board:\n" + texts.join("\n") : "",
      ocrText ? "OCR results from images/handwriting:\n" + ocrText : "",
    ]
      .filter(Boolean)
      .join("\n\n") || "Whiteboard is empty or contains only drawings.";
  console.log(
    texts.length
      ? "Texts found on whiteboard:"
      : "No texts found on whiteboard."
  );
  console.log("Whiteboard Summary:", whiteboardSummary);
  // 4. Query DB untuk agent dan meeting
  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId));
  if (!meeting) {
    return NextResponse.json(
      { error: "Meeting tidak ditemukan" },
      { status: 404 }
    );
  }

  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, meeting.agentId));
  if (!agent) {
    return NextResponse.json(
      { error: "AI Agent tidak ditemukan" },
      { status: 404 }
    );
  }

  // 5. Generate jawaban AI (OpenAI)
  // 5. Generate AI response (OpenAI)
  const updatedPrompt = `
${agent.prompt}

[WHITEBOARD CONTEXT - LIVE UPDATE]
${whiteboardSummary}

Note: The above whiteboard content is the latest visual information shared by participants. Use this context to better understand the current discussion and provide more relevant responses.
`;

  await db
    .update(agents)
    .set({
      prompt: updatedPrompt,
      updatedAt: new Date(),
    })
    .where(eq(agents.id, agent.id));


 

  
    return new NextResponse(null, { status: 204 });
}
