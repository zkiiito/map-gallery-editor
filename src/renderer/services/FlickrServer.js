import EventBus from '../EventBus';

let userId = null;
let userToken = null;

function init(_userId, _userToken) {
    userId = _userId;
    userToken = _userToken;
}

function getPhotosets() {
    const url = `https://mapgallery.online/flickr/${userId}/photosets?userToken=${userToken}`;
}

function getPhotosFromPhotoset(photosetId) {
    const url = `https://mapgallery.online/flickr/${userId}/photosets/${photosetId}?userToken=${userToken}`;
}

export default {
    init,
    getPhotosets,
    getPhotosFromPhotoset,
};
