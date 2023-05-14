import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import 'firebase/firestore'
import { getAuth} from "firebase/auth/react-native";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyAQNHA1u6PRmuFeAFFsCaTFmUCHptIpOIc",
    authDomain: "porra-32b5a.firebaseapp.com",
    projectId: "porra-32b5a",
    storageBucket: "porra-32b5a.appspot.com",
    messagingSenderId: "711539837177",
    appId: "1:711539837177:web:172cb3a7746bd49add7a28",
    measurementId: "G-NDJDY2Q8W0"
};



export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth();

export const analytics = getAnalytics(app);
