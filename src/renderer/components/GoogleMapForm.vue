<template>
    <div v-if="this.$store.getters.currentSlideType === 'map'" id="map-form">
        <form ref="google-map-form">
            <dl>
                <dt><label class="label">From:</label></dt>
                <dd>
                    <input v-model.lazy="routeFrom" class="input" type="text" placeholder="Start location" required>
                </dd>
                <dt><label class="label">To:</label></dt>
                <dd>
                    <input v-model.lazy="routeTo" class="input" type="text" placeholder="End location" required>
                </dd>
                <dt><label class="label">Via:</label></dt>
                <dd>
                    <textarea v-model.lazy="routeWaypoints" class="input" placeholder="One per line"/>
                </dd>
                <dt><label class="label">Speed:</label></dt>
                <dd>
                    <LogarithmicSlider v-model="routeSpeed"/>
                </dd>
            </dl>

            <div id="map-route-mode">
                <input id="route-mode-driving" v-model="routeMode" type="radio" name="route-mode" value="DRIVING">
                <label for="route-mode-driving">DRIVING</label>
                <input id="route-mode-flying" v-model="routeMode" type="radio" name="route-mode" value="FLYING">
                <label for="route-mode-flying">FLYING</label>
                <input id="route-mode-walking" v-model="routeMode" type="radio" name="route-mode" value="WALKING">
                <label for="route-mode-walking">WALKING</label>
            </div>

            <BigButton class="big-button" cssclass="small empty">Add</BigButton>
            <BigButton class="big-button" cssclass="small link" @click="showRoute">Run test!</BigButton>
        </form>
    </div>
</template>

<script>
import LogarithmicSlider from './LogarithmicSlider.vue';
import BigButton from './BigButton';

export default {
    name: 'GoogleMapForm',
    components: { BigButton, LogarithmicSlider },
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
            if (this.$refs['google-map-form'].reportValidity()) {
                this.$bus.$emit('map-showroute');
            }
        },
    },
};
</script>

<style scoped>
div#map-form {
    width: 268px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    margin-left: 40px;
    padding: 24px 16px 20px 16px;
    overflow: auto;
}

dl {
    overflow: auto;
    margin: 0;
}

dl dt {
    float: left;
    width: 20%;
    line-height: 30px;
}

dl dd {
    float: left;
    width: 78%;
    margin: 0 0 16px;
}

label {
    font-size: 14px;
    color: #b0b0b0;
}

input, textarea {
    width: 90%;
}

#map-route-mode {
    border-radius: 5px;
    overflow: auto;
    background-color: #f6f6f6;
}

#map-route-mode input {
   display: none;
}

#map-route-mode input:checked + label {
    background-color: #eeeeee;
    color: #23abad;
}

#map-route-mode label {
    float: left;
    width: 33%;
    text-align: center;
    cursor: pointer;
    line-height: 32px;
    letter-spacing: -0.2px;
}

#map-route-mode label:nth-of-type(2) {
    border-left: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
}

.big-button {
    float: right;
    margin: 20px 0 0 10px;
}


</style>
