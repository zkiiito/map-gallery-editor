<template>
    <div class="slide" :class="classObject" @click="setCurrent">
        <template v-if="slide.from">
            {{ slide.from }} - {{ slide.to }}
        </template>
        <template v-else>
            <div class="imgholder">
                <img :src="thumbnailUrl" :title="slide.filename">
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
            return fileUrl(this.slide.thumbnail);
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
        width: 150px;
        height: 120px;
        margin: 10px;
        float: left;
        cursor: move;
    }

    .slide.map {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        background-color: aliceblue;
    }

    .slide .imgholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .slide img {
        max-height: 120px;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.75);
    }

    .slide.image.current img {
        box-shadow: 0 2px 5px 0 rgba(255,0,0,0.75);
    }

    .slide.map.current {
        box-shadow: 0 2px 5px 0 rgba(255,0,0,0.75);
    }
</style>
