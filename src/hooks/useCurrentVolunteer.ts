import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthState } from "./useAuthState";
import type { Volunteer } from "../types";

export function useCurrentVolunteer() {
  const { user } = useAuthState();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    if (!user?.email) return;
    const fetch = async () => {
      const q = query(collection(db, "volunteers"), where("email", "==", user.email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setVolunteer({ id: snap.docs[0].id, ...snap.docs[0].data() } as Volunteer);
      }
    };
    fetch();
  }, [user?.email]);

  return volunteer;
}
