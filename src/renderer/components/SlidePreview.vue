<template>
    <div class="slide" v-on:click="setCurrent" v-bind:class="classObject">
        <template v-if="slide.from">
            {{ slide.from }} - {{ slide.to }}
        </template>
        <template v-else>
            <div class="imgholder">
                <img :src="slide.thumbnail" :title="slide.filename">
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'SlidePreview',
    props: ['slide'],
    computed: {
        classObject() {
            const classes = [];
            classes.push(this.slide.from ? 'map' : 'image');

            if (this.slide === this.$store.state.currentSlide) {
                classes.push('current');
            }

            return classes;
        },
        currentSlide() {
            return this.$store.state.currentSlide;
        },
    },
    methods: {
        setCurrent() {
            this.$store.commit('setCurrentSlide', this.slide);
        },
    },
    watch: {
        currentSlide(newSlide) {
            if (newSlide === this.slide) {
                // TODO: scrollTo
            }
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
        cursor: grab;
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
