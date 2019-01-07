<template>
    <div>
        <div v-if="isMapBlock && !editMode" class="block block-map" @click="openMap">
            <div class="dot"/>
            <p class="header">Section {{ block.id }}</p>
            <p>{{ block.slides[0].from }} to {{ block.slides[0].to }}</p>
        </div>

        <div class="block block-map-form" v-if="isMapBlock && editMode">
            <div class="dot"/>
            <p class="header">Section {{ block.id }}</p>

            <GoogleMapForm ref="mapForm" :slide="block.slides[0]"/>

            <BigButton class="big-button" cssclass="small empty">Add</BigButton>
            <BigButton class="big-button" cssclass="small link" @click="showRoute">Run test!</BigButton>
            <br style="clear: both">
        </div>

        <div v-if="!isMapBlock" class="block block-gallery">
            <div class="dot"/>
            <div v-for="(slide, idx) in block.slides.slice(0, 6)" :key="idx" class="img"
                 :style="`background-image: url('${thumbnailUrl(slide)}')`"
            >
                <span v-if="idx === 0" class="count">{{ block.slides.length }}</span>
            </div>
            <br style="clear:both">
        </div>
    </div>
</template>

<script>
import GoogleMapForm from './GoogleMapForm';
import BigButton from './BigButton';

const fileUrl = require('file-url');

export default {
    name: 'ProjectNavigatorBlock',
    components: { GoogleMapForm, BigButton },
    props: {
        block: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        editMode: false,
    }),
    computed: {
        isMapBlock() {
            return this.block.type === 'map';
        },
    },
    mounted() {
        const that = this;

        this.$bus.$on(this.$bus.events.CURRENT_SLIDE_CHANGED, () => {
            that.editMode = false;
        });

        if (this.block.slides[0] === this.$store.state.gallery.currentSlide) {
            this.openMap();
        }
    },
    methods: {
        thumbnailUrl(slide) {
            switch (slide.source) {
            case 'flickr':
                return slide.thumbnail;
            default:
                return fileUrl(slide.thumbnail);
            }
        },
        openMap() {
            this.$store.commit('setCurrentSlide', this.block.slides[0]);
            this.$store.commit('setView', 'map');
            this.editMode = true;
        },
        showRoute() {
            this.$refs.mapForm.showRoute();
        },
    },
};
</script>

<style scoped>
    div.block {
        width: 266px; /*  300 - 2 - 32 */
        border-radius: 10px;
        background-color: #f6f6f6;
        border: 1px solid #dddddd;
        font-size: 14px;
        line-height: 20px;
        padding: 16px;
        margin: 8px 0 8px 40px;
        position: relative;
    }

    div.block p.header {
        color: #b0b0b0;
        margin-bottom: 8px;
    }

    div.block.block-map-form {
        background-color: transparent;
        clear: both;
    }

    div.block.block-gallery {
        width: 290px;
        padding: 4px;
        clear: both;
    }

    div.block.block-gallery img {
        margin: 4px;
    }

    div.img {
        margin: 4px;
        background-image: url('https://placeimg.com/150/70/nature?');
        height: 40px;
        width: 40px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        float: left;
        border-radius: 4px;
        text-align: center;
    }

    div.img span.count {
        line-height: 40px;
        font-size: 16px;
        color: #ffffff;
    }

    div.dot {
        position: absolute;
        width: 9px;
        height: 9px;
        background-color: #f5c500;
        top: 50%;
        left: -5px;
        border-radius: 4px;
        margin-top: -5px;
    }

    .big-button {
        float: right;
        margin: 20px 0 0 10px;
    }
</style>
