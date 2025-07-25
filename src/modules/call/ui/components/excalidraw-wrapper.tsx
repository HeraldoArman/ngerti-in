"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { exportToBlob } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

interface ExcalidrawWrapperProps {
  initialData?: {
    elements: any[];
    appState: any;
  };
  onChange?: (elements: any, appState: any) => void;
  meetingId: string;
}

const ExcalidrawWrapper = ({
  initialData,
  onChange,
  meetingId,
}: ExcalidrawWrapperProps) => {
  const excalidrawRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // SOLUSI: Validasi aman di sini
  const safeInitialData = {
    elements: Array.isArray(initialData?.elements)
      ? initialData.elements
      : [],
    appState: initialData?.appState || {
      viewBackgroundColor: "#ffffff",
      currentItemFontFamily: 1,
      viewModeEnabled: false,
    },
  };

  const handleChange = useCallback(
    (elements: any, appState: any) => {
      if (!onChange) return;

      const safeElements = Array.isArray(elements) ? elements : [];

      onChange(safeElements, appState || { viewBackgroundColor: "#ffffff" });
    },
    [onChange],
  );

  const handleAskAI = async () => {
    setAiLoading(true);
    setAiResponse(null);

    const api = excalidrawRef.current;
    if (!api) return;

    const elements = api.getSceneElements() || [];
    const appState = api.getAppState() || { viewBackgroundColor: "#ffffff" };

    try {
      const imageBlob = await exportToBlob({
        elements,
        appState,
        mimeType: "image/png",
        exportBackground: true,
        exportPadding: 20,
      });

      const arrayBuffer = await imageBlob.arrayBuffer();
      const imageBase64 = Buffer.from(arrayBuffer).toString("base64");

      const res = await fetch("/api/ai-whiteboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elements,
          appState,
          meetingId,
          imageBase64,
        }),
      });

      const data = await res.json();

      // if (data?.answer && api) {
        // setAiResponse(data.answer);
        
        // Create text element manually
        // const textElement = {
          // id: `ai-${Date.now()}`,
          // type: "text",
          // x: 100,
          // y: 300,
          // width: 300,
          // height: 100,
          // text: data.answer,
          // fontSize: 24,
          // strokeColor: "#8000ff",
          // fontFamily: 1,
          // Add other required properties
        // } as any;
        
        // Add to scene
        // api.updateScene({
        //   elements: [...elements, textElement]
        // });
      // }
    } catch (error) {
      console.error("Error asking AI:", error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-white">
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawRef.current = api;
        }}
        initialData={safeInitialData} // Gunakan safeInitialData
        onChange={handleChange}
      />
      <button
        onClick={handleAskAI}
        className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center gap-2 font-medium disabled:cursor-not-allowed"
        disabled={aiLoading}
      >
        {aiLoading ? "Processing..." : "Ask AI"}
      </button>
      {aiResponse && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 max-w-md bg-white shadow-lg border border-gray-200 px-6 py-4 rounded-xl text-black z-50">
          <div className="font-bold mb-1">AI Answer:</div>
          <div className="whitespace-pre-line">{aiResponse}</div>
        </div>
      )}
    </div>
  );
};

export default ExcalidrawWrapper;
