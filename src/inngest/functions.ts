import JSONL from "jsonl-parse-stringify";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { db } from "@/db";
import { user, agents, meetings } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

const summarizer = createAgent({
  name: "summarizer",
  system: `
  You are an expert summarizer specializing in educational content. Your task is to read a transcript of a Zoom conversation between a human student and an AI tutor. The sessions are typically tutorial-style lessons focused on middle school (SMP) and high school (SMA) subjects, including math, science, language, and more.

Your summary should be clear, student-friendly, and easy to read. Avoid jargon or overly technical language unless it was discussed explicitly in the transcript. Keep the tone supportive and informative.

Use the following markdown structure for your output:

Overview
Give a detailed yet concise narrative summary of the tutoring session. Focus on what the student was trying to learn, how the AI Agent responded, and what concepts were clarified or practiced. Include the main topic(s), key explanations or problem-solving steps, and any useful outcomes or progress made by the student. Avoid listing—write in smooth, full sentences.

Notes
Break the session into logical sections, grouped by topic or progression of the lesson. Use timestamp ranges to anchor each section. Each section should include key ideas, teaching moments, examples, or student questions in bullet points.

Example:

[00:03-00:12] Introduction to Linear Equations
Student asked how to solve equations with variables on both sides

AI explained step-by-step balancing method

Provided two worked examples

[00:13-00:22] Practice and Feedback
Student tried solving 2 new equations

AI gave corrective feedback on sign errors

Emphasized importance of checking answers


`.trim(),
  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
});

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {

    const transcriptUrl = event.data.transcript_url;
    if (!transcriptUrl) {
      throw new Error("Missing transcript_url in event data");
    }
    
    const response = await step.run("fetch-transcript", async () => {
      return fetch(transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = Array.from(
        new Set(transcript.map((item) => item.speaker_id)),
      );
      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) => users.map((user) => ({ ...user })));
      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) => agents.map((agent) => ({ ...agent })));

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id,
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers),
    );

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meeting_id));
    });
  },
);
