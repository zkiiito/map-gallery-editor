import utils from '../utils';

describe('Launch', function () {
    before(utils.beforeEach);
    after(utils.afterEach);

    it('shows the proper application title', function () {
        return this.app.client.getTitle()
            .then((title) => {
                expect(title).to.equal('MapGallery Editor');
            });
    });

    it('should display splash screen', function () {
        this.timeout(10000);
        return this.app.client.waitForVisible('div#splash-welcome', 10000);
    });

    it('should go to project details, show 2 buttons', async function () {
        return this.app.client.click('div#splash-welcome div.button-holder button').waitForVisible('form');
    });

    it('should show 2 buttons on details', async function () {
        const buttons = await this.app.client.elements('form button');
        expect(buttons.value.length).to.equal(2);
    });

    it('should save project details', async function () {
        this.app.client.keys('Weekend in Austria');
        this.app.client.setValue('form textarea', 'Salzburg, Wien, Linz, and other adventures');

        return this.app.client.click('form button:nth-of-type(2)')
            .waitForVisible('#main')
            .getText('#main-title h1')
            .then((text) => {
                expect(text).to.eq('Weekend in Austria');
            });
    });

    it('should display 2 huge buttons', async function () {
        const buttons = await this.app.client.elements('button.huge');
        expect(buttons.value.length).to.equal(2);
    });

    it('should load 2 images', async function () {
        this.app.client.click('button.huge:nth-of-type(2)');
        await this.app.client.waitForExist('div.slide.image:nth-child(2)', 5000);

        // ?
        const imageSlides = await this.app.client.elements('div.slide.image');
        expect(imageSlides.value.length).to.equal(2);
    });

    it('should add a new map slide', async function () {
        return this.app.client.click('button.huge:nth-of-type(1)')
            .waitForExist('div.slide.map');
    });

/*
    it('should load google maps', async function () {
        this.timeout(30000);
        await this.app.client.click('div.slide.map').waitForVisible('#editor');
        expect(await this.app.client.waitUntilWindowLoaded().getWindowCount()).to.equal(2);
        // await this.app.client.windowByIndex(1).waitForExist('.gm-style', 30000); // only class in google maps
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

    it('should go back and forth', async function () {

    });
*/
});
