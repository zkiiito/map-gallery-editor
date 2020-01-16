import AppServer from '@/services/AppServer';
import store from '@/store';

let fileUrl = (url) => url;

if (!process.env.IS_WEB) {
    fileUrl = require('file-url');
}

function getExportedFilename(slide) {
    if (slide.source === 'flickr' || slide.source === 'google-photos') {
        return slide.path;
    }
    return `export_${slide.id}_${slide.filename}`;
}

function getExportedThumbnailFilename(slide) {
    if (slide.source === 'flickr' || slide.source === 'google-photos') {
        return slide.thumbnail;
    }

    const parts = slide.filename.split('.');
    parts[parts.length - 2] = `${parts[parts.length - 2]}_150x150`;

    return `export_${slide.id}_${parts.join('.')}`;
}

function getThumbnailUrl(slide) {
    switch (slide.source) {
    case 'flickr':
    case 'google-photos':
        return slide.thumbnail;
    case 'web':
        return slide.uploaded ? AppServer.getSlideThumbnailUrl(slide, store.state.gallery.id) : slide.path;
    case 'app':
    default:
        return process.env.IS_WEB ? AppServer.getSlideThumbnailUrl(slide, store.state.gallery.id) : fileUrl(slide.thumbnail);
    }
}

function getFullsizeUrl(slide) {
    switch (slide.source) {
    case 'flickr':
    case 'google-photos':
        return slide.path;
    case 'web':
        return slide.uploaded ? AppServer.getSlideUrl(slide, store.state.gallery.id) : slide.path;
    case 'app':
    default:
        return process.env.IS_WEB ? AppServer.getSlideUrl(slide, store.state.gallery.id) : fileUrl(slide.path);
    }
}

export default {
    getFullsizeUrl,
    getThumbnailUrl,
    getExportedFilename,
    getExportedThumbnailFilename,
    fileUrl,
};
