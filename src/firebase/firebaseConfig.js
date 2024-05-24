import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuxz1Jvhqv1wBDQrA72A_UvWEGjmWG7v8",
  authDomain: "payment-collection-1c4b9.firebaseapp.com",
  databaseURL: "https://payment-collection-1c4b9-default-rtdb.firebaseio.com",
  projectId: "payment-collection-1c4b9",
  storageBucket: "payment-collection-1c4b9.appspot.com",
  messagingSenderId: "1065732452873",
  appId: "1:1065732452873:web:e349b5149a999615d3fed8",
  measurementId: "G-0EDN4YHVL4",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default firebase;
