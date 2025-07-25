"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useCallback, useRef } from "react";

interface ExcalidrawWrapperProps {
  initialData?: {
    elements: any[];
    appState: any;
  };
  onChange?: (elements: any, appState: any) => void;
}

const ExcalidrawWrapper = ({ initialData, onChange }: ExcalidrawWrapperProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback((elements: any, appState: any) => {
    if (!onChange) return;

    // Debounce the onChange calls to prevent rapid updates
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(elements, appState);
    }, 100); // 100ms debounce
  }, [onChange]);

  return (
    <div className="h-full w-full bg-white">
      <Excalidraw
        theme="light"
        initialData={initialData || {
          elements: [],
          appState: {
            viewBackgroundColor: "#ffffff",
          },
        }}
        onChange={handleChange}
      />
    </div>
  );
};

export default ExcalidrawWrapper;