// src/modules/call/ui/components/call-ui.tsx
import { useEffect, useState, useCallback } from "react";
import {
  useCall,
  useCallStateHooks,
  CallingState,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const ExcalidrawWrapper = dynamic(
  async () => (await import("./excalidraw-wrapper")).default,
  {
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-white">
        <p className="text-gray-600">Loading whiteboard...</p>
      </div>
    ),
    ssr: false,
  }
);

export const CallUI = ({ meetingName }: { meetingName: string }) => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const [isWhiteboardOpen, setWhiteboardOpen] = useState(false);

  // State to persist Excalidraw data
  const [excalidrawData, setExcalidrawData] = useState<{
    elements: any[];
    appState: { viewBackgroundColor: string; [key: string]: any };
  }>({
    elements: [],
    appState: {
      viewBackgroundColor: "#ffffff",
    },
  });

  const handleJoin = async () => {
    if (!call) return;
    try {
      await call.join();
      setShow("call");
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhiteboardToggle = useCallback(() => {
    setWhiteboardOpen(!isWhiteboardOpen);
  }, [isWhiteboardOpen]);

  // Function to update Excalidraw data with useCallback to prevent re-renders
  const handleExcalidrawChange = useCallback((elements: any, appState: any) => {
    setExcalidrawData((prevData) => {
      const safeElements = Array.isArray(elements) ? elements : [];
      const hasChanges =
        JSON.stringify(prevData.elements) !== JSON.stringify(safeElements) ||
        JSON.stringify(prevData.appState) !== JSON.stringify(appState);

      if (!hasChanges) return prevData;
      return {
        elements: safeElements,
        appState: appState || { viewBackgroundColor: "#ffffff" },
      };
    });
  }, []);

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      setShow("ended");
    }
  }, [callingState]);

  return (
    <StreamTheme className="h-screen w-screen overflow-hidden">
      {show === "lobby" && (
        <div className="h-full w-full">
          <CallLobby onJoin={handleJoin} />
        </div>
      )}

      {show === "call" && (
        <div className="relative h-full w-full overflow-hidden">
          {/* Call Active Component - Full Screen */}
          <div className="h-full w-full">
            <CallActive
              meetingName={meetingName}
              onWhiteboardToggle={handleWhiteboardToggle}
              isWhiteboardOpen={isWhiteboardOpen}
            />
          </div>

          {/* Whiteboard Overlay - Full Screen */}
          {isWhiteboardOpen && (
            <div className="absolute inset-0 z-40 h-full w-full bg-white overflow-hidden">
              <div className="h-full w-full">
                <ExcalidrawWrapper
                  initialData={{
                    elements: Array.isArray(excalidrawData.elements)
                      ? excalidrawData.elements
                      : [],
                    appState: excalidrawData.appState || {
                      viewBackgroundColor: "#ffffff",
                    },
                  }}
                  // ...other props
                  onChange={handleExcalidrawChange}
                  meetingId={call?.id || ""}
                />
              </div>
              {/* Close Button */}
              <button
                onClick={() => setWhiteboardOpen(false)}
                className="absolute top-4 right-4 z-50 group flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800/90 text-white px-4 py-2 rounded-full shadow-lg border border-gray-700/50 transition-all duration-200 hover:scale-105"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                <span className="text-sm font-medium">Close Whiteboard</span>
              </button>
            </div>
          )}
        </div>
      )}

      {show === "ended" && (
        <div className="h-full w-full">
          <CallEnded />
        </div>
      )}
    </StreamTheme>
  );
};
