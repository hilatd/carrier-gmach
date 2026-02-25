import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDruSKOEFs1e8ppkf2R_h-JTh5npoaZTxs",
  authDomain: "carrier-gmach.firebaseapp.com",
  projectId: "carrier-gmach",
  storageBucket: "carrier-gmach.firebasestorage.app",
  messagingSenderId: "664304808453",
  appId: "1:664304808453:web:66413dfbb017fdfb6c226c",
  measurementId: "G-H5WBY1B61H",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
