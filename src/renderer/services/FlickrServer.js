let userId = null;
let userToken = null;

function init(_userId, _userToken) {
    userId = _userId;
    userToken = _userToken;
}

function getPhotosets() {
    const url = `https://mapgallery.online/flickr/${userId}/photosets?userToken=${userToken}`;

    return fetch(url).then((response) => response.json());
}

function getPhotosFromPhotoset(photosetId) {
    const url = `https://mapgallery.online/flickr/${userId}/photosets/${photosetId}?userToken=${userToken}`;

    return fetch(url).then((response) => response.json());
}

export default {
    init,
    getPhotosets,
    getPhotosFromPhotoset,
};
