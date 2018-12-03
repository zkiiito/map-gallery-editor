<template>
    <Modal>
        <template slot="header">
            <button class="modal-default-button" @click="close">
                Close
            </button>
        </template>

        <template slot="body">
            <webview ref="webview" src="https://mapgallery.online/auth/" httpreferrer="https://editor.mapgallery.online"/>
        </template>
    </Modal>
</template>

<script>
import Modal from './Modal';
import AppServer from '../services/AppServer';

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

        this.$bus.$on('user', () => {
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
</style>
