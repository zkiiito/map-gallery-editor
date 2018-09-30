import EventBus from '../EventBus';
import ImageProcessor from './ImageProcessor';
import store from '../store';
import AppServer from './AppServer';

const fse = require('fs-extra');
const path = require('path');
const Ajv = require('ajv');
const Queue = require('promise-queue');

const ajv = new Ajv();
const schema = require('../store/schema');
const validate = ajv.compile(schema);

async function openProject(path) {
    try {
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

            return slide;
        });

        slides = await ImageProcessor.updateSlides(slides);

        store.commit('setId', data.id);
        store.commit('setTitle', data.title);
        store.commit('setDescription', data.description);
        store.commit('setSlides', slides);
    } catch (err) {
        EventBus.$emit('error', err);
    }
}

async function saveProject(path) {
    try {
        await fse.writeFile(path, JSON.stringify(store.getters.fileData));
    } catch (err) {
        EventBus.$emit('file-error', err);
    }
}

function getExportedFilename(slide) {
    return `export_${slide.id}_${slide.filename}`;
}

async function exportProject(dir) {
    const { slides } = store.state.gallery;

    try {
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
    } catch (err) {
        EventBus.$emit('error', err);
    }
}

function publishProject() {
    const data = store.getters.fileData;

    AppServer.uploadGalleryData(data).then(() => {
        const { slides } = store.state.gallery;
        const queue = new Queue(5, Infinity);
        let filesAll = 0;
        let filesUploaded = 0;

        slides.forEach((slide) => {
            if (slide.from) {
                return;
            }

            queue.add(() => ImageProcessor.getImageExport(slide.path))
                .then(buffer => AppServer.uploadFile(getExportedFilename(slide), buffer, store.state.gallery.id))
                .then(() => {
                    filesUploaded += 1;
                    EventBus.$emit('progress', filesUploaded / filesAll * 100);
                })
                .catch((err) => {
                    EventBus.$emit('error', err);
                });

            filesAll += 1;
        });
    }).catch((err) => {
        EventBus.$emit('error', err);
    });
}

export default {
    openProject,
    saveProject,
    exportProject,
    publishProject,
};
