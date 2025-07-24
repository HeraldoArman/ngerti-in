import { inferRouterOutputs } from "@trpc/server/unstable-core-do-not-import";

import type { AppRouter } from "@/trpc/routers/_app";

export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
export type AgentGetMany = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];
