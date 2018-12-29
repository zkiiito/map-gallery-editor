<template>
    <div class="slide" :class="classObject" @click="setCurrent">
        <div class="menu menu-top">
            <a href="#">:</a>
        </div>
        <template v-if="slide.from">
            {{ slide.from }} - {{ slide.to }}
        </template>
        <template v-else>
            <div class="imgholder">
                <img :src="thumbnailUrl" :title="slide.filename">
            </div>
            <div class="menu menu-bottom">
                <a href="#">0</a>
            </div>
        </template>
    </div>
</template>

<script>
const fileUrl = require('file-url');

export default {
    name: 'SlidePreview',
    props: {
        slide: Object,
    },
    computed: {
        classObject() {
            const classes = [];
            classes.push(this.slide.from ? 'map' : 'image');

            if (this.slide === this.$store.state.gallery.currentSlide) {
                classes.push('current');
            }

            return classes;
        },
        currentSlide() {
            return this.$store.state.gallery.currentSlide;
        },
        thumbnailUrl() {
            switch (this.slide.source) {
            case 'flickr':
                return this.slide.thumbnail;
            default:
                return fileUrl(this.slide.thumbnail);
            }
        },
    },
    watch: {
        currentSlide(newSlide) {
            if (newSlide === this.slide) {
                // TODO: scrollTo
            }
        },
    },
    methods: {
        setCurrent() {
            this.$store.commit('setCurrentSlide', this.slide);
        },
    },
};
</script>

<style scoped>
    .slide {
        width: 165px;
        height: 165px;
        margin: 10px;
        float: left;
        cursor: move;
        background-color: #ffffff;
        position: relative;
    }

    .slide .imgholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .slide img {
        max-height: 150px;
        max-width: 150px;
        border-radius: 4px;
    }

    .slide.current {
        outline: 4px solid #f5c500;
        outline-offset: -4px;
    }

    .slide:hover {
        box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.3);
    }

    .menu {
        position: absolute;
        right: 5px;
        display: none;
    }

    .menu.menu-bottom {
        bottom: 5px;
    }

    .slide:hover .menu {
        display: block;
    }

    dl {
        overflow: auto;
        margin: 0;
        padding: 32px 16px;
        font-size: 14px;
    }

    dl dt {
        float: left;
        width: 25%;
    }

    dl dd {
        float: left;
        width: 50%;
        margin: 0;
        padding-left: 10px;
        font-weight: 500;
    }
</style>
