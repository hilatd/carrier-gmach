import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

export async function softDeleteCarrier(carrierId: string): Promise<void> {
  const now = Date.now();

  // 1 — soft delete the carrier
  await updateDoc(doc(db, "carriers", carrierId), {
    deletedAt: now,
    updatedAt: now,
  });

  // 2 — soft delete all related actions
  const actionsQuery = query(
    collection(db, "actions"),
    where("carrierId", "==", carrierId),
    where("deletedAt", "==", null)
  );
  const actionsSnap = await getDocs(actionsQuery);
  await Promise.all(
    actionsSnap.docs.map((d) =>
      updateDoc(d.ref, { deletedAt: now, updatedAt: now })
    )
  );
}