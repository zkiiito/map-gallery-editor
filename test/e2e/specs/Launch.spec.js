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

    it('should display splash screen', async function () {
        this.timeout(10000);
        const splashScreen = await this.app.client.$('div#splash-welcome');
        return splashScreen.waitForDisplayed({ timeout: 10000 });
    });

    it('should go to project details, show 2 buttons', async function () {
        const btn = await this.app.client.$('div#splash-welcome div.button-holder button');
        await btn.click();
        return (await this.app.client.$('form')).waitForDisplayed();
    });

    it('should show 2 buttons on details', async function () {
        const buttons = await this.app.client.findElements('css selector', 'form button');
        expect(buttons.length).to.equal(2);
    });

    it('should input project details', async function () {
        this.app.client.keys('Weekend in Austria');
        const description = await this.app.client.$('form textarea');
        return description.setValue('Salzburg, Wien, Linz, and other adventures');
    });

    it('should save project details', async function () {
        const button = await this.app.client.$('form button:nth-of-type(2)');
        await button.click();
        const main = await this.app.client.$('#main');
        await main.waitForDisplayed();
        const h1 = await this.app.client.$('#main-title h1');
        const title = await h1.getText();
        expect(title).to.eq('Weekend in Austria (0)');
    });

    it('should display 2 huge buttons', async function () {
        const buttons = await this.app.client.findElements('css selector','button.huge');
        expect(buttons.length).to.equal(2);
    });

    it('should display add image popup', async function () {
        const imgButton = await this.app.client.$('button.huge:nth-of-type(2)');
        await imgButton.click();
        const popup = await this.app.client.$('button.add-image-from-computer');
        return popup.waitForDisplayed();
    });

    it('should load 2 images', async function () {
        this.timeout(100000);
        const addImagesBtn = await this.app.client.$('button.add-image-from-computer');
        await addImagesBtn.click();
        const imageSlide2 = await this.app.client.$('div.slide.image:nth-child(2)');
        await imageSlide2.waitForExist({ timeout: 100000 });

        // ?
        const imageSlides = await this.app.client.findElements('css selector', 'div.slide.image');
        expect(imageSlides.length).to.equal(2);
    });

    it('should add a new map slide', async function () {
        const addMapBtn = await this.app.client.$('button.huge:nth-of-type(1)');
        await addMapBtn.click();
        const mapSlide = await this.app.client.$('div.slide.map');
        return mapSlide.waitForExist();
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
