<template>
    <div class="imageview" :style="styleObject"/>
</template>

<script>
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
};
</script>

<style scoped>
    .imageview {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
</style>
