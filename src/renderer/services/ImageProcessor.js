import EventBus from '../EventBus';
const fse = require('fs-extra');
const sharp = require('sharp');
const exifReader = require('exif-reader');
const uuidv4 = require('uuid/v4');
const path = require('path');
const { remote } = require('electron'); // eslint-disable-line

const imageSlideTemplate = {
    filename: 'lol.jpg',
    path: 'file://data/lol.jpg',
    exif_date: new Date('2016-01-01 01:11:23'),
    modified_at: new Date('2016-01-01 01:11:23'),
    visible: true,
};

function generateSlideData(file) {
    return new Promise(async (resolve, reject) => {
        try {
            const thumbname = path.join(remote.app.getPath('temp'), `/thumbs/thumb_${file.name}`);
            const simg = sharp(file.path);

            const metadata = await simg.metadata();
            const exifdate = metadata.exif ? exifReader(metadata.exif).exif.DateTimeOriginal : file.lastModifiedDate;

            const res = {
                ...imageSlideTemplate,
                ...{
                    id: uuidv4(),
                    filename: file.name,
                    thumbnail: thumbname,
                    path: file.path,
                    exif_date: exifdate,
                    modified_at: file.lastModifiedDate,
                },
            };

            if (!fse.existsSync(thumbname) || fse.statSync(thumbname).mtime < file.lastModifiedDate) {
                const thumbData = await simg
                    .resize(150, 150)
                    .max()
                    .toBuffer();

                await fse.outputFile(thumbname, thumbData);
            }

            return resolve(res);
        } catch (err) {
            return reject(err);
        }
    });
}

async function getImageExport(path) {
    const simg = sharp(path);

    return simg
        .resize(1920, 1080)
        .max()
        .toBuffer();
}

function generateExport(slide, dir) {
    return new Promise(async (resolve, reject) => {
        if (slide.path === undefined) {
            return resolve();
        }

        try {
            const filepath = path.join(dir, 'images', `export_${slide.id}_${slide.filename}`);

            if (!fse.existsSync(filepath) || fse.statSync(filepath).mtime < slide.modified_at.getTime()) {
                const imageData = await getImageExport(slide.path);
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
        if (slide.path === undefined) {
            resolve(slide);
            return;
        }

        let imageStat = null;
        let thumbStat = null;

        try {
            imageStat = await fse.stat(slide.path);
        } catch (err) {
            reject(new Error('Image not found'));
            return;
        }

        try {
            thumbStat = await fse.stat(slide.thumbnail);
        } catch (err) {
            thumbStat = null;
        }

        if (thumbStat === null || thumbStat.mtimeMs < imageStat.mtimeMs || slide.modified_at < imageStat.mtime) {
            const { id } = slide;
            const newSlide = await generateSlideData({
                name: slide.filename,
                path: slide.path,
            });

            slide = { ...slide, ...newSlide };
            slide.id = id;
        }

        resolve(slide);
    });
}

function reportProgress(percent) {
    EventBus.$emit('progress', percent);
}

function allProgress(promises) {
    let done = 0;
    reportProgress(0);
    promises.forEach((promise) => {
        promise.then(() => {
            done += 1;
            reportProgress((done * 100) / promises.length);
        }).catch(() => {});
    });
    return Promise.all(promises);
}

function processNewImages(files) {
    const promises = files.map(generateSlideData);
    return allProgress(promises);
}

function exportSlides(slides, dir) {
    const promises = slides.map(slide => generateExport(slide, dir));
    return allProgress(promises);
}

function updateSlides(slides) {
    const promises = slides.map(slide => updateSlide(slide));
    return allProgress(promises);
}

export default {
    processNewImages,
    exportSlides,
    updateSlides,
    getImageExport,
};
