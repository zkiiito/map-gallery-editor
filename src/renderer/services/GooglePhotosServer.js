import EventBus from './EventBus';

let token = null;

function setToken(pToken) {
    token = pToken;
    EventBus.$emit(EventBus.events.GOOGLE_PHOTOS_USER_READY);
}

function isAuthenticated() {
    return token !== null;
}

function getPhotos() {
    return fetch('https://photoslibrary.googleapis.com/v1/mediaItems', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((result) => result.json())
        .then((result) => result.mediaItems);
}

export default {
    setToken,
    isAuthenticated,
    getPhotos,
};
