"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QuickAccessCard from "../ui/quick-access-card";
import { FileText, Pencil, Video, Sparkles } from "lucide-react";
import { NewMeetingDialog } from "@/modules/meetings/ui/components/new-meeting-dialog";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function QuickAccess() {
  const [isDialogeOpen, setisDialogeOpen] = useState(false);
  const trpc = useTRPC();
  const { data: latestMeeting } = useSuspenseQuery(
    trpc.meetings.getLatestMeeting.queryOptions(),
  );

  const quickAccessItems = [
    {
      icon: <Pencil width={28} height={28} />,
      text: "Create a new meeting",
      description: "Start a new tutoring session",
      onClick: () => setisDialogeOpen(true),
      color: "blue",
    },
    {
      icon: <FileText width={28} height={28} />,
      text: "See latest meeting summary",
      description: "Review your last session",
      onClick: () => {
        if (!latestMeeting) {
          toast.error("No meetings found. Create your first meeting!");
          return;
        }
        if (latestMeeting.summary) {
          // Navigate to meeting page instead of opening summary directly
          window.location.href = `/dashboard/meetings/${latestMeeting.id}`;
        } else {
          toast.error("No summary available for the latest meeting.");
        }
      },
      color: "green",
    },
    {
      icon: <Video width={28} height={28} />,
      text: "See latest meeting recording",
      description: "Watch your session replay",
      onClick: () => {
        if (!latestMeeting) {
          toast.error("No meetings found. Create your first meeting!");
          return;
        }
        if (latestMeeting.recordingUrl) {
          window.open(latestMeeting.recordingUrl, "_blank");
        } else {
          toast.error("No recording available for the latest meeting.");
        }
      },
      color: "purple",
    },
  ];

  return (
    <>
      <NewMeetingDialog open={isDialogeOpen} onOpenChange={setisDialogeOpen} />
      <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Quick Access
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Jump into your most common actions instantly
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {quickAccessItems.map((item, index) => (
              <div key={index} className="group">
                <QuickAccessCard
                  icon={item.icon}
                  text={item.text}
                  onClick={item.onClick}
                  desc={item.description}
                />
              </div>
            ))}
          </div>

          {/* Bottom gradient decoration */}
          {/* <div className="mt-8 h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-full" /> */}
        </CardContent>
      </Card>
    </>
  );
}
