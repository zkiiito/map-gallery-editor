import ImageProcessor from 'EnvServices/ImageProcessor';
import BaseProjectHandler from '@/services/env/BaseProjectHandler';
import Validator from '@/services/SchemaValidator';
import store from '@/store';
import AppServer from '@/services/AppServer';

async function openProject(id) {
    const data = await AppServer.getGalleries().then((galleries) => galleries.find((gallery) => gallery.id === id));

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
    throw new Error('implement');
}

async function exportProject(dir) {
    throw new Error('implement');
}

export default Object.assign(BaseProjectHandler, {
    openProject,
    saveProject,
    exportProject,
});
