/* eslint-disable @typescript-eslint/no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDruSKOEFs1e8ppkf2R_h-JTh5npoaZTxs",
  authDomain: "carrier-gmach.firebaseapp.com",
  projectId: "carrier-gmach",
  storageBucket: "carrier-gmach.firebasestorage.app",
  messagingSenderId: "664304808453",
  appId: "1:664304808453:web:66413dfbb017fdfb6c226c",
  measurementId: "G-H5WBY1B61H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);