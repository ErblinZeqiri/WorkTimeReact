// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

//import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export class firebaseConfig {
    constructor() {
        this.init() 
        this.getApp()
    }

    init(){    
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCEtmKIbRKlsUFPSt6dBVy9yxCNyvW4oUs",
            authDomain: "worktime-ff90a.firebaseapp.com",
            databaseURL: "https://worktime-ff90a-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "worktime-ff90a",
            storageBucket: "worktime-ff90a.appspot.com",
            messagingSenderId: "49314853679",
            appId: "1:49314853679:web:1a70da158449fabbd0a7da"
        };
        
        // Initialize Firebase
        this.app = initializeApp(firebaseConfig);
    }

    getApp() {
        return this.app;
    }
}
