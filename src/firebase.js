import firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBUbLZzMG3QzV2nbh-dK5nFA4QoHrbczII",
    authDomain: "streamplatformer.firebaseapp.com",
    databaseURL: "https://streamplatformer.firebaseio.com",
    projectId: "streamplatformer",
    storageBucket: "",
    messagingSenderId: "936421141576",
    appId: "1:936421141576:web:74724fab0660c599"
};
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export const auth = firebase.auth();

export const storage = firebase.storage();

export default firebase;