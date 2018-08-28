const fs = require('fs')
const sharp = require('sharp')
const exifReader = require('exif-reader')

const imageSlideTemplate = {
    filename: 'lol.jpg',
    path: 'file://data/lol.jpg',
    exif_date: new Date('2016-01-01 01:11:23'),
    modified_at: new Date('2016-01-01 01:11:23'),
    visible: true
};

function processNewImages (files) {
    return new Promise((resolve, reject) => {
        let promises = files.map(generateSlideData);

        Promise.all(promises).then((results) => {
            console.log(Date.now());
            return resolve(results);
        });
    });
}

function generateSlideData(file) {
    return new Promise(async (resolve, reject) => {
        const thumbname = __dirname + '/thumbs/thumb_' + file.name;
        const simg = sharp(file.path);

        const metadata = await simg.metadata();
        const exifdate = metadata.exif ? exifReader(metadata.exif).exif.DateTimeOriginal : file.lastModifiedDate;

        let res =  { ...imageSlideTemplate, ...{
                id: Math.random(9999999),
                filename: file.name,
                thumbnail: thumbname,
                path: file.path,
                exif_date: exifdate,
                modified_at: file.lastModifiedDate
            }};

        if (!fs.existsSync(thumbname) || fs.statSync(thumbname).mtime < file.lastModifiedDate) {
            const thumbData = await simg
                .resize(150, 150)
                .max()
                .toBuffer();

            try {
                fs.writeFileSync(thumbname, thumbData);
            } catch (err) {
                return reject(err);
            }
        }

        return resolve(res);
    });
}

export default {
    processNewImages
}
