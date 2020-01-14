<template>
    <Modal>
        <template slot="header">
            <h2>Import pictures from Google Photos</h2>
            <a href="#" class="close fas fa-times" @click="close"/>
        </template>

        <template slot="body">
            <div v-if="this.$store.state.user.flickrUser !== null" id="flickr-photosets">
                <div v-if="photosets.length === 0">Loading</div>

                <div id="flickr-photoset-list">
                    <label v-for="photoset in photosets" :key="photoset.id" class="album" :style="`background-image: url('${ photoset.primary_photo }')`">
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
import BigButton from '@/components/BigButton';
import AppServer from '@/services/AppServer';
import GooglePhotosServer from '@/services/GooglePhotosServer';

export default {
    name: 'GooglePhotosPopup',
    components: {
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
        if (!GooglePhotosServer.isAuthenticated()) {
            AppServer.loginWithPhotosAccess();
        } else {
            GooglePhotosServer.getPhotos().then((photos) => {
                console.log(photos);
            });
        }
    },
    methods: {
        close() {
            this.$store.commit('closePopup', 'googlePhotos');
        },
        getPhotosets() {
        },
        importPhotos() {
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
