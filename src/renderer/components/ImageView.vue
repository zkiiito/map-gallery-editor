<template>
    <div class="holder">
        <div class="imageview" :style="styleObject"/>
        <a href="#" class="close fas fa-times" @click="close"/>
    </div>
</template>

<script>
import Controller from '../services/Controller';

const fileUrl = require('file-url');

export default {
    name: 'ImageView',
    computed: {
        src() {
            if (this.$store.getters.currentSlideType === 'image') {
                switch (this.$store.state.gallery.currentSlide.source) {
                case 'flickr':
                    return this.$store.state.gallery.currentSlide.path;
                default:
                    return fileUrl(this.$store.state.gallery.currentSlide.path);
                }
            }
            return '';
        },
        styleObject() {
            return {
                'background-image': `url('${this.src}')`,
            };
        },
    },
    mounted() {
        const that = this;

        this.$bus.$on(this.$bus.events.CURRENT_SLIDE_CHANGED, () => {
            if (that.$store.state.ui.view === 'image' && that.$store.getters.currentSlideType !== 'image') {
                that.$store.commit('setView', 'map');
            }
        });
    },
    methods: {
        close() {
            Controller.closeSlide();
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
</style>
