import type { ActionStatus } from "../types";

export const ACTION_STATUSES: ActionStatus[] = [
  "open", "lending", "returned", "waiting_list", "closed",
];

export const ACTION_STATUS_COLORS: Record<ActionStatus, string> = {
  open:         "purple",
  lending:      "yellow",
  returned:     "green",
  waiting_list: "orange",
  closed:       "gray",
};