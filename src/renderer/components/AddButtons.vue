<template>
    <div id="addButtons">
        <div style="margin-left: 40px; margin-top: 15px">
            <BigButton v-if="$store.state.gallery.slides.every(slide => slide.from === undefined)"
                       @click="addMapSlide" cssclass="huge"
            >
                <div class="bigbutton-content">
                    <img src="static/ui/map-illustration.png" alt="map icon">
                    ADD MAP
                </div>
            </BigButton>

            <div style="margin: 15px"/>

            <BigButton v-if="$store.state.gallery.slides.every(slide => slide.path === undefined)"
                       @click="addImages" cssclass="huge"
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
            <a @click="addMapSlide" href="#"><i class="fas fa-plus-circle"/> Add map</a>&nbsp;&nbsp;
            <a @click="addImages" href="#"><i class="fas fa-plus-circle"/> Add pictures</a>
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
            Controller.addImages().then(() => {
                this.$store.commit('setView', 'gallery');
            });
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
