import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

interface ErrorLog {
  type: string;
  error: string;
  timestamp?: number;
  [key: string]: unknown;
}

export async function logError(details: ErrorLog): Promise<void> {
  await addDoc(collection(db, "error_logs"), {
    ...details,
    timestamp: details.timestamp ?? Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  });
}
