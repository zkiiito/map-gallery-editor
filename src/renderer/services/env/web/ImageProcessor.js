import EventBus from '@/services/EventBus';
const exifReader = require('exif-js');
const uuidv4 = require('uuid/v4');
const Queue = require('promise-queue');

const imageSlideTemplate = {
    filename: 'lol.jpg',
    path: 'file://data/lol.jpg',
    exif_date: new Date('2016-01-01 01:11:23'),
    modified_at: new Date('2016-01-01 01:11:23'),
    visible: true,
    uploaded: false,
    orientation: 1,
};

const fileCache = {};

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);

            img.src = e.target.result;
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

function resizeCanvas(canvas, targetWidth, targetHeight) {
    let scaleFactor = targetWidth / canvas.width;
    let canvasWidth = targetWidth;
    let canvasHeight = canvas.height * scaleFactor;

    if (canvasHeight > targetHeight) {
        scaleFactor = targetHeight / canvas.height;
        canvasHeight = targetHeight;
        canvasWidth = canvas.width * scaleFactor;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    return canvas;
}

function resizeImage(img, targetWidth, targetHeight, orientation) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.imageSmoothingQuality = 'low';
        canvas.width = img.width;
        canvas.height = img.height;

        resizeCanvas(canvas, targetWidth, targetHeight);
        const ctx = canvas.getContext('2d');
        let { width, height } = canvas;

        // Good explanation of EXIF orientation is here:
        // http://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/
        if (orientation > 1) {
            if (orientation > 4) {
                canvas.width = height;
                canvas.height = width;

                resizeCanvas(canvas, targetWidth, targetHeight);

                width = canvas.height;
                height = canvas.width;
            }
            switch (orientation) {
            case 2:
                ctx.translate(width, 0);
                ctx.scale(-1, 1);
                break;
            case 3:
                ctx.translate(width, height);
                ctx.rotate(Math.PI);
                break;
            case 4:
                ctx.translate(0, height);
                ctx.scale(1, -1);
                break;
            case 5:
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
            case 6:
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(0, -height);
                break;
            case 7:
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(width, -height);
                ctx.scale(-1, 1);
                break;
            case 8:
                ctx.rotate(-0.5 * Math.PI);
                ctx.translate(-width, 0);
                break;
            default:
            }
        }
        ctx.drawImage(img, 0, 0, width, height);

        ctx.canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
    });
}

function updateThumbnails(slide) {
    let iimg;

    return readFile(fileCache[slide.id])
        .then((img) => {
            iimg = img;
            return resizeImage(img, 150, 150, slide.orientation);
        })
        .then((blob) => {
            slide.thumbnail = URL.createObjectURL(blob);
        })
        .then(() => resizeImage(iimg, 1920, 1080, slide.orientation))
        .then((blob) => {
            slide.path = URL.createObjectURL(blob);
            return slide;
        });
}

function parseExifDate(dateString) {
    return new Date(dateString.replace(':', '.').replace(':', '.'));
}

async function generateSlideData(file) {
    const res = {
        ...imageSlideTemplate,
        ...{
            id: uuidv4(),
            filename: file.name,
            thumbnail: '',
            path: URL.createObjectURL(file),
            exif_date: new Date(file.lastModified),
            modified_at: new Date(file.lastModified),
            source: 'web',
            uploaded: false,
        },
    };

    const exifData = await new Promise((resolve) => {
        // eslint-disable-next-line func-names
        exifReader.getData(file, function () {
            resolve(exifReader.getAllTags(this));
        });
    });

    res.orientation = exifData.Orientation ? exifData.Orientation : 1;
    res.exif_date = exifData.DateTimeOriginal ? parseExifDate(exifData.DateTimeOriginal) : res.modified_at;

    fileCache[res.id] = file;

    return updateThumbnails(res);
}

function getNextOrientation(slide) {
    const orientations = [1, 8, 3, 6];
    const currentOrientationIndex = orientations.indexOf(slide.orientation);
    return orientations[(currentOrientationIndex + 1) % orientations.length];
}

function rotateImage(slide) {
    slide.orientation = getNextOrientation(slide);
    slide.modified_at = new Date();
    return updateThumbnails(slide);
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
        if (slide.path === undefined || slide.source === 'flickr' || slide.source === 'google-photos') {
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

function updateSlides(slides) {
    const promiseGenerators = slides.map((slide) => () => updateSlide(slide));
    return allProgressGenerators(promiseGenerators);
}

export default {
    processNewImages,
    updateSlides,
    getImageExport,
    rotateImage,
};
