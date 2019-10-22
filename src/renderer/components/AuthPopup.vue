<template>
    <Modal>
        <template slot="header">
            <a @click="close" href="#" class="close fas fa-times"/>
        </template>

        <template slot="body">
            <webview ref="webview" src="https://mapgallery.online/auth/google"
                     httpreferrer="https://editor.mapgallery.online"
            />
        </template>
    </Modal>
</template>

<script>
import Modal from './Modal';
import AppServer from '../services/AppServer';
import EventBus from '@/services/EventBus';

export default {
    name: 'AuthPopup',
    components: {
        Modal,
    },
    mounted() {
        this.$refs.webview.setAttribute('preload', `file://${__static}/auth-preload.js`);

        this.$refs.webview.addEventListener('ipc-message', (msg) => {
            AppServer.loginByToken(msg.channel);
        });

        this.$bus.$on(EventBus.events.USER_CHANGED, () => {
            this.$store.commit('closePopup', 'auth');
        });
    },
    methods: {
        close() {
            this.$store.commit('closePopup', 'auth');
        },
    },
};
</script>

<style scoped>
    webview {
        height: 580px;
    }

    a.close {
        float: right;
    }
</style>
