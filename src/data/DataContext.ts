import { createContext } from "react";
import { DB_NAME } from "../const";

export const COLLECTIONS = [
  DB_NAME.ACTION,
  DB_NAME.CARRIER,
  DB_NAME.CLIENT,
  DB_NAME.VOLUNTEER,
  DB_NAME.REQUEST,
] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

export interface CollectionState {
  data: unknown[];
  loading: boolean;
}

export type DataState = Record<CollectionName, CollectionState>;

export const DataContext = createContext<DataState | null>(null);
