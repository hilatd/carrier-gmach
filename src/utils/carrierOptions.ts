import type { CarrierState, CarrierTypes } from "../types";

export const CARRIER_TYPES: CarrierTypes[] = [
  "elastic", "woven_wrap", "rings", "mei_dai", "backpack", "accessories", "other"
];

export const CARRIER_STATES: CarrierState[] = [
  "good", "damaged", "for_sell", "maintenance"
];

export const stateColor: Record<CarrierState, string> = {
  good:        "green",
  damaged:     "red",
  for_sell:     "blue",
  maintenance: "orange",
};