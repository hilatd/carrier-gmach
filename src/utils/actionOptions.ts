import type { ActionStatus } from "../types";

export const ACTION_STATUSES: ActionStatus[] = [
  "lending",
  "returned",
  "waiting_list",
  "closed",
];

export const ACTION_STATUS_COLORS: Record<ActionStatus, string> = {
  lending: "yellow",
  returned: "green",
  waiting_list: "orange",
  closed: "gray",
};
