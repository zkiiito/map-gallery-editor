import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import AsyncComputed from 'vue-async-computed';
import App from './App';
import store from './store';
import EventBus from './services/EventBus';
import 'EnvServices/FileMenu';
const infiniteScroll = require('vue-infinite-scroll');

if (!process.env.IS_WEB) {
    const unhandled = require('electron-unhandled');
    unhandled();

    Vue.use(require('vue-electron'));
}

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
Vue.use(AsyncComputed);
Vue.use(infiniteScroll);

new Vue({
    components: { App },
    store,
    template: '<App/>',
}).$mount('#app');
