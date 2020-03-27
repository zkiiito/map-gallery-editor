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

function getNewBaseurl(googlePhotoIds) {
    const PHOTOS_PER_BATCH = 50;
    const promises = [];

    return auth().then(() => {
        const baseUrl = 'https://photoslibrary.googleapis.com/v1/mediaItems:batchGet?';

        for (let i = 0; i < Math.ceil(googlePhotoIds.length / PHOTOS_PER_BATCH); i++) {
            const queryIds = googlePhotoIds.slice(0).splice(i * PHOTOS_PER_BATCH, PHOTOS_PER_BATCH);
            const queryParams = queryIds.map((id) => `mediaItemIds=${id}`);
            const url = `${baseUrl}${queryParams.join('&')}`;

            const promise = fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((result) => result.json())
                .then((result) => result.mediaItemResults);

            promises.push(promise);
        }
        return Promise.all(promises).then((results) => results.reduce((arr, res) => arr.concat(res), []));
    });
}

function updateSlides(slides) {
    const googlePhotoIds = slides.reduce((googlePhotoIds, slide) => {
        if (slide.source && slide.source === 'google-photos') {
            googlePhotoIds.push(slide.photo_id);
        }
        return googlePhotoIds;
    }, []);

    if (googlePhotoIds.length > 0) {
        return getNewBaseurl(googlePhotoIds)
            .then((mediaItemResults) => slides.map((slide) => {
                if (slide.source && slide.source === 'google-photos') {
                    const mediaItemResult = mediaItemResults.find(
                        (mediaItemResult) => mediaItemResult.mediaItem.id === slide.photo_id,
                    );
                    if (mediaItemResult) {
                        slide.path = `${mediaItemResult.mediaItem.baseUrl}=w1920-h1080`;
                        slide.thumbnail = `${mediaItemResult.mediaItem.baseUrl}=w150-h150`;
                    }
                }
                return slide;
            }));
    }
    return Promise.resolve(slides);
}

function setToken(_token) {
    token = _token;
}

function authReady() {
    return token !== null;
}

export default {
    getPhotos,
    updateSlides,
    setToken,
    authReady,
};
