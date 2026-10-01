import { useContext } from "react";
import { DataContext, type CollectionName } from "../data/DataContext";

export function useCollection<T>(name: string): { data: T[]; loading: boolean } {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useCollection must be used inside <DataProvider>");

  const state = ctx[name as CollectionName];
  if (!state) throw new Error(`Unknown collection: ${name}`);

  return state as { data: T[]; loading: boolean };
}
