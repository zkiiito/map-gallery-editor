import EventBus from '../EventBus';
const firebase = require('firebase');

function init() {
    firebase.initializeApp({
        apiKey: 'AIzaSyBxJ2a3cME3l1zGkq5seDV_Czt4XBezg20',
        authDomain: 'mapgallery-216911.firebaseapp.com',
        databaseURL: 'https://mapgallery-216911.firebaseio.com',
        projectId: 'mapgallery-216911',
        storageBucket: 'mapgallery-216911.appspot.com',
        messagingSenderId: '1046834610547',
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            EventBus.$emit('user', user);
        } else {
            EventBus.$emit('user', null);
        }
    });
}

function loginByToken(token) {
    const credential = firebase.auth.GoogleAuthProvider.credential(null, token);
    firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .catch((error) => {
            EventBus.$emit('error', error);
        });
}

function logout() {
    firebase.auth().signOut();
}

function uploadFile(filename, buffer, projectId) {
    const storageRef = firebase.storage().ref().child(`users/${firebase.auth().currentUser.uid}/galleries/${projectId}`);
    const metadata = {
        contentType: 'image/jpeg',
    };

    const ref = storageRef.child(filename);
    ref.put(buffer, metadata).then((snapshot) => {
        console.log(snapshot);
    });
}

init();

export default {
    loginByToken,
    logout,
    uploadFile,
};
