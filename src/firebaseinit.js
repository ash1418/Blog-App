// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGPutt6y5KQ_IV2d5Nf9K41VEgeamME04",
  authDomain: "blogging-app-b483d.firebaseapp.com",
  projectId: "blogging-app-b483d",
  storageBucket: "blogging-app-b483d.appspot.com",
  messagingSenderId: "683577634242",
  appId: "1:683577634242:web:1783cba454f0a9e44ffa5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);