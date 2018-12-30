<template>
    <div>
        <div v-if="isMapBlock" class="block block-map" @click="openMap">
            <div class="dot"/>
            <p class="header">Section {{ block.id }}</p>
            <p>{{ block.slides[0].from }} to {{ block.slides[0].to }}</p>
        </div>

        <GoogleMapForm v-if="isMapBlock && $store.state.ui.view === 'map'
            && block.slides[0] === $store.state.gallery.currentSlide"
        />

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
const fileUrl = require('file-url');

export default {
    name: 'ProjectNavigatorBlock',
    components: { GoogleMapForm },
    props: {
        block: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        isMapBlock() {
            return this.block.type === 'map';
        },
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

    div.block.block-gallery {
        width: 290px;
        padding: 4px;
        /*overflow: auto;*/
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
</style>
