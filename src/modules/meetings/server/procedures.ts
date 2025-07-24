import {
    createTRPCRouter,
    baseProcedure,
    protectedProcedure,
  } from "@/trpc/init";
  import { db } from "@/db";
  import { meetings, agents } from "@/db/schema";
  // import
  //   import { agentsInsertSchema } from "../schemas";
  import { z } from "zod";
  import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
  import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    MIN_PAGE_SIZE,
  } from "@/constant";
  import { TRPCError } from "@trpc/server";
  import { meetingsInsertSchema, meetingsUpdateSchema } from "../schema";
  import { MeetingStatus } from "../types";
  import { streamVideo } from "@/lib/stream-video";
  import { generatedAvatarUri } from "@/lib/avatar";
  import { languages } from "humanize-duration";
  
  export const meetingsRouter = createTRPCRouter({
    generateToken: protectedProcedure.mutation(async ({ ctx }) => {
      await streamVideo.upsertUsers([
        {
          id: ctx.userId.user.id,
          name: ctx.userId.user.name,
          role: "admin",
          image:
            ctx.userId.user.image ??
            generatedAvatarUri({ seed: ctx.userId.user.id, variant: "initials" }),
        },
      ]);
  
      const expirationTime = Math.floor(Date.now() / 1000) + 3600;
      const issuedAt = Math.floor(Date.now() / 1000) - 60;
      const token = streamVideo.generateUserToken({
        user_id: ctx.userId.user.id,
        validity_in_seconds: issuedAt,
        exp: expirationTime,
      });
      return token;
    }),
  
    remove: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...updateData } = input;
        const [removedMeeing] = await db
          .delete(meetings)
          .where(
            and(eq(meetings.id, id), eq(meetings.userId, ctx.userId.user.id))
          )
          .returning();
  
        if (!removedMeeing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Meeting not found",
          });
        }
  
        return removedMeeing;
      }),
  
    update: protectedProcedure
      .input(meetingsUpdateSchema)
      .mutation(async ({ input, ctx }) => {
        const { id, ...updateData } = input;
        const [updatedMeeting] = await db
          .update(meetings)
          .set(updateData)
          .where(
            and(eq(meetings.id, id), eq(meetings.userId, ctx.userId.user.id))
          )
          .returning();
  
        if (!updatedMeeting) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Meeting not found",
          });
        }
  
        return updatedMeeting;
      }),
  
    create: protectedProcedure
      .input(meetingsInsertSchema)
      .mutation(async ({ input, ctx }) => {
        const [createdMeeting] = await db
          .insert(meetings)
          .values({
            ...input,
            userId: ctx.userId.user.id,
          })
          .returning();
  
        const call = streamVideo.video.call("default", createdMeeting.id);
        await call.create({
          data: {
            created_by_id: ctx.userId.user.id,
            custom: {
              meetingId: createdMeeting.id,
              meetingName: createdMeeting.name,
            },
            settings_override: {
              transcription: {
                language: "en",
                mode: "auto-on",
                closed_caption_mode: "auto-on",
              },
              recording: {
                mode: "auto-on",
                quality: "1080p",
              },
            },
          },
        });
  
        const [existingAgent] = await db
          .select()
          .from(agents)
          .where(eq(agents.id, createdMeeting.agentId));
  
        if (!existingAgent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Agent not found",
          });
        }
  
        await streamVideo.upsertUsers([
          {
            id: existingAgent.id,
            name: existingAgent.name,
            role: "user",
            image: generatedAvatarUri({
              seed: existingAgent.name,
              variant: "botttsNeutral",
            }),
          },
        ]);
  
        return createdMeeting;
      }),
  
    getOne: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        const [existingMeeting] = await db
          .select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
              "duration"
            ),
          })
          .from(meetings)
          .innerJoin(agents, eq(meetings.agentId, agents.id))
          .where(
            and(
              eq(meetings.id, input.id),
              eq(meetings.userId, ctx.userId.user.id)
            )
          );
  
        if (!existingMeeting) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
        }
  
        return existingMeeting;
      }),
  
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
          agentId: z.string().nullish(),
          status: z
            .enum([
              MeetingStatus.Upcoming,
              MeetingStatus.Active,
              MeetingStatus.Completed,
              MeetingStatus.Processing,
              MeetingStatus.Cancelled,
            ])
            .nullish(),
        })
      )
      .query(async ({ ctx, input }) => {
        const { search, page, pageSize, status, agentId } = input;
  
        const data = await db
          .select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
              "duration"
            ),
          })
          .from(meetings)
          .innerJoin(agents, eq(meetings.agentId, agents.id))
          .where(
            and(
              eq(meetings.userId, ctx.userId.user.id),
              search ? ilike(meetings.name, `%${search}%`) : undefined,
              status ? eq(meetings.status, status) : undefined,
              agentId ? eq(meetings.agentId, agentId) : undefined
            )
          )
          .orderBy(desc(meetings.createdAt), desc(meetings.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize);
  
        const [total] = await db
          .select({ count: count() })
          .from(meetings)
          .where(
            and(
              eq(meetings.userId, ctx.userId.user.id),
              search ? ilike(meetings.name, `%${search}%`) : undefined
            )
          );
  
        const totalPages = Math.ceil(total.count / pageSize);
  
        return { items: data, total: total.count, totalPages };
      }),
  });
  