import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCMRSwZ0IAZd284yhAk091iLdMgxCHOsuo",
  authDomain: "loja-labany2.firebaseapp.com",
  projectId: "loja-labany2",
  storageBucket: "loja-labany2.firebasestorage.app",
  messagingSenderId: "1057706920841",
  appId: "1:1057706920841:web:dad6ce4b538dc918452f58",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function copyCollection(oldCollection, newPath) {
  const snapshot = await getDocs(collection(db, oldCollection))

  for (const item of snapshot.docs) {
    const data = item.data()

    await setDoc(doc(db, newPath, item.id), data)
    console.log(`Copiado: ${oldCollection}/${item.id}`)
  }
}

async function migrate() {
  await copyCollection("products", "stores/labany/products")
  await copyCollection("banners", "stores/labany/banners")

  console.log("Migração concluída!")
}

migrate()