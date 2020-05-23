<template>
    <Modal>
        <template slot="header">
            <a href="#" class="close fas fa-times" @click="close"/>
        </template>

        <template slot="body">
            <webview ref="webview" src="https://mapgallery.online/auth/googlePhotos"
                     httpreferrer="https://editor.mapgallery.online"
            />
        </template>
    </Modal>
</template>

<script>
import AppServer from '@/services/AppServer';
import EventBus from '@/services/EventBus';
import GooglePhotosServer from '@/services/GooglePhotosServer';
import Modal from './Modal';

export default {
    name: 'GooglePhotosAuthPopup',
    components: {
        Modal,
    },
    mounted() {
        this.$bus.$on(this.$bus.events.MODAL_CLOSE, this.close);
        this.$refs.webview.setAttribute('preload', `file://${__static}/auth-preload.js`);

        this.$refs.webview.addEventListener('ipc-message', (msg) => {
            GooglePhotosServer.setToken(msg.channel);
            if (this.$store.state.user.googleUser === null) {
                this.$bus.$on(EventBus.events.USER_CHANGED, () => {
                    if (this.$store.state.user.googleUser !== null) {
                        this.$store.commit('closePopup', 'authPhotos');
                        this.$store.commit('openPopup', 'googlePhotos');
                    }
                });

                AppServer.loginByToken(msg.channel);
            } else {
                this.$store.commit('closePopup', 'authPhotos');
                this.$store.commit('openPopup', 'googlePhotos');
            }
        });
    },
    beforeDestroy() {
        this.$bus.$off(this.$bus.events.MODAL_CLOSE, this.close);
    },
    methods: {
        close() {
            this.$store.commit('closePopup', 'authPhotos');
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
