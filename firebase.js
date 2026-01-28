import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBB9HzUx3hepzBxXk5tSIBZGSJ91ohfgiA",
  authDomain: "cogniprep.firebaseapp.com",
  projectId: "cogniprep",
  storageBucket: "cogniprep.firebasestorage.app",
  messagingSenderId: "1069253612446",
  appId: "1:1069253612446:web:53557140676e12a7f93c8f",
  measurementId: "G-ZSMZSWWN20"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 
export const storage = getStorage(app); 

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

githubProvider.setCustomParameters({
  allow_signup: 'false'
});

export default app;