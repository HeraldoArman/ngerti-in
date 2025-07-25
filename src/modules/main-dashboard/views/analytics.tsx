"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Analytics() {
  const trpc = useTRPC();

  const { data: meetingData } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({}),
  );

  const { data: tutorData } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({}),
  );

  const { data: timeData } = useSuspenseQuery(
    trpc.meetings.getHours.queryOptions(),
  );

  useEffect(() => {
    console.log(meetingData);
    console.log(tutorData);
    console.log(timeData);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            Total Meetings
            <div className="text-4xl font-bold">{meetingData.total}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            Total Tutors
            <div className="text-4xl font-bold">{tutorData.total}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            Total Meeting Time
            <div>
              <div className="text-4xl font-bold">
                {timeData} <span className="font-normal text-2xl">h</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
