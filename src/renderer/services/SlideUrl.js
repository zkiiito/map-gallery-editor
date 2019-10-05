// const fileUrl = require('file-url');

function getThumbnailUrl(slide) {
    switch (slide.source) {
    case 'flickr':
        return slide.thumbnail;
    default:
        return fileUrl(slide.thumbnail);
    }
}

function getFullsizeUrl(slide) {
    switch (slide.source) {
    case 'flickr':
        return slide.path;
    default:
        return fileUrl(slide.path);
    }
}

export default {
    getFullsizeUrl,
    getThumbnailUrl,
};
