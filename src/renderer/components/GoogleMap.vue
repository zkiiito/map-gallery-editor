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
        that.$bus.$on(that.$bus.events.CLEAR_MAP, () => {
            that.clearMap();
        });
    },
    methods: {
        initMap() {
            MapAnimator.tick = 40;
            MapAnimator.step = 1200;
            MapAnimator.cacheServer = 'https://mapgallery.online';
            MapAnimator.animationTriggerEvent = 'center_changed';
            MapAnimator.initialize();

            google.maps.event.addListenerOnce(MapAnimator.map, 'idle', () => {
                this.worldViewFit();
            });
        },

        showRoute(route) {
            this.displayAllRoutes(false);
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

            this.displayAllRoutes(true);
        },

        displayAllRoutes(fit) {
            const routeSlides = this.$store.state.gallery.slides.filter((slide) => slide.from);
            if (routeSlides.length === 0) {
                return;
            }

            MapAnimator.showAllRoutes(routeSlides, fit)
                .then(() => {
                    routeSlides.forEach((slide, idx) => {
                        if (MapAnimator.allPolylines[idx]) {
                            const widePath = new google.maps.Polyline({
                                path: MapAnimator.allPolylines[idx].getPath(),
                                strokeColor: '#0000FF',
                                strokeOpacity: 0.01,
                                strokeWeight: 25,
                            });

                            widePath.setMap(MapAnimator.allPolylines[idx].getMap());
                            MapAnimator.allPolylines.push(widePath);

                            google.maps.event.addListener(widePath, 'click', () => {
                                this.$store.commit('setCurrentSlide', slide);
                                this.$store.commit('setSlideMapFormOpen', true);
                            });
                        }
                    });
                });
        },

        clearMap() {
            MapAnimator.showAllRoutes([], false);
            this.worldViewFit();
        },
    },
};
</script>

<style scoped>
    #map_canvas {
        height: 100%;
    }
</style>
