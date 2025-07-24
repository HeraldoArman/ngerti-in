import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constant";
import { TRPCError } from "@trpc/server";

import { agentPrompts } from "../prompts";

export const agentsRouter = createTRPCRouter({
  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;
      const [updatedAgent] = await db
        .update(agents)
        .set({
          ...updateData,
          subject: updateData.subject as
            | "Math"
            | "Bahasa Indonesia"
            | "Natural Science"
            | "Social Science"
            | "English",
          // | "Other",
        })
        .where(and(eq(agents.id, id), eq(agents.userId, ctx.userId.user.id)))
        .returning();

      if (!updatedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tutor not found",
        });
      }

      return updatedAgent;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removedAgent] = await db
        .delete(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.userId.user.id)),
        )
        .returning();

      if (!removedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tutor not found",
        });
      }

      return removedAgent;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.userId.user.id)),
        );

      if (!existingAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tutor not found" });
      }

      return existingAgent;
    }),

  // TODO: Implement the create agent procedure
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // console.log("[GET AGENTS]", input, ctx.userId);
      const { search, page, pageSize } = input;

      const data = await db
        .select(getTableColumns(agents))
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.userId.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
          ),
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.userId.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
          ),
        );
      const totalPages = Math.ceil(total.count / pageSize);

      return { items: data, total: total.count, totalPages };
    }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, subject, prompt } = input;

      const resolvedPrompt = agentPrompts[subject as keyof typeof agentPrompts];
      if (!resolvedPrompt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Prompt not found for the selected subject",
        });
      }

      const [createdAgent] = await db
        .insert(agents)
        .values({
          name,
          subject,
          prompt: resolvedPrompt,
          userId: ctx.userId.user.id, // should be user_id in your schema
          // description, // only if this column exists
        })
        .returning();

      return createdAgent;
    }),
});
