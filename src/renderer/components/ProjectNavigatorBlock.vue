<template>
    <div>
        <div v-if="!editMode" class="block block-map">
            <p class="header" @click="openMap">
                <span class="light">Section {{ block.id }}: </span>{{ block.mapslide.from }} to {{ block.mapslide.to }}
            </p>

            <div v-for="(slide, idx) in block.slides.slice(0, 6)" :key="idx" :style="`background-image: url('${thumbnailUrl(slide)}')`"
                 class="img"
                 @click="scrollToSection"
            >
                <span v-if="idx === 0" class="count">{{ block.slides.length }}</span>
            </div>
            <BigButton v-if="block.slides.length === 0"
                       style="width: 170px"
                       cssclass="small empty"
                       @click="addImages"
            >
                Add pictures!
            </BigButton>
            <br style="clear:both">
        </div>

        <div v-if="editMode" class="block block-map-form">
            <p class="header"><span class="light">Section {{ block.id }}</span></p>
            <a href="#" class="close fas fa-times" @click="closeForm"/>

            <GoogleMapForm ref="mapForm" :slide="block.mapslide"/>

            <!--BigButton class="big-button" cssclass="small empty">Add</BigButton-->
            <BigButton class="big-button" cssclass="small empty" @click="showRoute">Run test!</BigButton>
            <br style="clear: both">
        </div>
    </div>
</template>

<script>
import Controller from 'EnvServices/Controller';
import GoogleMapForm from './GoogleMapForm';
import BigButton from './BigButton';
import SlideUrl from '../services/SlideUrl';

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
        currentSlide() {
            return this.$store.state.gallery.currentSlide;
        },
    },
    watch: {
        currentSlide(newSlide) {
            this.editMode = false;
            if (newSlide === this.block.mapslide) {
                this.$nextTick(() => this.$el.scrollIntoViewIfNeeded());
            }
        },
    },
    mounted() {
        if (this.block.mapslide === this.$store.state.gallery.currentSlide) {
            this.openMap();
        }
    },
    methods: {
        thumbnailUrl(slide) {
            return SlideUrl.getThumbnailUrl(slide);
        },
        openMap() {
            this.$store.commit('setCurrentSlide', this.block.mapslide);
            this.$store.commit('setView', 'map');
            this.editMode = true;
        },
        showRoute() {
            this.$refs.mapForm.animateRoute();
        },
        closeForm() {
            this.editMode = false;
        },
        scrollToSection() {
            this.$store.commit('setCurrentSlide', this.block.mapslide);
            this.$store.commit('setView', 'gallery');
        },
        addImages() {
            this.$store.commit('setCurrentSlide', this.block.mapslide);
            Controller.addImages(this.block.mapslide);
        },
    },
};
</script>

<style scoped>
    div.block {
        width: 290px;
        border-radius: 10px;
        background-color: #f6f6f6;
        border: 1px solid #dddddd;
        font-size: 14px;
        line-height: 20px;
        padding: 10px;
        position: relative;
        margin-bottom: 14px;
    }

    div.block p.header {
        margin-bottom: 8px;
        cursor: text;
    }

    div.block p.header span.light {
        color: #b0b0b0;
    }

    div.block a.close {
        position: absolute;
        right: 16px;
        top: 16px;
        font-size: 16px;
    }

    div.block.block-map-form {
        background-color: transparent;
        clear: both;
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
        cursor: pointer;
    }

    .big-button {
        float: right;
        margin: 20px 0 0 10px;
    }
</style>
