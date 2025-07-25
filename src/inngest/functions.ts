import { streamVideo } from "@/lib/stream-video";
import JSONL from "jsonl-parse-stringify";
// ❌ Remove this line - causing circular dependency
// import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { db } from "@/db";
import { user, agents, meetings } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";
import { Inngest } from "inngest"; // ✅ Import Inngest directly
// import { real } from "drizzle-orm/gel-core";

// ✅ Create inngest client here instead of importing
const inngest = new Inngest({ 
  id: "ngerti-in",
});

const summarizer = createAgent({
  name: "summarizer",
  system: `
  You are an expert summarizer specializing in educational content. Your task is to read a transcript of a Zoom conversation between a human student and an AI tutor. The sessions are typically tutorial-style lessons focused on middle school (SMP) and high school (SMA) subjects, including math, science, language, and more.

Your summary should be clear, student-friendly, and easy to read. Avoid jargon or overly technical language unless it was discussed explicitly in the transcript. Keep the tone supportive and informative.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z

`.trim(),
  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
});

const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const transcriptUrl = event.data.transcript_url;
    if (!transcriptUrl) {
      throw new Error("Missing transcript_url in event data");
    }
    console.log(transcriptUrl);

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
        return {
          ...item,
          user: {
            name: speaker ? speaker.name : "Unknown",
          },
        };
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

// Add this at the top of functions.ts to track active polling
const activePolling = new Set<string>();
const pollAgentPrompt = inngest.createFunction(
  { id: "poll-agent-prompt" },
  { event: "agent/prompt.poll" },
  async ({ event, step }) => {
    console.log("🎯 [INNGEST] pollAgentPrompt started with data:", event.data);
    
    const { agentId, meetingId } = event.data;
    const pollingKey = `${meetingId}-${agentId}`;

    // ✅ Prevent multiple polling for same meeting/agent
    if (activePolling.has(pollingKey)) {
      console.log("🛑 Polling already active for:", pollingKey);
      return;
    }

    activePolling.add(pollingKey);

    try {
      const [agent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, agentId));

      if (!agent) {
        console.error("❌ Agent not found:", agentId);
        activePolling.delete(pollingKey);
        return;
      }

      // ✅ Create connection and loop inside step.run()
      await step.run("connect-and-update-loop", async () => {
        const call = streamVideo.video.call("default", meetingId);
        const realtimeClient = await streamVideo.video.connectOpenAi({
          call,
          openAiApiKey: process.env.OPENAI_API_KEY!,
          agentUserId: agentId,
        });

        console.log("✅ Agent connected to call:", agentId);

        // ✅ Set up event listener ONCE outside the loop
        realtimeClient.on("conversation.updated", (instruction: any) => {
          console.log(`📡 received conversation.updated`, instruction);
        });

        // ✅ Wait for connection to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        let previousPrompt = "";

        // ✅ Loop inside step.run() - connection dibuat sekali, update berkali-kali
        while (true) {
          try {
            const [latestAgent] = await db
              .select()
              .from(agents)
              .where(eq(agents.id, agentId));

            if (latestAgent) {
              // ✅ Only update if prompt has changed
              if (latestAgent.prompt !== previousPrompt) {
                console.log("🔄 Prompt changed, updating session...");
                console.log("📝 New prompt:", latestAgent.prompt.substring(0, 200) + "...");
                
                await realtimeClient.updateSession({
                  instructions: latestAgent.prompt,
                });
                
                previousPrompt = latestAgent.prompt;
                console.log("✅ Session updated with new instructions");
              } else {
                console.log("⏭️ No prompt change, skipping update");
              }
            }

            // Wait 1 second before next check
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (updateError) {
            console.error("❌ Update error:", updateError);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      });

    } catch (error) {
      console.error("❌ Error in pollAgentPrompt:", error);
    } finally {
      activePolling.delete(pollingKey);
    }
  }
);
export { meetingsProcessing, pollAgentPrompt, inngest };