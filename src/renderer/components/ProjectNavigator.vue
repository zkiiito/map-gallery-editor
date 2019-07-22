<template>
    <div id="projectNavigator">
        <div v-for="(block, idx) in blocks" :key="idx">
            <ProjectNavigatorBlock :block="block"/>
        </div>
        <div/>
    </div>
</template>

<script>
import ProjectNavigatorBlock from './ProjectNavigatorBlock';

export default {
    name: 'ProjectNavigator',
    components: { ProjectNavigatorBlock },
    computed: {
        blocks() {
            return this.$store.state.gallery.slides.reduce((blocks, slide) => {
                if (Object.prototype.hasOwnProperty.call(slide, 'from')) {
                    blocks.push({
                        id: blocks.length + 1,
                        mapslide: slide,
                        slides: [],
                    });
                } else if (blocks.length > 0) {
                    blocks[blocks.length - 1].slides.push(slide);
                }

                return blocks;
            }, []);
        },
    },
};
</script>

<style scoped>
div#projectNavigator {
    margin-left: 34px;
}
</style>
