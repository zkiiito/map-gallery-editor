import EventBus from './EventBus';
import SlideUrl from '@/services/SlideUrl';

let firebaseApp;

if (process.env.IS_WEB) {
    /* global firebase */
    firebaseApp = firebase;
} else {
    firebaseApp = require('firebase/app');
    require('firebase/auth');
    require('firebase/storage');
    require('firebase/firestore');
}

let imageIndex = {};

function init() {
    firebaseApp.initializeApp({
        apiKey: 'AIzaSyBxJ2a3cME3l1zGkq5seDV_Czt4XBezg20',
        authDomain: 'mapgallery-216911.firebaseapp.com',
        databaseURL: 'https://mapgallery-216911.firebaseio.com',
        projectId: 'mapgallery-216911',
        storageBucket: 'mapgallery-216911.appspot.com',
        messagingSenderId: '1046834610547',
    });

    firebaseApp.auth().onAuthStateChanged((user) => {
        EventBus.$emit(EventBus.events.USER_CHANGED, user);
    });
}

function login() {
    const provider = new firebaseApp.auth.GoogleAuthProvider();
    firebaseApp.auth().signInWithPopup(provider);
}

function loginByToken(token) {
    const credential = firebaseApp.auth.GoogleAuthProvider.credential(null, token);
    firebaseApp.auth().signInWithCredential(credential)
        .catch((error) => {
            EventBus.$emit('error', error);
        });
}

function logout() {
    firebaseApp.auth().signOut();
}

async function uploadFile(filename, buffer, galleryId, modifiedAt) {
    const { uid } = firebaseApp.auth().currentUser;
    const storageRef = firebaseApp.storage().ref().child(`users/${uid}/galleries/${galleryId}`);
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
    const { uid } = firebaseApp.auth().currentUser;
    const db = firebaseApp.firestore();
    imageIndex = {};

    return db.collection('users').doc(uid).collection('galleries').doc(galleryData.id)
        .collection('imageindex')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                imageIndex[doc.get('name')] = doc.get('uploaded_at');
            });
            // console.log(imageIndex);
        });
}

function uploadGalleryData(galleryData) {
    const { uid } = firebaseApp.auth().currentUser;
    const db = firebaseApp.firestore();

    return getImageIndex(galleryData)
        .then(() => db.collection('users').doc(uid).collection('galleries').doc(galleryData.id)
            .set(galleryData));
}

function getPublishedUrl(galleryData) {
    const { uid } = firebaseApp.auth().currentUser;

    return `https://mapgallery.online/gallery/${uid}/${galleryData.id}`;
}

function getGalleries() {
    const { uid } = firebaseApp.auth().currentUser;
    const db = firebaseApp.firestore();

    return db.collection('users').doc(uid).collection('galleries').get()
        .then((querySnapshot) => {
            const res = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                data.slided = data.slides.map((slide) => {
                    slide.modified_at = slide.modified_at ? slide.modified_at.toDate().toString() : null;
                    slide.exif_date = slide.exif_date ? slide.exif_date.toDate().toString() : null;

                    return slide;
                });

                res.push(data);
            });

            return res;
        });
}

function getSlideUrl(slide, galleryId) {
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/mapgallery-216911.appspot.com/o/';
    const { uid } = firebaseApp.auth().currentUser;

    if (slide.source === 'web') {
        const dataPath = `users/${uid}/galleries/${galleryId}`;
        return `${baseUrl + encodeURIComponent(`${dataPath}/${SlideUrl.getExportedFilename(slide)}`)}?alt=media`;
    }

    return '';
}

init();

export default {
    loginByToken,
    login,
    logout,
    uploadFile,
    uploadGalleryData,
    getPublishedUrl,
    getGalleries,
    getSlideUrl,
};
