<template>
    <div>
        <ProjectNavigatorBlock v-for="block in blocks" :key="block.id" :block="block"/>
    </div>
</template>

<script>
import ProjectNavigatorBlock from './ProjectNavigatorBlock';

export default {
    name: 'ProjectNavigator',
    components: { ProjectNavigatorBlock },
    computed: {
        blocks() {
            const blocks = [];
            let curBlock = [];
            let mapIdx = 1;

            this.$store.state.gallery.slides.forEach((slide) => {
                if (slide.hasOwnProperty('from')) {
                    if (curBlock.length) {
                        blocks.push({
                            id: `g${mapIdx}`,
                            type: 'gallery',
                            slides: curBlock.slice(0),
                        });
                    }
                    blocks.push({
                        type: 'map',
                        id: mapIdx,
                        slides: [slide],
                    });
                    mapIdx++;
                    curBlock = [];
                } else {
                    curBlock.push(slide);
                }
            });

            if (curBlock.length) {
                blocks.push({
                    id: `g${mapIdx}`,
                    type: 'gallery',
                    slides: curBlock.slice(0),
                });
            }

            return blocks;
        },
    },
};
</script>

<style scoped>

</style>
