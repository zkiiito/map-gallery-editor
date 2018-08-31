<template>
    <div :id="id" class="googleMap">
        <webview src="static/webview.html" id="webv"></webview>
    </div>
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
        const webview = document.getElementById('webv');

        webview.addEventListener('did-stop-loading', () => {
            this.$nextTick(() => {
                // MapAnimator.mapdiv = this.id;
                const webview = document.getElementById('webv');
                webview.executeJavaScript(`MapAnimator.animationTriggerEvent = 'center_changed'`);
                webview.executeJavaScript(`MapAnimator.initialize()`);
            });

            this.$bus.$on('map-showroute', () => {
                const data = {
                    from: this.currentSlide.from,
                    to: this.currentSlide.to,
                    speed: this.currentSlide.speed,
                    mode: this.currentSlide.mode,
                };

                webview.executeJavaScript(`MapAnimator.showRoute(` + JSON.stringify(data) + `, (err) => {
                    console.log('map-error', err);
                });`);
            });
        });
    },
    watch: {
        cdurrentSlide(newSlide, oldSlide) {
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
