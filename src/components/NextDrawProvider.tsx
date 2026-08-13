"use client";

import { createContext, useContext } from "react";
import type { NextDrawSnapshot } from "@/lib/lottery/next-draw";

const NextDrawContext = createContext<NextDrawSnapshot | null>(null);

export function NextDrawProvider({
  snapshot,
  children,
}: {
  snapshot: NextDrawSnapshot | null;
  children: React.ReactNode;
}) {
  return (
    <NextDrawContext.Provider value={snapshot}>{children}</NextDrawContext.Provider>
  );
}

export function useNextDrawSnapshot() {
  return useContext(NextDrawContext);
}
