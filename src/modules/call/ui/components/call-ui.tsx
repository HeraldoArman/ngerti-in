// src/modules/call/ui/components/call-ui.tsx
import { useEffect, useState } from "react";
import {
  useCall,
  useCallStateHooks,
  CallingState,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

export const CallUI = ({ meetingName }: { meetingName: string }) => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

  const handleJoin = async () => {
    if (!call) return;
    try {
      await call.join();
      setShow("call");
    } catch (err) {
      console.error(err);
    }
  };

  // ketika SDK sudah benar-benar LEFT, pindah ke ended
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      setShow("ended");
    }
    // console.log("current state: " + callingState);
    // console.log("show: " + show);
  }, [callingState]);

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && (
        // <CallControls> akan memanggil call.leave() sendiri
        <CallActive meetingName={meetingName} />
      )}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  );
};
