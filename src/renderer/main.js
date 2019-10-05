import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import App from './App';
import store from './store';
import EventBus from './services/EventBus';
/*
import './services/FileMenu';
const unhandled = require('electron-unhandled');

unhandled();

if (!process.env.IS_WEB) {
    Vue.use(require('vue-electron'));
}
 */
Vue.config.productionTip = false;
Vue.config.performance = true;

Object.defineProperties(Vue.prototype, {
    $bus: {
        get() {
            return EventBus;
        },
    },
});

const progressBarOptions = {
    thickness: '5px',
    position: 'relative',
};

Vue.use(VueProgressBar, progressBarOptions);

new Vue({
    components: { App },
    store,
    template: '<App/>',
}).$mount('#app');
