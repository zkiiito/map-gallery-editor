import EventBus from '../EventBus';
const exifReader = require('exif-reader');
const uuidv4 = require('uuid/v4');
const Queue = require('promise-queue');

const imageSlideTemplate = {
    filename: 'lol.jpg',
    path: 'file://data/lol.jpg',
    exif_date: new Date('2016-01-01 01:11:23'),
    modified_at: new Date('2016-01-01 01:11:23'),
    visible: true,
};

function generateSlideData(file) {
    console.log(file);

    const res = {
        ...imageSlideTemplate,
        ...{
            id: uuidv4(),
            filename: file.name,
            thumbnail: '',
            path: URL.createObjectURL(file),
            exif_date: 0, // TODO
            modified_at: file.lastModified,
            source: 'web',
        },
    };

    res.thumbnail = res.path;
    return Promise.resolve(res);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = e.target.result;
            res.thumbnail = imgData; // 150X150

            return resolve(res);
        };

        reader.onerror = (e) => {
            return reject(e);
        };
        reader.readAsDataURL(file);
    });
}

async function getImageExport(path) {
    const simg = sharp(path);

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
    // exportSlides,
    // updateSlides,
    // getImageExport,
};
