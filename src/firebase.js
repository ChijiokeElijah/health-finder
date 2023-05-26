// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore}from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwITFXMIYe673NB-P2VwiKJAzTyCsIFe8",
  authDomain: "health-finder-59566.firebaseapp.com",
  projectId: "health-finder-59566",
  storageBucket: "health-finder-59566.appspot.com",
  messagingSenderId: "205565315891",
  appId: "1:205565315891:web:8c5ec6d0dcdc0e6a820c46"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()