<template>
    <div class="imageview" v-bind:style="styleObject"></div>
</template>

<script>
const fileUrl = require('file-url');

export default {
    name: 'ImageView',
    computed: {
        src() {
            return this.$store.getters.currentSlideType === 'image' ? fileUrl(this.$store.state.gallery.currentSlide.path) : '';
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
