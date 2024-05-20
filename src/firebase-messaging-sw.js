// This sample application is using 9.22, make sure you are importing the same version

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-sw.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAB4iAHd6ReFxw14pjMJ36m3b1vOOCtHXU",
    authDomain: "proyectoudistrital-97c58.firebaseapp.com",
    projectId: "proyectoudistrital-97c58",
    storageBucket: "proyectoudistrital-97c58.appspot.com",
    messagingSenderId: "771845660727",
    appId: "1:771845660727:web:95ec83640d172e6ec09fb2",
    measurementId: "G-9SHRBS3Z80"
});


const messaging = getMessaging(firebaseApp);