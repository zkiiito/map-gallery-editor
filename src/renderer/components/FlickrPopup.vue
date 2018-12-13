<template>
    <Modal>
        <template slot="header">
            <button class="modal-default-button" @click="close">
                Close
            </button>
        </template>

        <template slot="body">
            <!--webview ref="webview" src="https://mapgallery.online/flickr/" httpreferrer="https://editor.mapgallery.online"/-->
            <webview v-if="this.$store.state.user.flickrUser === null" ref="webview" src="https://mapgallery-216911.firebaseapp.com/flickr/auth" httpreferrer="https://editor.mapgallery.online"/>
            <div v-if="this.$store.state.user.flickrUser !== null" id="flickr-photosets">
                Flickr on!
            </div>
        </template>
    </Modal>
</template>

<script>
import Modal from './Modal';
import FlickrServer from '../services/FlickrServer';

export default {
    name: 'FlickrPopup',
    components: {
        Modal,
    },
    mounted() {
        if (this.$store.state.user.flickrUser === null) {
            this.$refs.webview.setAttribute('preload', `file://${__static}/flickr-preload.js`);

            this.$refs.webview.addEventListener('ipc-message', (msg) => {
                this.$store.commit('setFlickrUser', msg.channel);
            });
        }
    },
    methods: {
        close() {
            this.$store.commit('closePopup', 'flickr');
        },
    },
};
</script>

<style scoped>
    webview, div#flickr-photosets {
        height: 580px;
    }
</style>
