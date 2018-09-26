import EventBus from '../EventBus';
import ImageProcessor from './ImageProcessor';
import store from '../store';

const fse = require('fs-extra');
const path = require('path');

async function openProject(path) {
    try {
        const data = await fse.readFile(path, 'utf-8');
        const parsedData = JSON.parse(data);

        // TODO: loadFileData here
        store.dispatch('loadFileData', parsedData);
    } catch (err) {
        EventBus.$emit('error', err);
    }
}

async function saveProject(path) {
    try {
        await fse.writeFile(path, store.getters.fileData);
    } catch (err) {
        EventBus.$emit('file-error', err);
    }
}

async function exportProject(dir) {
    try {
        await ImageProcessor.exportSlides(store.state.slides, dir);

        const mapGalleryRoot = process.env.NODE_ENV !== 'development' ? process.resourcesPath : __static;

        await fse.copy(path.join(mapGalleryRoot, 'MapGallery'), dir);

        // TODO: store in store
        const data = store.state.slides.map((slide) => {
            if (slide.from) {
                return slide;
            }
            return `export_${slide.id}_${slide.filename}`;
        });

        await fse.outputFile(
            path.join(dir, 'scripts', 'demo.js'),
            `MapGallery.initialize(${JSON.stringify(data)});`,
        );
    } catch (err) {
        EventBus.$emit('error', err);
    }
}

export default {
    openProject,
    saveProject,
    exportProject,
};
