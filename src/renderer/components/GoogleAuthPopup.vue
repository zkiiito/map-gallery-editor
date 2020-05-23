<template>
    <Modal>
        <template slot="header">
            <a href="#" class="close fas fa-times" @click="close"/>
        </template>

        <template slot="body">
            <webview ref="webview" src="https://mapgallery.online/auth/google"
                     httpreferrer="https://editor.mapgallery.online"
            />
        </template>
    </Modal>
</template>

<script>
import AppServer from '@/services/AppServer';
import EventBus from '@/services/EventBus';
import Modal from './Modal';

export default {
    name: 'GoogleAuthPopup',
    components: {
        Modal,
    },
    mounted() {
        this.$refs.webview.setAttribute('preload', `file://${__static}/auth-preload.js`);

        this.$refs.webview.addEventListener('ipc-message', (msg) => {
            AppServer.loginByToken(msg.channel);
        });

        this.$bus.$on(EventBus.events.USER_CHANGED, this.close);
        this.$bus.$on(this.$bus.events.MODAL_CLOSE, this.close);
    },
    beforeDestroy() {
        this.$bus.$off(this.$bus.events.MODAL_CLOSE, this.close);
        this.$bus.$off(EventBus.events.USER_CHANGED, this.close);
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
