<template>
    <form v-if="this.$store.getters.currentSlideType === 'map'">
        <div class="field">
            <label class="label">From</label>
            <div class="control">
                <input v-model.lazy="routeFrom" class="input" type="text" placeholder="Start location">
            </div>
        </div>
        <div class="field">
            <label class="label">To</label>
            <div class="control">
                <input v-model.lazy="routeTo" class="input" type="text" placeholder="End location">
            </div>
        </div>
        <div class="field">
            <label class="label">Waypoints</label>
            <div class="control">
                <textarea v-model.lazy="routeWaypoints" class="input" placeholder="One per line"></textarea>
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
                this.$store.commit('updateCurrentSlide', { from: value });
            },
        },
        routeTo: {
            get() {
                return this.$store.state.gallery.currentSlide.to;
            },
            set(value) {
                this.$store.commit('updateCurrentSlide', { to: value });
            },
        },
        // "waypoints":[{"location":"Istanbul"}]
        routeWaypoints: {
            get() {
                const { waypoints } = this.$store.state.gallery.currentSlide;
                if (waypoints) {
                    return waypoints.map(waypoint => waypoint.location).join('\n');
                }

                return '';
            },
            set(value) {
                const waypoints = value.split('\n');
                const res = [];
                waypoints.forEach((waypoint) => {
                    if (waypoint.length) {
                        res.push({ location: waypoint });
                    }
                });

                this.$store.commit('updateCurrentSlide', { waypoints: res });
            },
        },
        routeSpeed: {
            get() {
                return this.$store.state.gallery.currentSlide.speed;
            },
            set(value) {
                this.$store.commit('updateCurrentSlide', { speed: value });
            },
        },
        routeMode: {
            get() {
                return this.$store.state.gallery.currentSlide.mode;
            },
            set(value) {
                this.$store.commit('updateCurrentSlide', { mode: value });
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
