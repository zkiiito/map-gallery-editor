<template>
    <div class="holder">
        <div :style="styleObject" class="imageview"/>
        <a @click="close" href="#" class="close fas fa-times"/>
        <div class="buttons">
            <a @click="deleteImage" href="#"><i class="fas fa-trash"/> Delete</a>
            <a @click="rotateImage" href="#"><i class="fas fa-undo"/> Rotate</a>
        </div>
    </div>
</template>

<script>
import Controller from '../services/Controller';
import SlideUrl from '../services/SlideUrl';

export default {
    name: 'ImageView',
    computed: {
        src() {
            if (this.$store.getters.currentSlideType === 'image') {
                return SlideUrl.getFullsizeUrl(this.$store.state.gallery.currentSlide);
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
        deleteImage() {
            Controller.closeSlide();
            Controller.deleteSlide();
        },
        rotateImage() {
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
