import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import App from './App';
import store from './store';
import EventBus from './services/EventBus';
import FileMenuInit from './services/FileMenu';
const unhandled = require('electron-unhandled');

FileMenuInit();
unhandled();

if (!process.env.IS_WEB) {
    Vue.use(require('vue-electron'));
}
Vue.config.productionTip = false;

Object.defineProperties(Vue.prototype, {
    $bus: {
        get() {
            return EventBus;
        },
    },
});

const progressBarOptions = {
    thickness: '5px',
};

Vue.use(VueProgressBar, progressBarOptions);

/* eslint-disable no-new */
new Vue({
    components: { App },
    store,
    template: '<App/>',
}).$mount('#app');
