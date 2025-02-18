// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCM2FdJVuZ0ZJ5oQXGh7pwO0989Hpd__1M",
  authDomain: "notes-app-25060.firebaseapp.com",
  databaseURL: "https://notes-app-25060-default-rtdb.firebaseio.com",
  projectId: "notes-app-25060",
  storageBucket: "notes-app-25060.firebasestorage.app",
  messagingSenderId: "198637381603",
  appId: "1:198637381603:web:19f6d0771f0429362be2d6",
  measurementId: "G-LMB79ZH9NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { db };