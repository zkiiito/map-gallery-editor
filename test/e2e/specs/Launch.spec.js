import utils from '../utils';

const path = require('path');

const images = [
    'alex-lopez-385829-unsplash.jpg',
    'alex-lopez-455677-unsplash.jpg',
    'alex-lopez-486018-unsplash.jpg',
    'alex-lopez-495037-unsplash.jpg',
    'alex-lopez-614947-unsplash.jpg',
].map(filename => path.join(__dirname, '../../sampleimages/', filename));

describe('Launch', function () {
    before(utils.beforeEach);
    after(utils.afterEach);
    beforeEach(function () {
        this.timeout(10000);
    });

    it('shows the proper application title', function () {
        return this.app.client.getTitle()
            .then((title) => {
                expect(title).to.equal('map-gallery-editor');
            });
    });

    it('should display 2 add slides', async function () {
        const addSlides = await this.app.client.elements('.addSlide');
        // eventually?
        expect(addSlides.value.length).to.equal(2);
    });

    it('should load 2 images', async function () {
        this.app.client.chooseFile('#addImages', images[0]);
        this.app.client.chooseFile('#addImages', images[1]);
        await this.app.client.waitForExist('div.slide.image:nth-child(2)', 5000);

        // ?
        const imageSlides = await this.app.client.elements('div.slide.image');
        expect(imageSlides.value.length).to.equal(2);
    });

    it('should open image preview', async function () {
        return this.app.client.click('div.slide.image img').waitForVisible('#imageviewer');
    });

    it('should add a new map slide', async function () {
        return this.app.client.click('.addSlide label')
            .waitForExist('div.slide.map');
    });

    it('should load google maps', async function () {
        await this.app.client.click('div.slide.map').waitForVisible('#editor');
        expect(await this.app.client.waitUntilWindowLoaded().getWindowCount()).to.equal(2);
        await this.app.client.windowByIndex(1).waitForExist('.gm-style', 10000); // only class in google maps
    });
/*
    it('should save map edits', async function () {

    });

    it('should close preview on click', async function () {

    });

    it('should sort by exif', async function () {

    });

    it('should export project', async function () {

    });

    it('should sort by exif', async function () {

    });

    it('should scoll by mouse', async function () {

    });

    it('should save project', async function () {

    });

    it('should create new project', async function () {

    });

    it('should load project', async function () {

    });

    it('should delete slide', async function () {

    });

    it('should go back and forth', async function () {

    });
*/
});
