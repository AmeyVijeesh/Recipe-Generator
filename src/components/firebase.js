import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD30wOJpJ0OE5YfNiENvd5QLF0Vm78X7Yc',
  authDomain: 'todoapp-31499.firebaseapp.com',
  projectId: 'todoapp-31499',
  storageBucket: 'todoapp-31499.appspot.com',
  messagingSenderId: '422033885155',
  appId: '1:422033885155:web:2008395b445099583742d6',
  measurementId: 'G-6F30T3E8J2',
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
setPersistence(auth, browserLocalPersistence);
export { db, auth, storage };
