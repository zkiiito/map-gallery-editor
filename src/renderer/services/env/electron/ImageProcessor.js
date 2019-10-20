import EventBus from '@/services/EventBus';
const fse = require('fs-extra');
const sharp = require('sharp');
const exifReader = require('exif-reader');
const uuidv4 = require('uuid/v4');
const path = require('path');
const Queue = require('promise-queue');
// eslint-disable-next-line import/no-extraneous-dependencies
const { remote } = require('electron');

const imageSlideTemplate = {
    filename: 'lol.jpg',
    path: 'file://data/lol.jpg',
    exif_date: new Date('2016-01-01 01:11:23'),
    modified_at: new Date('2016-01-01 01:11:23'),
    visible: true,
};

function generateSlideData(filepath) {
    return new Promise(async (resolve, reject) => {
        try {
            const filename = path.basename(filepath);
            const thumbname = path.join(remote.app.getPath('temp'), `/thumbs/thumb_${filename}`);
            const simg = sharp(filepath);
            const fileLastModifiedDate = fse.statSync(filepath).mtime;
            let exifdate = fileLastModifiedDate;

            const metadata = await simg.metadata();
            if (metadata.exif) {
                const exifDecoded = exifReader(metadata.exif);
                if (exifDecoded.exif) {
                    exifdate = exifDecoded.exif.DateTimeOriginal || exifdate;
                }
            }

            const res = {
                ...imageSlideTemplate,
                ...{
                    id: uuidv4(),
                    filename,
                    thumbnail: thumbname,
                    path: filepath,
                    exif_date: exifdate,
                    modified_at: fileLastModifiedDate,
                },
            };

            if (!fse.existsSync(thumbname) || fse.statSync(thumbname).mtime < fileLastModifiedDate) {
                const thumbData = await simg
                    .resize(150, 150)
                    .resize({ fit: 'inside' })
                    .toBuffer();

                await fse.outputFile(thumbname, thumbData);
            }

            return resolve(res);
        } catch (err) {
            return reject(err);
        }
    });
}

async function getImageExport(slide) {
    const simg = sharp(slide.path);

    return simg
        .resize(1920, 1080)
        .resize({ fit: 'inside' })
        .toBuffer();
}

function generateExport(slide, dir) {
    return new Promise(async (resolve, reject) => {
        if (slide.path === undefined || slide.source === 'flickr') {
            return resolve();
        }

        try {
            const filepath = path.join(dir, 'images', `export_${slide.id}_${slide.filename}`);

            if (!fse.existsSync(filepath) || fse.statSync(filepath).mtime < slide.modified_at.getTime()) {
                const imageData = await getImageExport(slide);
                await fse.outputFile(filepath, imageData);
            }

            return resolve();
        } catch (err) {
            return reject(err);
        }
    });
}

function updateSlide(slide) {
    return new Promise(async (resolve, reject) => {
        if (slide.path === undefined || slide.source === 'flickr') {
            resolve(slide);
            return;
        }

        let imageStat = null;
        let thumbStat = null;

        try {
            imageStat = await fse.stat(slide.path);
        } catch (err) {
            reject(new Error(`Image not found: ${slide.path}`));
            return;
        }

        try {
            thumbStat = await fse.stat(slide.thumbnail);
        } catch (err) {
            thumbStat = null;
        }

        if (thumbStat === null || thumbStat.mtimeMs < imageStat.mtimeMs || slide.modified_at < imageStat.mtime) {
            const { id } = slide;
            const newSlide = await generateSlideData(slide.path);
            slide = { ...slide, ...newSlide };
            slide.id = id;
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
        const queue = new Queue(4, Infinity);
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

function processNewImages(files) {
    const promiseGenerators = files.map((file) => () => generateSlideData(file));
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
    exportSlides,
    updateSlides,
    getImageExport,
};
