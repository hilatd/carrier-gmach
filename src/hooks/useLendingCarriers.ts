import { useMemo } from "react";
import type { Action } from "../types";

export function useLendingCarriers(
  actions: Action[],
  excludeActionId?: string | null
): Set<string> {
  return useMemo(
    () =>
      new Set(
        actions
          .filter((a) => a.status === "lending" && a.id !== excludeActionId)
          .map((a) => a.carrierId)
      ),
    [actions, excludeActionId]
  );
}
