import AppServer from '@/services/AppServer';
import store from '@/store';

let fileUrl = (url) => url;

if (!process.env.IS_WEB) {
    fileUrl = require('file-url');
}

function getExportedFilename(slide) {
    if (slide.source === 'flickr') {
        return slide.path;
    }
    return `export_${slide.id}_${slide.filename}`;
}

function getThumbnailUrl(slide) {
    switch (slide.source) {
    case 'flickr':
        return slide.thumbnail;
    case 'web':
        return slide.uploaded ? AppServer.getSlideUrl(slide, store.state.gallery.id) : slide.path;
    default:
        return fileUrl(slide.thumbnail);
    }
}

function getFullsizeUrl(slide) {
    switch (slide.source) {
    case 'flickr':
        return slide.path;
    case 'web':
        return slide.uploaded ? AppServer.getSlideUrl(slide, store.state.gallery.id) : slide.path;
    default:
        return fileUrl(slide.path);
    }
}

export default {
    getFullsizeUrl,
    getThumbnailUrl,
    getExportedFilename,
    fileUrl,
};
