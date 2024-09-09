// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCn0dU0aD_Ck8VXTlxn4ePxNWra4ojR3v0",
  authDomain: "mern-chatapp-v2.firebaseapp.com",
  projectId: "mern-chatapp-v2",
  storageBucket: "mern-chatapp-v2.appspot.com",
  messagingSenderId: "657496001398",
  appId: "1:657496001398:web:a29fef1fe0cfbb144ac857",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

//gg project-657496001398
