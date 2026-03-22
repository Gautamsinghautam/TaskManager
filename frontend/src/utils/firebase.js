// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY ,
  authDomain: "taskmanager-c56d5.firebaseapp.com",
  projectId: "taskmanager-c56d5",
  storageBucket: "taskmanager-c56d5.firebasestorage.app",
  messagingSenderId: "390071538150",
  appId: "1:390071538150:web:c13f2a0587c79bc9c20627",
  measurementId: "G-NV2EE8GB1E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);