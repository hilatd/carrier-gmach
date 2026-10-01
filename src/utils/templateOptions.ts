export const TEMPLATE_LABELS = [
  "greeting",
  "followUp",
  "pickup",
  "reminder",
  "return",
  "waitingList",
  "payment",
  "other",
] as const;

export type TemplateLabel = (typeof TEMPLATE_LABELS)[number];

const TEMPLATE_LABEL_COLORS: Record<TemplateLabel, string> = {
  greeting: "purple",
  followUp: "blue",
  pickup: "green",
  reminder: "orange",
  return: "teal",
  waitingList: "yellow",
  payment: "pink",
  other: "gray",
};

export const labelColor = (label: string) =>
  TEMPLATE_LABEL_COLORS[label as TemplateLabel] ?? "gray";
