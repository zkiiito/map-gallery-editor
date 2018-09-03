const fs = require('fs');
const fse = require('fs-extra');
const sharp = require('sharp');
const exifReader = require('exif-reader');
const uuidv4 = require('uuid/v4');
const path = require('path');

const imageSlideTemplate = {
    filename: 'lol.jpg',
    path: 'file://data/lol.jpg',
    exif_date: new Date('2016-01-01 01:11:23'),
    modified_at: new Date('2016-01-01 01:11:23'),
    visible: true,
};

function generateSlideData(file) {
    return new Promise(async (resolve, reject) => {
        const thumbname = `${__dirname}/thumbs/thumb_${file.name}`;
        // TODO: build dep
        // const thumbname = `C:/thumbs/thumb_${file.name}`;
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

        if (!fs.existsSync(thumbname) || fs.statSync(thumbname).mtime < file.lastModifiedDate) {
            const thumbData = await simg
                .resize(150, 150)
                .max()
                .toBuffer();

            try {
                fse.outputFileSync(thumbname, thumbData);
            } catch (err) {
                return reject(err);
            }
        }

        return resolve(res);
    });
}

function generateExport(slide, dir) {
    return new Promise(async (resolve, reject) => {
        if (slide.path === undefined) {
            return resolve();
        }

        const simg = sharp(slide.path);

        try {
            const imageData = await simg
                .resize(1920, 1080)
                .max()
                .toBuffer();

            fse.outputFileSync(path.join(dir, 'images', `export_${slide.id}_${slide.filename}`), imageData);
        } catch (err) {
            return reject(err);
        }

        return resolve();
    });
}

function reportProgress(percent) {
    console.log(`${percent}%`);
}

function allProgress(promises) {
    let done = 0;
    reportProgress(0);
    promises.forEach((promise) => {
        promise.then(() => {
            done += 1;
            reportProgress((done * 100) / promises.length);
        });
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

export default {
    processNewImages,
    exportSlides,
};
