import AppServer from '@/services/AppServer';

let token = null;
let nextPageToken = null;

function auth() {
    if (token !== null) {
        return Promise.resolve();
    }

    return AppServer.loginWithPhotosAccess().then((_token) => {
        token = _token;
    });
}

function getPhotos(nextPage) {
    return auth().then(() => {
        let url = 'https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100';
        if (nextPage && nextPageToken !== null) {
            url += `&pageToken=${nextPageToken}`;
        }

        return fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    })
        .then((result) => result.json())
        .then((result) => {
            nextPageToken = result.nextPageToken;
            return result.mediaItems;
        });
}

export default {
    getPhotos,
};
