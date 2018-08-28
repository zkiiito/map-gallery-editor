<template>
    <div class="slide-small" v-on:click="setCurrent">
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
        exif_date2() {
            return this.$store.state.slides.find(el => el.id === this.$vnode.key).exif_date;
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

</style>
