<template>
    <form v-if="this.$store.getters.currentSlideType === 'map'">
        <div class="field">
            <label class="label">From</label>
            <div class="control">
                <input v-model="routeFrom" class="input" type="text" placeholder="Start location">
            </div>
        </div>
        <div class="field">
            <label class="label">To</label>
            <div class="control">
                <input v-model="routeTo" class="input" type="text" placeholder="End location">
            </div>
        </div>
        <div class="field">
            <label class="label">Speed</label>
            <div class="control">
                <LogarithmicSlider v-model="routeSpeed"/>
            </div>
        </div>
        <div class="field">
            <label class="label">Travel mode</label>
            <div class="select">
                <select v-model="routeMode">
                    <option value="DRIVING" selected>driving</option>
                    <option value="FLYING">flying</option>
                    <option value="WALKING">walking</option>
                </select>
            </div>
        </div>

        <div class="control">
            <button class="button is-link" type="button" @click="showRoute">test</button>
        </div>
    </form>
</template>

<script>
import LogarithmicSlider from './LogarithmicSlider.vue';

export default {
    name: 'GoogleMapForm',
    components: { LogarithmicSlider },
    computed: {
        routeFrom: {
            get() {
                return this.$store.state.gallery.currentSlide.from;
            },
            set(value) {
                this.$store.state.gallery.currentSlide.from = value;
            },
        },
        routeTo: {
            get() {
                return this.$store.state.gallery.currentSlide.to;
            },
            set(value) {
                this.$store.state.gallery.currentSlide.to = value;
            },
        },
        routeSpeed: {
            get() {
                return this.$store.state.gallery.currentSlide.speed;
            },
            set(value) {
                this.$store.state.gallery.currentSlide.speed = value;
            },
        },
        routeMode: {
            get() {
                return this.$store.state.gallery.currentSlide.mode;
            },
            set(value) {
                this.$store.state.gallery.currentSlide.mode = value;
            },
        },
    },
    methods: {
        showRoute() {
            this.$bus.$emit('map-showroute');
        },
    },
};
</script>

<style scoped>

</style>
