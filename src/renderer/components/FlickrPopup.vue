<template>
    <Modal>
        <template slot="header">
            <button @click="close" class="modal-default-button">
                Close
            </button>
        </template>

        <template slot="body">
            <webview ref="webview" v-if="this.$store.state.user.flickrUser === null"
                     src="https://mapgallery-216911.firebaseapp.com/flickr/auth"
                     httpreferrer="https://editor.mapgallery.online"
            />
            <div id="flickr-photosets" v-if="this.$store.state.user.flickrUser !== null">
                <ul id="flickr-photoset-list">
                    <li v-for="photoset in photosets" :key="photoset.id">
                        <label>
                            <input :value="photoset.id" v-model="selectedPhotoset" type="radio" name="photoset">
                            {{ photoset.title }} ({{ photoset.photos }})
                        </label>
                    </li>
                </ul>
                <button v-show="selectedPhotoset !== null" @click="importPhotos">Import</button>
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
    data() {
        return {
            photosets: [],
            selectedPhotoset: null,
        };
    },
    mounted() {
        if (this.$store.state.user.flickrUser === null) {
            this.$refs.webview.setAttribute('preload', `file://${__static}/flickr-preload.js`);

            this.$refs.webview.addEventListener('ipc-message', (msg) => {
                this.$store.commit('setFlickrUser', msg.channel);
                this.$bus.$emit(this.$bus.events.FLICKR_USER_READY, msg.channel);
            });

            this.$bus.$on(this.$bus.events.FLICKR_USER_READY, () => {
                this.getPhotosets();
            });
        } else {
            this.getPhotosets();
        }
    },
    methods: {
        close() {
            this.$store.commit('closePopup', 'flickr');
        },
        getPhotosets() {
            FlickrServer.init(this.$store.state.user.flickrUser.profile.id, this.$store.state.user.flickrUser.token);
            FlickrServer.getPhotosets().then((photosets) => {
                this.photosets = photosets;
            });
        },
        importPhotos() {
            if (this.selectedPhotoset) {
                FlickrServer.getPhotosFromPhotoset(this.selectedPhotoset).then((photos) => {
                    this.$store.commit('addSlides', photos.map(photo => ({
                        id: photo.id,
                        filename: photo.url_h.split('/').pop(),
                        path: photo.url_h,
                        exif_date: new Date(photo.datetaken),
                        modified_at: new Date(photo.datetaken),
                        visible: true,
                        source: 'flickr',
                        thumbnail: photo.url_s,
                    })));

                    this.close();
                });
            }
        },
    },
};
</script>

<style scoped>
    webview, div#flickr-photosets {
        height: 580px;
    }

    ul#flickr-photoset-list {
        max-height: 80%;
        overflow-y: scroll;
    }
</style>
