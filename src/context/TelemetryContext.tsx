import React, { createContext, useContext, useEffect, useRef } from "react";
import { apiClient } from "@/api/client";

interface TelemetryCtx {
  setHoneypotSessionId: (id: string | null | undefined) => void;
}

const Ctx = createContext<TelemetryCtx | null>(null);

// A single, app-wide, invisible click listener -- mounted once for the lifetime
// of the app (every route, not just Pay), silently POSTing X/Y coordinates and
// the target element to the honeypot telemetry endpoint once a honeypot session
// has been established. Before a session exists this is a complete no-op.
export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sessionIdRef = useRef<string | null>(null);

  function setHoneypotSessionId(id: string | null | undefined) {
    sessionIdRef.current = id ?? null;
  }

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;
      const target = e.target as HTMLElement;
      const classAttr = typeof target.className === "string" ? target.className : "";
      // Fire and forget - do not await or handle errors to remain invisible
      apiClient
        .post(`/api/v1/honeypot/${sessionId}/telemetry`, {
          action_type: "click",
          target_element:
            target.tagName + (target.id ? `#${target.id}` : "") + (classAttr ? `.${classAttr.replace(/ /g, ".")}` : ""),
          x_coord: e.clientX,
          y_coord: e.clientY,
        })
        .catch(() => {});
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return <Ctx.Provider value={{ setHoneypotSessionId }}>{children}</Ctx.Provider>;
};

export function useTelemetry() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTelemetry must be used inside TelemetryProvider");
  return ctx;
}
