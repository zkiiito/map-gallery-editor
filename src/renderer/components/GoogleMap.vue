<template>
    <div :id="id" class="googleMap"></div>
</template>

<script>
export default {
    name: 'GoogleMap',
    data() {
        return {
            id: null,
        };
    },
    computed: {
        currentSlide: {
            get() {
                return this.$store.state.currentSlide;
            },
        },
    },
    mounted() {
        const that = this;
        that.id = that._uid;
        this.$nextTick(() => {
            MapAnimator.mapdiv = that._uid;
            MapAnimator.animationTriggerEvent = 'center_changed';
            MapAnimator.initialize();
        });

        this.$bus.$on('map-showroute', (event) => {
            MapAnimator.showRoute({
                from: this.currentSlide.from,
                to: this.currentSlide.to,
                speed: this.currentSlide.speed,
                mode: this.currentSlide.mode,
            }, (err) => {
                alert(err);
            });
        });
    },
    watch: {
        currentSlide(newSlide, oldSlide) {
            if (!oldSlide || !newSlide || newSlide.id !== oldSlide.id) {
                MapAnimator.stopAnimation();
                if (newSlide.from) {
                    MapAnimator.showRoute(newSlide, (err) => { console.log(err); });
                }
            }
        },
    },
};
</script>

<style scoped>

</style>
