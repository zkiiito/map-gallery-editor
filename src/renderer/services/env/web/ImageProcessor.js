import EventBus from '@/services/EventBus';
// const exifReader = require('exif-reader');
const uuidv4 = require('uuid/v4');
const Queue = require('promise-queue');
// const pica = require('pica')();

const imageSlideTemplate = {
    filename: 'lol.jpg',
    path: 'file://data/lol.jpg',
    exif_date: new Date('2016-01-01 01:11:23'),
    modified_at: new Date('2016-01-01 01:11:23'),
    visible: true,
};

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);

            img.src = e.target.result;
        };
        reader.onerror = (e) => {
            return reject(e);
        };
        reader.readAsDataURL(file);
    });
}

function resizeImage(img, targetWidth, targetHeight) {
    return new Promise((resolve) => {
        let scaleFactor = targetWidth / img.width;
        let canvasWidth = targetWidth;
        let canvasHeight = img.height * scaleFactor;

        if (canvasHeight > targetHeight) {
            scaleFactor = targetHeight / img.height;
            canvasHeight = targetHeight;
            canvasWidth = img.width * scaleFactor;
        }

        const canvas = document.createElement('canvas');
        canvas.imageSmoothingQuality = 'low';
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        ctx.canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
    });
}

function generateSlideData(file) {
    console.log(file);

    const res = {
        ...imageSlideTemplate,
        ...{
            id: uuidv4(),
            filename: file.name,
            thumbnail: '',
            path: URL.createObjectURL(file),
            // exif_date: new Date('2016-01-01 01:11:23'), // TODO
            modified_at: new Date(file.lastModified),
            source: 'web',
            uploaded: false,
        },
    };

    let iimg;

    return readFile(file)
        .then((img) => {
            iimg = img;
            return resizeImage(img, 150, 150);
        })
        .then((blob) => {
            res.thumbnail = URL.createObjectURL(blob);
        })
        .then(() => resizeImage(iimg, 1920, 1080))
        .then((blob) => {
            res.path = URL.createObjectURL(blob);
            return res;
        });
}

async function getImageExport(slide) {
    return fetch(slide.path).then((r) => r.blob());
}

// eslint-disable-next-line no-unused-vars
function generateExport(slide, dir) {
    throw new Error('implement');
}

function updateSlide(slide) {
    return new Promise((resolve) => {
        if (slide.path === undefined || slide.source === 'flickr') {
            resolve(slide);
            return;
        }

        if (slide.source === 'web') {
            slide.uploaded = true;
        }

        resolve(slide);
    });
}

function reportProgress(percent) {
    EventBus.$emit('progress', percent);
}

function allProgressGenerators(promiseGenerators) {
    return new Promise((resolve, reject) => {
        let done = 0;
        const all = promiseGenerators.length;
        const queue = new Queue(1, Infinity);
        const results = [];
        reportProgress(0);

        promiseGenerators.forEach((promiseGenerator) => {
            queue.add(promiseGenerator)
                .then((result) => {
                    done += 1;
                    results.push(result);
                    reportProgress((done / all) * 100);
                    if (done === all) {
                        resolve(results);
                    }
                }).catch(reject);
        });
    });
}

function processNewImages(files, callback) {
    const promiseGenerators = files.map((file) => () => generateSlideData(file).then((slide) => {
        callback(slide);
        return slide;
    }));
    return allProgressGenerators(promiseGenerators);
}

function exportSlides(slides, dir) {
    const promiseGenerators = slides.map((slide) => () => generateExport(slide, dir));
    return allProgressGenerators(promiseGenerators);
}

function updateSlides(slides) {
    const promiseGenerators = slides.map((slide) => () => updateSlide(slide));
    return allProgressGenerators(promiseGenerators);
}

export default {
    processNewImages,
    // exportSlides,
    updateSlides,
    getImageExport,
};
