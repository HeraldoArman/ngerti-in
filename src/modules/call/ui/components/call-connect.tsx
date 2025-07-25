"use client";
import {
  type Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from "@tanstack/react-query";
import { CallUI } from "./call-ui";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const trpc = useTRPC();

  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions(),
  );

  const [client, setClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: generateToken,
    });

    setClient(_client);
    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userImage, generateToken]);

  const [call, setCall] = useState<Call>();
  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingId);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
      client.disconnectUser();
      setCall(undefined);
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Enhanced loader */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <Loader2Icon className="absolute inset-0 m-auto size-8 text-white/80" />
          </div>

          {/* Text content */}
          <div className="text-center space-y-2">
            <h2 className="text-white text-2xl font-semibold tracking-wide">
              Connecting to your call
            </h2>
            <p className="text-blue-100/80 text-base font-medium max-w-sm">
              Please wait while we prepare everything for your meeting
              experience
            </p>
          </div>

          {/* Loading progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Subtle border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallUI meetingName={meetingName} />
        </StreamCall>
      </StreamVideo>
    </>
  );
};
