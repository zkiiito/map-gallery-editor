<template>
    <Modal>
        <template slot="header">
            <h2>Import pictures from flickr</h2>
            <a href="#" class="close fas fa-times" @click="close"/>
        </template>

        <template slot="body">
            <div v-if="this.$store.state.user.flickrUser !== null" id="flickr-photosets">
                <div v-if="photosets.length === 0"><FlickrLoader/></div>

                <div id="flickr-photoset-list">
                    <label
                        v-for="photoset in photosets"
                        :key="photoset.id"
                        class="album"
                        :style="`background-image: url('${ photoset.primary_photo }')`"
                    >
                        <input v-model="selectedPhotoset" :value="photoset.id" type="radio" name="photoset">
                        <div class="bottom">
                            <span class="title">{{ photoset.title }}</span><br>
                            <span class="count">{{ photoset.photos }} photos</span>
                        </div>
                    </label>
                </div>
                <BigButton v-show="selectedPhotoset !== null" cssstyle="width: 300px; margin: auto" @click="importPhotos">Import</BigButton>
            </div>
        </template>
    </Modal>
</template>

<script>
import Modal from '@/components/Modal';
import FlickrServer from '@/services/FlickrServer';
import BigButton from '@/components/BigButton';
import FlickrLoader from '@/components/FlickrLoader';

export default {
    name: 'FlickrPopup',
    components: {
        FlickrLoader,
        BigButton,
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
            window.open('https://mapgallery.online/flickr/auth', 'flickr', 'width=400,height=600');

            window.addEventListener('message', (e) => {
                if (e.origin !== 'https://mapgallery.online') {
                    return;
                }

                this.$store.commit('setFlickrUser', e.data);
                this.$bus.$emit(this.$bus.events.FLICKR_USER_READY, e.data);
            }, false);

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
                    this.$store.commit('addSlides', photos.map((photo) => ({
                        id: photo.id,
                        filename: photo.url_h.split('/').pop(),
                        path: photo.url_h,
                        exif_date: new Date(photo.datetaken),
                        modified_at: new Date(photo.datetaken),
                        visible: true,
                        source: 'flickr',
                        thumbnail: photo.url_s,
                    })));

                    this.$store.commit('setView', 'gallery');
                    this.close();
                });
            }
        },
    },
};
</script>

<style scoped>
    div#flickr-photosets {
        height: 580px;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    #flickr-photoset-list {
        max-height: 90%;
        overflow-y: scroll;
    }

    a.close {
        float: right;
    }

    h2 {
        float: left;
        margin-top: 0;
    }

    .album {
        width: 180px;
        height: 110px;
        float: left;
        background-position: center;
        background-size: cover;
        margin: 10px;
        position: relative;
        overflow: hidden;
        color: #ffffff;
    }

    .album div.bottom {
        position: absolute;
        bottom: 10px;
        left: 10px;
    }

    .album span.title, .album span.count {
        overflow: hidden;
        text-shadow: 1px 1px 2px black;
    }

    .album span.count {
        font-size: 14px;
    }
</style>
