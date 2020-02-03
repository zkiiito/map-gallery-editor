import EventBus from './EventBus';
import SlideUrl from '@/services/SlideUrl';

/* global firebase */
const firebaseApp = firebase;
let imageIndex = {};

function init() {
    firebaseApp.initializeApp({
        apiKey: 'AIzaSyBxJ2a3cME3l1zGkq5seDV_Czt4XBezg20',
        authDomain: 'mapgallery.online',
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
    return firebaseApp.auth().signInWithPopup(provider);
}

function loginWithPhotosAccess() {
    const provider = new firebaseApp.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/photoslibrary.readonly');
    return firebaseApp.auth().signInWithPopup(provider).then((result) => result.credential.accessToken);
}

function loginByToken(token) {
    const credential = firebaseApp.auth.GoogleAuthProvider.credential(null, token);
    return firebaseApp.auth().signInWithCredential(credential)
        .catch((error) => {
            EventBus.$emit('error', error);
        });
}

function logout() {
    return firebaseApp.auth().signOut();
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

    galleryData = Object.assign(galleryData, { updated_at: firebaseApp.firestore.FieldValue.serverTimestamp() });

    return getImageIndex(galleryData)
        .then(() => db.collection('users').doc(uid).collection('galleries').doc(galleryData.id)
            .set(galleryData));
}

function deleteGallery(galleryData) {
    const { uid } = firebaseApp.auth().currentUser;
    const db = firebaseApp.firestore();

    return db.collection('users').doc(uid).collection('galleries').doc(galleryData.id)
        .delete();
}

function getPublishedUrl(galleryData) {
    const { uid } = firebaseApp.auth().currentUser;

    return `https://mapgallery.online/gallery/${uid}/${galleryData.id}`;
}

function getGalleries() {
    const { uid } = firebaseApp.auth().currentUser;
    const db = firebaseApp.firestore();

    return db.collection('users').doc(uid).collection('galleries')
        // .orderBy('updated_at', 'desc')
        .get()
        .then((querySnapshot) => {
            const res = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                data.slides = data.slides.map((slide) => {
                    if (slide.from === undefined) {
                        slide.modified_at = slide.modified_at ? slide.modified_at.toDate()
                            .toString() : null;
                        slide.exif_date = slide.exif_date ? slide.exif_date.toDate()
                            .toString() : null;
                    }

                    return slide;
                });

                res.push(data);
            });

            res.sort((a, b) => {
                if (a.updated_at && b.updated_at) {
                    return a.updated_at.seconds - b.updated_at.seconds;
                }

                return a.updated_at ? 1 : -1;
            });

            return res;
        });
}

function getSlideUrl(slide, galleryId) {
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/mapgallery-216911.appspot.com/o/';
    const { uid } = firebaseApp.auth().currentUser;

    if (slide.source === 'web' || slide.source === null || slide.source === undefined || slide.source === 'app') {
        const dataPath = `users/${uid}/galleries/${galleryId}`;
        return `${baseUrl + encodeURIComponent(`${dataPath}/${SlideUrl.getExportedFilename(slide)}`)}?alt=media`;
    }

    return '';
}

function getSlideThumbnailUrl(slide, galleryId) {
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/mapgallery-216911.appspot.com/o/';
    const { uid } = firebaseApp.auth().currentUser;

    if (slide.source === 'web' || slide.source === null || slide.source === undefined || slide.source === 'app') {
        const dataPath = `users/${uid}/galleries/${galleryId}`;
        return `${baseUrl + encodeURIComponent(`${dataPath}/thumbs/${SlideUrl.getExportedThumbnailFilename(slide)}`)}?alt=media`;
    }

    return '';
}

init();

export default {
    loginByToken,
    login,
    loginWithPhotosAccess,
    logout,
    uploadFile,
    uploadGalleryData,
    getPublishedUrl,
    getGalleries,
    getSlideUrl,
    getSlideThumbnailUrl,
    deleteGallery,
};
