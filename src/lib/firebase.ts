import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD94jGmmKNh7rojQAEnlB3IpLWT0q6rRBk",
  authDomain: "waslny1git-73803955-45f9e.firebaseapp.com",
  projectId: "waslny1git-73803955-45f9e",
  storageBucket: "waslny1git-73803955-45f9e.firebasestorage.app",
  messagingSenderId: "854901404480",
  appId: "1:854901404480:web:d88ccee2ac92b8519f80a5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
