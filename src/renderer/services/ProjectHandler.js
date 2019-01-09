import EventBus from './EventBus';
import ImageProcessor from './ImageProcessor';
import store from '../store';
import AppServer from './AppServer';

const Ajv = require('ajv');
const fileUrl = require('file-url');
const fse = require('fs-extra');
const path = require('path');
const Queue = require('promise-queue');

const ajv = new Ajv();
const schema = require('../store/schema');
const validate = ajv.compile(schema);

async function openProject(path) {
    const rawData = await fse.readFile(path, 'utf-8');
    const data = JSON.parse(rawData);

    if (!validate(data)) {
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

function getExportedFilename(slide) {
    if (slide.source === 'flickr') {
        return slide.path;
    }
    return `export_${slide.id}_${slide.filename}`;
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
        return getExportedFilename(slide);
    });

    await fse.outputFile(
        path.join(dir, 'scripts', 'demo.js'),
        `MapGallery.initialize(${JSON.stringify(data)});`,
    );

    return fileUrl(path.join(dir, 'index.html'));
}

function publishProject() {
    const data = store.getters.fileData;

    return AppServer.uploadGalleryData(data)
        .then(() => new Promise((resolve, reject) => {
            const { slides } = store.state.gallery;
            const queue = new Queue(5, Infinity);
            let filesAll = 0;
            let filesUploaded = 0;

            slides.forEach((slide) => {
                if (slide.from || slide.source === 'flickr') {
                    return;
                }

                queue.add(() => ImageProcessor.getImageExport(slide.path))
                    .then(buffer => AppServer.uploadFile(
                        getExportedFilename(slide),
                        buffer,
                        store.state.gallery.id,
                        slide.modified_at,
                    ))
                    .then(() => {
                        filesUploaded += 1;
                        EventBus.$emit('progress', filesUploaded / filesAll * 100);

                        if (queue.getPendingLength() === 0 && queue.getQueueLength() === 0) {
                            resolve(AppServer.getPublishedUrl(data));
                        }
                    })
                    .catch((err) => {
                        // console.log(err);// TODO: test, [Object object]
                        EventBus.$emit('error', err);
                    });

                filesAll += 1;
            });

            if (queue.getPendingLength() === 0 && queue.getQueueLength() === 0) {
                resolve(AppServer.getPublishedUrl(data));
            }
        }));
}

export default {
    openProject,
    saveProject,
    exportProject,
    publishProject,
};
