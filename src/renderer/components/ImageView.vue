<template>
    <div class="imageview" v-bind:style="styleObject"></div>
</template>

<script>
export default {
    name: 'ImageView',
    computed: {
        src() {
            // todo teszt linuxon
            return this.$store.getters.currentSlideType === 'image'
                ? this.$store.state.currentSlide.path.replace(/\\+/g, '/') : '';
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
