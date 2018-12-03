import EventBus from '../EventBus';
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/storage');
require('firebase/firestore');

let imageIndex = {};

function init() {
    firebase.initializeApp({
        apiKey: 'AIzaSyBxJ2a3cME3l1zGkq5seDV_Czt4XBezg20',
        authDomain: 'mapgallery-216911.firebaseapp.com',
        databaseURL: 'https://mapgallery-216911.firebaseio.com',
        projectId: 'mapgallery-216911',
        storageBucket: 'mapgallery-216911.appspot.com',
        messagingSenderId: '1046834610547',
    });

    firebase.firestore().settings({
        timestampsInSnapshots: true,
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

async function uploadFile(filename, buffer, galleryId, modifiedAt) {
    const { uid } = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref().child(`users/${uid}/galleries/${galleryId}`);
    const metadata = {
        contentType: 'image/jpeg',
    };

    const ref = storageRef.child(filename);
    const modifiedAtTime = new Date(modifiedAt).getTime();
    const doUpload = imageIndex[ref.fullPath] === undefined || modifiedAtTime > imageIndex[ref.fullPath];

    // console.log(filename, ref.fullPath, modifiedAtTime, imageIndex[ref.fullPath], doUpload);

    return doUpload ? ref.put(buffer, metadata) : true;
}

function getImageIndex(galleryData) {
    const { uid } = firebase.auth().currentUser;
    const db = firebase.firestore();
    imageIndex = {};

    return db.collection('users').doc(uid).collection('imageindexes').doc(galleryData.id)
        .collection('images')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                imageIndex[doc.get('name')] = doc.get('uploaded_at');
            });
            // console.log(imageIndex);
        });
}

function uploadGalleryData(galleryData) {
    const { uid } = firebase.auth().currentUser;
    const db = firebase.firestore();

    return getImageIndex(galleryData)
        .then(() => db.collection('users').doc(uid).collection('galleries').doc(galleryData.id)
            .set(galleryData));
}

function getPublishedUrl(galleryData) {
    const { uid } = firebase.auth().currentUser;

    return `https://mapgallery.online/gallery/${uid}/${galleryData.id}`;
}

init();

export default {
    loginByToken,
    logout,
    uploadFile,
    uploadGalleryData,
    getPublishedUrl,
};
