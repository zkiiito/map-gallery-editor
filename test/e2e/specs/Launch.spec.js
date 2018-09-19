import utils from '../utils';

describe('Launch', function () {
    before(utils.beforeEach);
    after(utils.afterEach);

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
        this.app.client.chooseFile('#addImages', 'E:\\nepal1.jpg');
        this.app.client.chooseFile('#addImages', 'E:\\nepal2.jpg');
        await this.app.client.waitForExist('div.slide.image:nth-child(2)', 5000);

        // ?
        const imageSlides = await this.app.client.elements('div.slide.image');
        expect(imageSlides.value.length).to.equal(2);
    });

    it('should add a new map slide', async function () {
        await this.app.client.click('.addSlide label');
        await this.app.client.waitForExist('div.slide.map');
    });

    it('should open image preview', async function () {
        await this.app.client.click('div.slide.image img');
        await this.app.client.waitForVisible('#imageviewer');
    });

    it('should go back and forth', async function () {

    });

    it('should load google maps', async function () {

    });

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
});
