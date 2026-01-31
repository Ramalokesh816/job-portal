import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXsHV6RmCPp9O67qoCzUqccVEUhGIHcEA",
  authDomain: "job-portal-dfa84.firebaseapp.com",
  projectId: "job-portal-dfa84",
  storageBucket: "job-portal-dfa84.firebasestorage.app",
  messagingSenderId: "566734292957",
  appId: "1:566734292957:web:072b71b3609b6de6965834"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

