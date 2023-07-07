// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5gt6ORQYS9HKura-ixEWCJg9PfEOtGFw",
  authDomain: "fir-social-b21c1.firebaseapp.com",
  projectId: "fir-social-b21c1",
  storageBucket: "fir-social-b21c1.appspot.com",
  messagingSenderId: "63738299017",
  appId: "1:63738299017:web:fcd60a2d5b69c164f0bc58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();