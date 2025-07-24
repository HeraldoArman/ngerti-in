import React from "react";
// import {
  // AgentsView,
  // AgentsViewLoading,
  // AgentsViewError,
// } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";
import { MeetingsView, MeetingViewsError, MeetingViewsLoading } from "@/modules/meetings/ui/views/meeting-views";

interface Props {
  searchParams: Promise<SearchParams>;
}

const page = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({ ...filters }),
  );

  return (
    <>
    <MeetingsListHeader />
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingViewsLoading />}>
        <ErrorBoundary fallback={<MeetingViewsError />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  </>
  );
};

export default page;
