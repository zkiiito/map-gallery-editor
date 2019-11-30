<template>
    <div id="addButtons">
        <div style="margin-left: 40px; margin-top: 15px">
            <BigButton v-if="$store.state.gallery.slides.every(slide => slide.from === undefined)"
                       cssclass="huge" @click="addMapSlide"
            >
                <div class="bigbutton-content">
                    <img src="static/ui/map-illustration.png" alt="map icon">
                    ADD MAP
                </div>
            </BigButton>

            <div style="margin: 15px"/>

            <BigButton v-if="$store.state.gallery.slides.every(slide => slide.path === undefined)"
                       cssclass="huge" @click="addImages"
            >
                <div class="bigbutton-content">
                    <img src="static/ui/pic-illustration.png" alt="photo icon">
                    ADD PICTURES
                </div>
            </BigButton>

            <div style="margin: 15px"/>
        </div>

        <div v-if="$store.state.gallery.slides.some(slide => slide.from !== undefined)
                 || $store.state.gallery.slides.some(slide => slide.path !== undefined)"
             style="text-align:center; font-size: 12px;"
        >
            <a href="#" @click="addMapSlide"><i class="fas fa-plus-circle"/> Add map</a>&nbsp;&nbsp;
            <a href="#" @click="addImages"><i class="fas fa-plus-circle"/> Add pictures</a>
        </div>
    </div>
</template>
<script>
import Controller from 'EnvServices/Controller';
import BigButton from './BigButton';

export default {
    name: 'AddButtons',
    components: {
        BigButton,
    },
    methods: {
        addMapSlide() {
            const mapSlide = Controller.addMapSlide();
            this.$store.commit('setCurrentSlide', mapSlide);
        },
        addImages() {
            Controller.addImages();
        },
    },
};
</script>

<style scoped>
    #addButtons {
        flex-grow: 1;
    }

    .bigbutton-content {
        display: flex;
        align-items: center;
    }

    .bigbutton-content img {
        margin-right: 15px;
    }
</style>
