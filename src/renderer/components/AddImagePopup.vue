<template>
    <Modal>
        <template slot="header">
            <h2>Add pictures</h2>
            <a href="#" class="close fas fa-times" @click="close"/>
        </template>

        <template slot="body">
            <div class="centered">
                <BigButton cssstyle="width: 300px" cssclass="add-image-from-computer" @click="addFromComputer">
                    Upload from computer
                </BigButton>
                <BigButton cssstyle="width: 300px" @click="addFromFlickr">Import from flickr</BigButton>
                <BigButton cssstyle="width: 300px" @click="addFromGoogle">Import from Google Photos</BigButton>
            </div>
        </template>
    </Modal>
</template>

<script>
import Controller from 'EnvServices/Controller';
import Modal from './Modal';
import BigButton from '@/components/BigButton';

export default {
    name: 'AddImagePopup',
    components: {
        BigButton,
        Modal,
    },
    methods: {
        addFromComputer() {
            this.close();
            Controller.addImagesFromDevice().then(() => {
                this.$store.commit('setView', 'gallery');
            });
        },
        addFromFlickr() {
            this.close();
            Controller.openFlickr();
        },
        addFromGoogle() {
            this.close();
            Controller.openGooglePhotos();
        },
        close() {
            this.$store.commit('closePopup', 'addImage');
        },
    },
};
</script>

<style scoped>
h2 {
    float: left;
    margin-top: 0;
}

div.centered {
    margin: auto;
    text-align: center;
    line-height: 65px;
}

a.close {
    float: right;
}
</style>
