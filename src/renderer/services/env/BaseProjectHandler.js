import ImageProcessor from 'EnvServices/ImageProcessor';
import EventBus from '@/services/EventBus';
import store from '@/store';
import AppServer from '@/services/AppServer';
import SlideUrl from '@/services/SlideUrl';

const Queue = require('promise-queue');

// eslint-disable-next-line no-unused-vars
async function openProject(path) {
    throw new Error('implement');
}

// eslint-disable-next-line no-unused-vars
async function saveProject(path) {
    throw new Error('implement');
}

// eslint-disable-next-line no-unused-vars
async function exportProject(dir) {
    throw new Error('implement');
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
                if (slide.from
                    || slide.source === 'flickr'
                    || slide.source === 'google-photos'
                    || (slide.source === 'web' && slide.uploaded)
                    || (slide.source === undefined && process.env.IS_WEB)
                ) {
                    return;
                }

                queue.add(() => ImageProcessor.getImageExport(slide))
                    .then((buffer) => AppServer.uploadFile(
                        SlideUrl.getExportedFilename(slide),
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
};
