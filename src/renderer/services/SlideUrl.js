let fileUrl = (url) => url;

if (!process.env.IS_WEB) {
    fileUrl = require('file-url');
}

function getThumbnailUrl(slide) {
    switch (slide.source) {
    case 'flickr':
    case 'web':
        return slide.thumbnail;
    default:
        return fileUrl(slide.thumbnail);
    }
}

function getFullsizeUrl(slide) {
    switch (slide.source) {
    case 'flickr':
    case 'web':
        return slide.path;
    default:
        return fileUrl(slide.path);
    }
}

export default {
    getFullsizeUrl,
    getThumbnailUrl,
};
