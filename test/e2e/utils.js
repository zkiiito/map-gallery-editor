import electron from 'electron'
import { Application } from 'spectron'
const path = require('path');
const fakeDialog = require('spectron-fake-dialog');

const images = [
    'alex-lopez-385829-unsplash.jpg',
    'alex-lopez-455677-unsplash.jpg',
    'alex-lopez-486018-unsplash.jpg',
    'alex-lopez-495037-unsplash.jpg',
    'alex-lopez-614947-unsplash.jpg',
].map(filename => path.join(__dirname, '../sampleimages/', filename));

export default {
  afterEach () {
    this.timeout(10000);

    if (this.app && this.app.isRunning()) {
       return this.app.stop()
    }
  },
  beforeEach () {
    this.timeout(10000);
    this.app = new Application({
      path: electron,
      args: ['dist/electron/main.js'],
      startTimeout: 10000,
      waitTimeout: 10000
    });

    fakeDialog.apply(this.app);

    return this.app.start().then(() =>
        fakeDialog.mock([ { method: 'showOpenDialog', value: [images[0], images[1]] } ])
    );
  }
}
