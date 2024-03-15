import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp,getDoc,doc } from "firebase/firestore"; // Correct import
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  app,
  db,
  auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  collection,
  addDoc,
  onSnapshot,
  updateProfile,
  getStorage,
  serverTimestamp,
  doc,
  getDoc
};
