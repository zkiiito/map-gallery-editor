<template>
    <div :id="id" class="googleMap"></div>
</template>

<script>
/* global MapAnimator */

export default {
    name: 'GoogleMap',
    data() {
        return {
            id: null,
        };
    },
    computed: {
        currentSlide() {
            return this.$store.state.currentSlide;
        },
    },
    mounted() {
        this.id = this._uid;
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
    },
    watch: {
        currentSlide(newSlide, oldSlide) {
            if (!oldSlide || !newSlide || newSlide.id !== oldSlide.id) {
                MapAnimator.stopAnimation();
                if (newSlide.from) {
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
