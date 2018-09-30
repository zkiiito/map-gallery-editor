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
        EventBus.$emit('user', user);
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

function uploadFile(filename, buffer, galleryId) {
    const { uid } = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref().child(`users/${uid}/galleries/${galleryId}`);
    const metadata = {
        contentType: 'image/jpeg',
    };

    const ref = storageRef.child(filename);
    return ref.put(buffer, metadata);
}

function uploadGalleryData(galleryData) {
    const { uid } = firebase.auth().currentUser;
    const db = firebase.firestore();

    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: true,
    });

    return db.collection('users').doc(uid).collection('galleries').doc(galleryData.id)
        .set(galleryData);
}

init();

export default {
    loginByToken,
    logout,
    uploadFile,
    uploadGalleryData,
};
