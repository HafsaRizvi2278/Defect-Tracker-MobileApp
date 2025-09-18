import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKHnZD0XP-YbA4cp4ReutZiXSVz_rzuFI",
  authDomain: "trackr-app-304e7.firebaseapp.com",
  projectId: "trackr-app-304e7",
  storageBucket: "trackr-app-304e7.firebasestorage.app",
  messagingSenderId: "787513016124",
  appId: "1:787513016124:web:a53f97849be115bb686839",
  measurementId: "G-E4KWLPSCFC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);