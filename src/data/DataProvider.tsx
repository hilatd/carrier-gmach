import { useEffect, useState, type ReactNode } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { COLLECTIONS, DataContext, type DataState } from "./DataContext";

const initial = Object.fromEntries(
  COLLECTIONS.map((name) => [name, { data: [], loading: true }])
) as DataState;

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(initial);

  useEffect(() => {
    const unsubscribes = COLLECTIONS.map((name) => {
      const q = query(
        collection(db, name),
        where("deletedAt", "==", null),
        orderBy("createdAt", "desc")
      );

      return onSnapshot(
        q,
        (snap) =>
          setState((prev) => ({
            ...prev,
            [name]: {
              data: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
              loading: false,
            },
          })),
        (error) => {
          console.error(`Failed to load ${name}:`, error);
          // don't leave the UI stuck on loading
          setState((prev) => ({ ...prev, [name]: { data: [], loading: false } }));
        }
      );
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, []);

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}
