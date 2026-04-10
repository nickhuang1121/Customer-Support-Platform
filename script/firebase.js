import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyBnlaSIQNA9eBhPLtkFRaqufW3oDnbzYZ4",
    authDomain: "fir-test-1-15668.firebaseapp.com",
    projectId: "fir-test-1-15668",
    storageBucket: "fir-test-1-15668.firebasestorage.app",
    messagingSenderId: "1002731894330",
    appId: "1:1002731894330:web:21a170a7d1f906ac85a703",
    measurementId: "G-H9NRT7P5NN"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

