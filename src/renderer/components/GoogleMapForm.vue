<template>
    <form ref="google-map-form">
        <dl>
            <dt><label class="label">From:</label></dt>
            <dd>
                <input ref="routeFrom" v-model.lazy="routeFrom" class="input" type="text" placeholder="Start location" required>
            </dd>
            <dt><label class="label">To:</label></dt>
            <dd>
                <input ref="routeTo" v-model.lazy="routeTo" class="input" type="text" placeholder="End location" required>
            </dd>
            <dt><label class="label">Via:</label></dt>
            <dd>
                <ul id="waypoints" class="input">
                    <li v-for="(routeWaypoint, idx) in routeWaypoints" class="waypoint">
                        {{ routeWaypoint }}<a href="#" class="delete fas fa-times" @click="deleteWaypoint(idx)" title="delete"/>
                    </li>
                    <li><input ref="routeWaypoint" type="text" placeholder="Add waypoint"></li>
                </ul>

            </dd>
            <dt><label class="label">Speed:</label></dt>
            <dd>
                <logarithmic-slider v-model="routeSpeed"/>
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
    </form>
</template>

<script>
import LogarithmicSlider from './LogarithmicSlider.vue';

export default {
    name: 'GoogleMapForm',
    components: { LogarithmicSlider },
    props: {
        slide: {
            type: Object,
            default: null,
        },
    },
    computed: {
        routeFrom: {
            get() {
                return this.slide.from;
            },
            set(value) {
                this.updateSlide({ from: value });
            },
        },
        routeTo: {
            get() {
                return this.slide.to;
            },
            set(value) {
                this.updateSlide({ to: value });
            },
        },
        // "waypoints":[{"location":"Istanbul"}]
        routeWaypoints: {
            get() {
                const { waypoints } = this.slide;
                if (waypoints) {
                    return waypoints.map((waypoint) => waypoint.location);
                }

                return [];
            },
            set(value) {
                const res = [];
                value.forEach((waypoint) => {
                    if (waypoint.length) {
                        res.push({ location: waypoint });
                    }
                });

                this.updateSlide({ waypoints: res });
            },
        },
        routeSpeed: {
            get() {
                return this.slide.speed;
            },
            set(value) {
                this.updateSlide({ speed: value });
            },
        },
        routeMode: {
            get() {
                return this.slide.mode;
            },
            set(value) {
                this.updateSlide({ mode: value });
            },
        },
    },
    mounted() {
        const options = {
            types: ['geocode'],
        };

        /* global google */
        const autocompleteFrom = new google.maps.places.Autocomplete(this.$refs.routeFrom, options);
        const autoCompleteTo = new google.maps.places.Autocomplete(this.$refs.routeTo, options);
        const autoCompleteWaypoint = new google.maps.places.Autocomplete(this.$refs.routeWaypoint, options);

        google.maps.event.addListener(autocompleteFrom, 'place_changed', () => {
            this.routeFrom = autocompleteFrom.getPlace().formatted_address;
        });

        google.maps.event.addListener(autoCompleteTo, 'place_changed', () => {
            this.routeTo = autoCompleteTo.getPlace().formatted_address;
        });

        google.maps.event.addListener(autoCompleteWaypoint, 'place_changed', () => {
            const waypoints = this.routeWaypoints;
            waypoints.push(autoCompleteWaypoint.getPlace().formatted_address);
            this.routeWaypoints = waypoints;
            this.$refs.routeWaypoint.value = '';
            this.$refs.routeWaypoint.focus();
        });
    },
    methods: {
        displayRoute() {
            if (this.$refs['google-map-form'].reportValidity()) {
                this.$bus.$emit(this.$bus.events.MAP_DISPLAY_ROUTE);
            }
        },
        animateRoute() {
            if (this.$refs['google-map-form'].reportValidity()) {
                this.$bus.$emit(this.$bus.events.MAP_ANIMATE_ROUTE);
            }
        },
        updateSlide(data) {
            this.$store.commit('updateSlide', {
                slide: this.slide,
                newValues: data,
            });
        },
        deleteWaypoint(idx) {
            const waypoints = this.routeWaypoints;
            waypoints.splice(idx, 1);
            this.routeWaypoints = waypoints;
        },
    },
};
</script>

<style scoped>
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

ul#waypoints {
    padding: 0;
    margin: 0;
    list-style-type: none;
}

ul#waypoints li.waypoint {
    padding: 8px;
}

ul#waypoints li.waypoint a.delete {
    float: right;
    display: block;
    color: #ff0000;
}
</style>
