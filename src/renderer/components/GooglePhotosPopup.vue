<template>
    <Modal>
        <template slot="header">
            <h2>Import pictures from Google Photos</h2>
            <a href="#" class="close fas fa-times" @click="close"/>
        </template>

        <template slot="body">
            <div id="google-photos">
                <div v-if="photos.length === 0">Loading</div>

                <div id="google-photo-list">
                    <label v-for="photo in photos" :key="photo.id" class="photo" :style="`background-image: url('${ photo.baseUrl }=w180-h110-c')`">
                        <input v-model="selectedPhotos" :value="photo.id" type="checkbox" name="mediaitem">
                    </label>
                </div>
                <BigButton v-show="selectedPhotos.length > 0" cssstyle="width: 300px; margin: auto" @click="importPhotos">Import</BigButton>
            </div>
        </template>
    </Modal>
</template>

<script>
import Modal from '@/components/Modal';
import BigButton from '@/components/BigButton';
import GooglePhotosServer from '@/services/GooglePhotosServer';

export default {
    name: 'GooglePhotosPopup',
    components: {
        BigButton,
        Modal,
    },
    data() {
        return {
            photos: [],
            selectedPhotos: [],
        };
    },
    mounted() {
        GooglePhotosServer.getPhotos().then((photos) => {
            console.log(photos);
            if (photos) {
                this.photos = photos;
            }
        });
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
    div#google-photos {
        height: 580px;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    #google-photo-list {
        max-height: 90%;
        overflow-y: scroll;
    }

    a.close {
        float: right;
    }

    h2 {
        float: left;
    }

    .photo {
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
