<template>
    <div class="holder">
        <div :style="styleObject" class="imageview"/>
        <a href="#" class="close fas fa-times" @click="close"/>
        <div class="buttons">
            <a href="#" @click="deleteImage"><i class="fas fa-trash"/> Delete</a>
            <a v-if="(currentSlide.source === 'web' && !currentSlide.uploaded) || (!currentSlide.source && !isWeb)"
               href="#"
               @click="rotateImage"
            ><i class="fas fa-undo"/> Rotate</a>
        </div>
    </div>
</template>

<script>
import Controller from 'EnvServices/Controller';
import ImageProcessor from 'EnvServices/ImageProcessor';
import SlideUrl from '../services/SlideUrl';

export default {
    name: 'ImageView',
    asyncComputed: {
        src() {
            if (this.$store.getters.currentSlideType === 'image') {
                const slide = this.currentSlide;
                const url = SlideUrl.getFullsizeUrl(slide);

                if (!process.env.IS_WEB && !slide.source && slide.orientation > 1) {
                    return ImageProcessor.getTempRotatedFile(slide);
                }

                return url;
            }
            return '';
        },
        styleObject() {
            return {
                'background-image': `url('${this.src}')`,
            };
        },
    },
    computed: {
        currentSlide() {
            return this.$store.state.gallery.currentSlide;
        },
        isWeb() {
            return process.env.IS_WEB;
        },
    },
    watch: {
        currentSlide() {
            if (this.$store.state.ui.view === 'image' && this.$store.getters.currentSlideType !== 'image') {
                this.$store.commit('setView', 'map');
            }
        },
    },
    methods: {
        close() {
            Controller.closeSlide();
        },
        deleteImage() {
            Controller.closeSlide();
            Controller.deleteSlide();
        },
        rotateImage() {
            Controller.rotateSlide(this.currentSlide);
        },
    },
};
</script>

<style scoped>
    .holder {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #eeeeee;
    }
    .imageview {
        height: 80%;
        width: 80%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    a.close {
        display: block;
        position: absolute;
        top: 30px;
        right: 40px;
        font-size: 20px;
        color: #80868b;
    }

    div.buttons {
        position: absolute;
        margin: auto;
        top: 91%;
    }

    div.buttons a {
        font-size: 22px;
        display: block;
        padding: 0 20px;
        float: left;
    }
</style>
