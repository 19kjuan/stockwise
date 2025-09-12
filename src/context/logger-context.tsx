"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";

export type LogEntry = {
  message: string;
  timestamp: string;
  type: "info" | "success" | "error" | "warning";
};

type LoggerContextType = {
  logs: LogEntry[];
  addLog: (
    message: string,
    type?: "info" | "success" | "error" | "warning"
  ) => void;
};

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

export function LoggerProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "info") => {
      const newLog: LogEntry = {
        message,
        timestamp: new Date().toLocaleTimeString(),
        type,
      };
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    },
    []
  );
  
  return (
    <LoggerContext.Provider value={{ logs, addLog }}>
      {children}
    </LoggerContext.Provider>
  );
}

export function useLogger() {
  const context = useContext(LoggerContext);
  if (context === undefined) {
    throw new Error("useLogger must be used within a LoggerProvider");
  }
  return context;
}
