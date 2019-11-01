<template>
    <div class="googleMap">
        <div id="map_canvas"/>
    </div>
</template>

<script>
/* global MapAnimator, google */
export default {
    name: 'GoogleMap',
    computed: {
        currentSlide() {
            return this.$store.state.gallery.currentSlide;
        },
    },
    watch: {
        currentSlide(newSlide, oldSlide) {
            if (!oldSlide || !newSlide || newSlide.id !== oldSlide.id) {
                MapAnimator.stopAnimation();
                if (newSlide && newSlide.from) {
                    this.displayRoute(newSlide);
                }
            }
        },
    },
    mounted() {
        const that = this;
        this.initMap();

        that.$bus.$on(that.$bus.events.MAP_ANIMATE_ROUTE, () => {
            that.showRoute(that.currentSlide);
        });
        that.$bus.$on(that.$bus.events.MAP_DISPLAY_ROUTE, () => {
            that.displayRoute(that.currentSlide);
        });
        that.$bus.$on(that.$bus.events.PROJECT_OPENED, () => {
            that.worldViewFit();
        });
    },
    methods: {
        initMap() {
            MapAnimator.tick = 40;
            MapAnimator.step = 1200;
            MapAnimator.animationTriggerEvent = 'center_changed';
            MapAnimator.initialize();

            google.maps.event.addListenerOnce(MapAnimator.map, 'idle', () => {
                this.worldViewFit();
            });
        },

        showRoute(route) {
            MapAnimator.showRoute(route, (error) => {
                if (error) {
                    if (error === 'NOT_FOUND') {
                        error = 'Locations not found';
                    } else if (error === 'ZERO_RESULTS') {
                        error = 'No route found.';
                    }

                    this.$bus.$emit('error', error);
                }
            });
        },

        displayRoute(route) {
            const routeClone = { ...route };
            routeClone.displayOnly = true;
            this.showRoute(routeClone);
        },

        worldViewFit() {
            const mapObj = MapAnimator.map;
            const worldBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(70.4043, -143.5291), //  Top-left
                new google.maps.LatLng(-46.11251, 163.4288), // Bottom-right
            );
            mapObj.fitBounds(worldBounds, 0);
            const actualBounds = mapObj.getBounds();
            if (actualBounds.getSouthWest().lng() === -180 && actualBounds.getNorthEast().lng() === 180) {
                mapObj.setZoom(mapObj.getZoom() + 1);
            }
        },
    },
};
</script>

<style scoped>
    #map_canvas {
        height: 100%;
    }
</style>
