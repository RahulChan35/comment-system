import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmIf-O2M4IqztrBUnf4tCMF6zl1Eijio0",
  authDomain: "comment-system-81391.firebaseapp.com",
  projectId: "comment-system-81391",
  storageBucket: "comment-system-81391.appspot.com",
  messagingSenderId: "912118090857",
  appId: "1:912118090857:web:3e72b023a18f0ad8c9a6f8",
  measurementId: "G-KVLL2PC782"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
