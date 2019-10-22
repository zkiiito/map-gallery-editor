// eslint-disable-next-line import/no-extraneous-dependencies
import { remote, shell } from 'electron';

import Controller from 'EnvServices/Controller';
import EventBus from '@/services/EventBus';
const { Menu } = remote;

const menu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            { label: 'New Project...', click: Controller.newProject },
            { label: 'Open...', click: Controller.openProject, accelerator: 'CmdOrCtrl+Shift+O' },
            { label: 'Save', click: Controller.saveProject, accelerator: 'CmdOrCtrl+S' },
            { label: 'Save As...', click: Controller.saveProjectAs, accelerator: 'CmdOrCtrl+Shift+S' },
            { type: 'separator' },
            { role: 'quit' },
        ],
    },
    {
        label: 'Project',
        submenu: [
            { label: 'Properties', click: () => Controller.openProjectData() },
            { type: 'separator' },
            { label: 'Add Images', click: Controller.addImages },
            { label: 'Add Map Slide', click: Controller.addMapSlide },
            { type: 'separator' },
            { label: 'Import Images from Flickr', click: Controller.openFlickr },
            { type: 'separator' },
            { label: 'Order by EXIF Date', click: Controller.orderExif },
            { type: 'separator' },
            { label: 'Export to Disk...', click: Controller.exportProject },
        ],
    },
    {
        label: 'Slide',
        submenu: [
            { label: 'Next', click: Controller.nextSlide, accelerator: 'Right' },
            { label: 'Previous', click: Controller.prevSlide, accelerator: 'Left' },
            {
                label: 'Close',
                click: Controller.closeSlide,
                accelerator: 'Esc',
                enabled: false,
                id: 'close',
            },
            { type: 'separator' },
            {
                label: 'Delete',
                click: Controller.deleteSlide,
                accelerator: 'Delete',
                enablded: false,
                id: 'delete',
            },
            {
                label: 'Undo Delete',
                click: Controller.undoDeleteSlide,
                accelerator: 'CmdOrCtrl+Z',
                enablded: true,
                id: 'undoDelete',
            },

        ],
    },
    {
        label: 'Publish',
        submenu: [
            {
                label: 'Log In...',
                click: Controller.login,
                id: 'login',
            },
            {
                label: 'Log Out',
                click: Controller.logout,
                id: 'logout',
                enabled: false,
            },
            {
                label: 'Publish online',
                click: Controller.publish,
                enabled: false,
                id: 'publish',
            },
        ],
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Open help',
                click() {
                    shell.openExternal('https://github.com/zkiiito/map-gallery-editor/wiki/Kezd%C5%91csomag');
                },
                accelerator: 'F1',
            },
            {
                role: 'toggleDevTools',
            },
        ],
    },
]);

EventBus.$on(EventBus.events.USER_CHANGED, (user) => {
    if (user) {
        menu.getMenuItemById('login').enabled = false;
        menu.getMenuItemById('logout').enabled = true;
        // menu.getMenuItemById('logout').label = `Log out ${user.displayName}`;
        menu.getMenuItemById('publish').enabled = true;
    } else {
        menu.getMenuItemById('login').enabled = true;
        menu.getMenuItemById('logout').enabled = false;
        menu.getMenuItemById('publish').enabled = false;
    }
});

EventBus.$on(EventBus.events.CURRENT_SLIDE_CHANGED, (slide) => {
    if (slide) {
        menu.getMenuItemById('close').enabled = true;
        menu.getMenuItemById('delete').enabled = true;
    } else {
        menu.getMenuItemById('close').enabled = false;
        menu.getMenuItemById('delete').enabled = false;
    }
});

let filename = '';
let projectTitle = '';

function setWindowTitle() {
    const titleFilename = filename ? ` [${filename}]` : '';
    const title = `${projectTitle || ''}${titleFilename} - MapGallery Editor`;

    remote.getCurrentWindow().setTitle(title);
}

EventBus.$on('filename', (value) => {
    filename = value;
    setWindowTitle();
});

EventBus.$on(EventBus.events.PROJECT_TITLE_CHANGED, (value) => {
    projectTitle = value;
    setWindowTitle();
});

EventBus.$on(EventBus.events.POPUP_OPENED, () => {
    Menu.setApplicationMenu(new Menu());
});

EventBus.$on(EventBus.events.POPUP_CLOSED, (value, num) => {
    if (num === 0) {
        Menu.setApplicationMenu(menu);
    }
});

export default () => {
    Menu.setApplicationMenu(menu);
};
