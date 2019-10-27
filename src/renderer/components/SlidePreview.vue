<template>
    <div @click="setCurrent" :class="classObject" class="slide">
        <template v-if="Object.prototype.hasOwnProperty.call(slide, 'from')">
            <div class="overlay overlay-top">
                <a @click.stop="showMenu" href="#" class="fas fa-ellipsis-v"/>
                <ul v-if="menuVisible" @mouseleave="hideMenu" class="menu">
                    <li @click.stop="addImages">Add pictures after</li>
                    <li @click.stop="exifSort">EXIF sort</li>
                    <li @click.stop="deleteSlide">Delete section</li>
                </ul>
            </div>

            <dl>
                <dt>From:</dt>
                <dd>{{ slide.from }}</dd>
                <dt>To:</dt>
                <dd>{{ slide.to }}</dd>
            </dl>
        </template>
        <template v-else>
            <div class="overlay overlay-top">
                <a @click.stop="showMenu" href="#" class="fas fa-ellipsis-v"/>
                <ul @mouseleave="hideMenu" v-if="menuVisible" class="menu">
                    <li @click.stop="addImages">Add pictures after</li>
                    <li @click.stop="addMap">Add map section after</li>
                    <!--li @click.stop="setAsCover">Set as cover picture</li-->
                    <li @click.stop="deleteSlide">Delete picture</li>
                </ul>
            </div>

            <div class="imgholder">
                <img :src="thumbnailUrl" :title="slide.filename" :alt="slide.filename" @click="showImage">
            </div>
            <div class="overlay overlay-bottom">
                <a href="#" class="fas fa-undo"/>
            </div>
        </template>
    </div>
</template>

<script>
import Controller from 'EnvServices/Controller';
import SlideUrl from '../services/SlideUrl';

export default {
    name: 'SlidePreview',
    props: {
        slide: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        menuVisible: false,
    }),
    computed: {
        classObject() {
            const classes = [];
            classes.push(Object.prototype.hasOwnProperty.call(this.slide, 'from') ? 'map' : 'image');

            if (this.slide === this.$store.state.gallery.currentSlide) {
                classes.push('current');
            }

            return classes;
        },
        currentSlide() {
            return this.$store.state.gallery.currentSlide;
        },
        thumbnailUrl() {
            return SlideUrl.getThumbnailUrl(this.slide);
        },
        currentView() {
            return this.$store.state.ui.view;
        },
    },
    watch: {
        currentSlide(newSlide) {
            if (newSlide === this.slide) {
                this.$nextTick(() => this.$el.scrollIntoViewIfNeeded());
            }
        },
        currentView(newView) {
            if (this.currentSlide === this.slide && newView === 'gallery') {
                this.$nextTick(() => this.$el.scrollIntoViewIfNeeded());
            }
        },
    },
    methods: {
        setCurrent() {
            this.$store.commit('setCurrentSlide', this.slide);
        },
        deleteSlide() {
            this.$store.commit('deleteSlide', this.slide);
        },
        exifSort() {
            this.$store.commit('orderByExifAfter', this.slide);
        },
        addImages() {
            Controller.addImages(this.slide);
        },
        addMap() {
            Controller.addMapSlideAfter(this.slide);
        },
        setAsCover() {
            // TODO
        },
        showMenu() {
            this.menuVisible = true;
        },
        hideMenu() {
            this.menuVisible = false;
        },
        showImage() {
            this.$store.commit('setCurrentSlide', this.slide);
            this.$store.commit('setView', 'image');
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

    .overlay {
        position: absolute;
        right: 8px;
        top: 8px;
        display: none;
    }

    .overlay a {
        color: #333333;
        font-size: 14px;
    }

    .slide.current .overlay a {
        color: #f5c500;
    }

    .overlay.overlay-bottom {
        bottom: 8px;
        top: unset;
    }

    .slide:hover .overlay {
        display: block;
    }

    .overlay-top ul.menu {
        position: absolute;
        width: 140px;
        top: -6px;
        right: -6px;
        list-style-type: none;
        background-color: #fafafa;
        border-radius: 4px;
        padding: 8px 0;
        margin: 0;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                    0 3px 14px 2px rgba(0, 0, 0, 0.12),
                    0 8px 10px 1px rgba(0, 0, 0, 0.14);
    }

    .overlay-top .menu li {
        cursor: pointer;
        line-height: 28px;
        padding-left: 5px;
        font-size: 13px;
    }

    .overlay-top .menu li:hover {
        background-color: #dddddd;
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
