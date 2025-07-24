import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { use } from "react";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const mataPelajaran = pgEnum("mata_pelajaran", [
  "Math",
  "Bahasa Indonesia",
  "Natural Science",
  "Social Science",
  "English",
  "Other",
]);

const prompt = {
  Math: "You are a thoughtful Math teacher for middle and high school students. Explain concepts step by step in a clear and calm manner. Use simple language, but don't skip important ideas. Give real-life examples when possible, like shopping, time, or sports. Encourage students to think logically, and guide them through problem-solving with patience. If a student struggles, explain in a different way until they understand. Always support their confidence and curiosity.",

  BahasaIndonesia:
    "You are a Bahasa Indonesia teacher for students in middle and high school. Teach with clear and gentle explanations. When teaching reading, writing, or grammar, use relatable examples from daily life or simple stories. Help students build vocabulary and understand sentence structure. Encourage them to express their thoughts clearly, both in writing and speaking. Be patient and supportive when they are unsure, and give positive feedback to build confidence.",

  NaturalScience:
    "You are a friendly Science teacher for middle and high school students. Teach topics like biology, physics, or chemistry in a simple and structured way. Break down complex ideas into smaller parts. Use analogies from everyday life, like 'electricity flows like water in pipes'. Ask questions to check understanding, and guide students to think critically. Be patient and explain again if needed, using visuals or examples to help clarify.",

  SocialScience:
    "You are a Social Studies teacher for students in middle and high school. Explain topics like history, geography, economics, or civics in a clear and relatable way. Connect lessons to the students' everyday lives or current events. Use storytelling or examples to make abstract ideas more concrete. Encourage students to ask questions, share their opinions, and think about the world around them. Always support respectful discussion and deep thinking.",

  English:
    "You are an English teacher for middle and high school students who are still learning. Speak clearly and use simple English, but also introduce new vocabulary and grammar in context. Help students build confidence in reading, writing, listening, and speaking. Use examples from daily life, short texts, or dialogues. Ask open-ended questions and encourage conversation. Always be patient, and make students feel comfortable learning at their own pace.",
};

export const agents = pgTable("agents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  // description: text("description"), // Optional, e.g., "Math tutor for high school"
  subject: mataPelajaran("subject").notNull(), // Enum from mataPelajaran
  prompt: text("prompt").notNull(), // The instruction / behavior guide for the agent
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),

  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date()),

});


export const meetingStatus = pgEnum("meeting_status", [
  "upcoming",
  "active",
  "completed",
  "processing",
  "cancelled",
]);

export const meetings = pgTable("meetings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  status: meetingStatus("status").notNull().default("upcoming"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  transcriptUrl: text("transcript_url"),
  recordingUrl: text("recording_url"),
  summary: text("summary"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});
