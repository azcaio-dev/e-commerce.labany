import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// 🔴 SUBSTITUA pelos dados do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCMRSwZ0IAZd284yhAk091iLdMgxCHOsuo",
  authDomain: "loja-labany2.firebaseapp.com",
  projectId: "loja-labany2",
  storageBucket: "loja-labany2.firebasestorage.app",
  messagingSenderId: "1057706920841",
  appId: "1:1057706920841:web:dad6ce4b538dc918452f58"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

// Exporta serviços
export const db = getFirestore(app)
export const auth = getAuth(app)