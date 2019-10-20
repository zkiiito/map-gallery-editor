import ImageProcessor from 'EnvServices/ImageProcessor';
import EventBus from '@/services/EventBus';
import store from '@/store';
import AppServer from '@/services/AppServer';

const Queue = require('promise-queue');

async function openProject(path) {
    // TODO
}

async function saveProject(path) {
    // TODO
}

function getExportedFilename(slide) {
    if (slide.source === 'flickr') {
        return slide.path;
    }
    return `export_${slide.id}_${slide.filename}`;
}

async function exportProject(dir) {
    // TODO
}

function publishProject() {
    const data = store.getters.fileData;

    return AppServer.uploadGalleryData(data)
        .then(() => new Promise((resolve) => {
            const { slides } = store.state.gallery;
            const queue = new Queue(5, Infinity);
            let filesAll = 0;
            let filesUploaded = 0;

            slides.forEach((slide) => {
                if (slide.from || slide.source === 'flickr') {
                    return;
                }

                queue.add(() => ImageProcessor.getImageExport(slide))
                    .then((buffer) => AppServer.uploadFile(
                        getExportedFilename(slide),
                        buffer,
                        store.state.gallery.id,
                        slide.modified_at,
                    ))
                    .then(() => {
                        filesUploaded += 1;
                        EventBus.$emit('progress', (filesUploaded / filesAll) * 100);

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
    getExportedFilename,
};
