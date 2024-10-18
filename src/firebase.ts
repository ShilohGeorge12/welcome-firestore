// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBfruEI4Cas67utv-Z-m93VcU2N94Dk4bc',
	authDomain: 'welcome-firebase-3413f.firebaseapp.com',
	projectId: 'welcome-firebase-3413f',
	storageBucket: 'welcome-firebase-3413f.appspot.com',
	messagingSenderId: '654529284633',
	appId: '1:654529284633:web:0a81de56227af322117888',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();
