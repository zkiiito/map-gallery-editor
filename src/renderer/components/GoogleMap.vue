<template>
    <div :id="id" class="googleMap"></div>
</template>

<script>
/* global MapAnimator */
const loadGoogleMapsApi = require('load-google-maps-api');
const LoadJS = require('load-js');
const uuidv4 = require('uuid/v4');

export default {
    name: 'GoogleMap',
    data() {
        return {
            id: uuidv4(),
        };
    },
    computed: {
        currentSlide() {
            return this.$store.state.currentSlide;
        },
    },
    mounted() {
        loadGoogleMapsApi({ key: 'AIzaSyBxibPU_2mMsI8c5o0wVeG6uBnxps0c6wE' })
            .then(() => LoadJS(['static/MapGallery/scripts/v3_epoly.js', 'static/MapGallery/scripts/MapAnimator.js']))
            .then(() => {
                this.$nextTick(() => {
                    MapAnimator.mapdiv = this.id;
                    MapAnimator.animationTriggerEvent = 'center_changed';
                    MapAnimator.initialize();
                });

                this.$bus.$on('map-showroute', () => {
                    MapAnimator.showRoute({
                        from: this.currentSlide.from,
                        to: this.currentSlide.to,
                        speed: this.currentSlide.speed,
                        mode: this.currentSlide.mode,
                    }, (err) => {
                        this.$bus.$emit('map-error', err);
                    });
                });
            });
    },
    watch: {
        currentSlide(newSlide, oldSlide) {
            if (!oldSlide || !newSlide || newSlide.id !== oldSlide.id) {
                MapAnimator.stopAnimation();
                if (newSlide && newSlide.from) {
                    MapAnimator.showRoute(newSlide, (err) => {
                        this.$bus.$emit('map-error', err);
                    });
                }
            }
        },
    },
};
</script>

<style scoped>

</style>
