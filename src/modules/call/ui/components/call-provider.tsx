"use client";

import React from "react";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { generatedAvatarUri } from "@/lib/avatar";
import { CallConnect } from "./call-connect";

interface Props {
  meetingId: string;
  meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-600 via-green-800 to-green-900 p-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="size-8 animate-spin text-white drop-shadow-lg" />
          <span className="text-white text-lg font-medium opacity-80">
            Loading your call...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId={data.user.id}
        userName={data.user.name || "Anonymous"}
        userImage={generatedAvatarUri({
          seed: data.user.name,
          variant: "initials",
        })}
      />
    </div>
  );
};
