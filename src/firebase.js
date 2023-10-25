import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAgRRyw_hzig4TMo1EXnqYyulkWTwg3UVQ",
    authDomain: "rifa-app-e6985.firebaseapp.com",
    databaseURL: "https://rifa-app-e6985-default-rtdb.firebaseio.com",
    projectId: "rifa-app-e6985",
    storageBucket: "rifa-app-e6985.appspot.com",
    messagingSenderId: "788773391107",
    appId: "1:788773391107:web:2a3842510c801fa7b5b736",
    measurementId: "G-BDLC02VKVN"
};

const app = firebase.initializeApp(firebaseConfig); // Inicializa la aplicación Firebase
const firestore = app.firestore(); // Obtiene una instancia de Firestore

export { firestore };
