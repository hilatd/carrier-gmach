import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export function useCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    return onSnapshot(q, snap => {
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as T)));
      setLoading(false);
    });
  }, [collectionName]);

  return { data, loading };
}