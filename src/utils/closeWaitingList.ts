import { writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase";
import type { Action, Carrier } from "../types";

export async function closeDuplicateWaitingList(
  selectedCarrierId: string,
  clientId: string,
  carriers: Carrier[],
  actions: Action[]
): Promise<void> {
  if (!selectedCarrierId || !clientId) return;

  const carrier = carriers.find((c) => c.id === selectedCarrierId);
  if (!carrier) return;

  const similarCarrierIds = new Set(
    carriers
      .filter((c) => c.brand === carrier.brand && c.type === carrier.type && c.id !== carrier.id)
      .map((c) => c.id!)
  );

  const toClose = actions.filter(
    (a) =>
      a.clientId === clientId && a.status === "waiting_list" && similarCarrierIds.has(a.carrierId)
  );

  if (!toClose.length) return;

  const batch = writeBatch(db);
  const now = Date.now();
  for (const a of toClose) {
    batch.update(doc(db, "actions", a.id!), {
      status: "closed",
      notes: "closed automatically",
      updatedAt: now,
    });
  }

  await batch.commit().catch((error) => console.error("Batch update failed:", error));
}
