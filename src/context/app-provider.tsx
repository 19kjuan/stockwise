"use client";

import type { ReactNode } from "react";
import { LoggerProvider } from "./logger-context";

export function AppProvider({ children }: { children: ReactNode }) {
  return <LoggerProvider>{children}</LoggerProvider>;
}
