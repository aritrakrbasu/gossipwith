import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
const app = firebase.initializeApp({
  apiKey: "AIzaSyBJ7WflC9emuScsvHq_K5W9YxEnzkEmHks",
    authDomain: "gossipwith-deploy.firebaseapp.com",
    projectId: "gossipwith-deploy",
    storageBucket: "gossipwith-deploy.appspot.com",
    messagingSenderId: "194216053702",
    appId: "1:194216053702:web:178a6d4e9391e29d8e00c7",
    measurementId: "G-1Z8MHXYKTZ"
})

export const auth = app.auth()
export const db = firebase.firestore();
export const firebasevalue = firebase.firestore.FieldValue
export default app