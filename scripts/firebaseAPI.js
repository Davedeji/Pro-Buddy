var firebaseConfig = {
    apiKey: "AIzaSyA7CV3TMTkasLK9leGD6aMMywkAQQOUXdM",
    authDomain: "pro-buddy.firebaseapp.com",
    projectId: "pro-buddy",
    storageBucket: "pro-buddy.appspot.com",
    messagingSenderId: "55992554126",
    appId: "1:55992554126:web:f331f390ea11cb09836fdf"
};


const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();