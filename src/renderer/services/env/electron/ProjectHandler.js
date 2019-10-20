import ImageProcessor from 'EnvServices/ImageProcessor';
import store from '@/store';
import Validator from '@/services/SchemaValidator';
import BaseProjectHandler from '@/services/env/BaseProjectHandler';

const fileUrl = require('file-url');
const fse = require('fs-extra');
const path = require('path');

async function openProject(path) {
    const rawData = await fse.readFile(path, 'utf-8');
    const data = JSON.parse(rawData);

    if (!Validator.validate(data)) {
        throw new Error('invalid file');
    }

    let slides = data.slides.map((slide) => {
        if (slide.exif_date) {
            slide.exif_date = new Date(slide.exif_date);
        }

        if (slide.modified_at) {
            slide.modified_at = new Date(slide.modified_at);
        }

        if (slide.from && slide.waypoints === undefined) {
            slide.waypoints = [];
        }

        return slide;
    });

    slides = await ImageProcessor.updateSlides(slides);

    store.commit('setId', data.id);
    store.commit('setTitle', data.title);
    store.commit('setDescription', data.description);
    store.commit('setSlides', slides);
}

async function saveProject(path) {
    await fse.writeFile(path, JSON.stringify(store.getters.fileData));
}

async function exportProject(dir) {
    const { slides } = store.state.gallery;

    await ImageProcessor.exportSlides(slides, dir);

    const mapGalleryRoot = process.env.NODE_ENV !== 'development' ? process.resourcesPath : __static;

    await fse.copy(path.join(mapGalleryRoot, 'MapGallery'), dir);

    const data = slides.map((slide) => {
        if (slide.from) {
            return slide;
        }
        return BaseProjectHandler.getExportedFilename(slide);
    });

    await fse.outputFile(
        path.join(dir, 'scripts', 'demo.js'),
        `MapGallery.initialize(${JSON.stringify(data)});`,
    );

    return fileUrl(path.join(dir, 'index.html'));
}

export default Object.assign(BaseProjectHandler, {
    openProject,
    saveProject,
    exportProject,
});
