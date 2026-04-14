import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBd_PRZhODpKn2NXqIRxSN8qJ2BL_9vSAc",
  authDomain: "padelplus-6a44c.firebaseapp.com",
  projectId: "padelplus-6a44c",
  storageBucket: "padelplus-6a44c.firebasestorage.app",
  messagingSenderId: "257092440372",
  appId: "1:257092440372:web:f3fae314107ee4b231d561"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
