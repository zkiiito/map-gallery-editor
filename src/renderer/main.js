import Vue from 'vue';

import App from './App';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

const EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
    $bus: {
        get() {
            return EventBus;
        },
    },
});

/* eslint-disable no-new */
new Vue({
    components: { App },
    store,
    template: '<App/>',
}).$mount('#app');
