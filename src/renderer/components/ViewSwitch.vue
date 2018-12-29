<template>
    <div id="view-switch-holder">
        <div id="view-switch-map" :class="viewSwitchMapClass" @click="setMap">MAP</div>
        <div id="view-switch-gallery" :class="viewSwitchGalleryClass" @click="setGallery">GALLERY</div>
    </div>
</template>

<script>
export default {
    name: 'ViewSwitch',
    computed: {
        viewSwitchMapClass() {
            const c = ['view-switch'];
            if (this.$store.state.ui.view === 'map') {
                c.push('active');
            }
            return c.join(' ');
        },
        viewSwitchGalleryClass() {
            const c = ['view-switch'];
            if (this.$store.state.ui.view === 'gallery') {
                c.push('active');
            }
            return c.join(' ');
        },
    },
    methods: {
        setMap() {
            this.$store.commit('setView', 'map');
        },
        setGallery() {
            this.$store.commit('setView', 'gallery');
        },
    },
};
</script>

<style scoped>
#view-switch-holder {
    width: 388px;
    border-radius: 10px;
    overflow: auto;
    position: absolute;
    left: 50%;
    top: 24px;
    box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.25);
}

.view-switch {
    width: 194px;
    height: 38px;
    text-align: center;
    font-size: 18px;
    line-height: 40px;
    font-weight: 400;
    background-color: #ffffff;
    border-bottom: 5px solid #ffffff;
    color: #b0b0b0;
    float: left;
    cursor: pointer;
}

#view-switch-map {
    border-right: 1px solid #eeeeee;
    width: 193px;
}

#view-switch-gallery {
}

.view-switch.active {
    border-bottom: 5px solid #f5c500;
    color: #404041;
}

</style>
