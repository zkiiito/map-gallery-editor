<template>
    <div id="projectNavigator">
        <div v-for="(block, idx) in blocks" :key="idx" :class="`${getClass(idx)}`">
            <ProjectNavigatorBlock :block="block" class="section-inner"/>
        </div>

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
                if (Object.prototype.hasOwnProperty.call(slide, 'from')) {
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
                    mapIdx += 1;
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
    methods: {
        getClass(idx) {
            if (this.blocks[idx].type === 'map' && this.blocks[idx + 1] && this.blocks[idx + 1].type === 'gallery') {
                return 'section group-first';
            }

            if (this.blocks[idx].type === 'gallery' && this.blocks[idx - 1] && this.blocks[idx - 1].type === 'map') {
                return 'section group-last';
            }

            return 'section';
        },
    },
};
</script>

<style scoped>
div#projectNavigator {
    margin-left: 40px;
    position: absolute;
}

.section {
    padding: 0 0 25px 16px;
    position: relative;
}

.section:last-of-type {
    padding: 0 0 0 16px;
}

.section-inner {
    background: #f6f6f6;
    border: 1px solid #ddd;
    border-radius: 15px;
    position: relative;
}

.section::before {
    content: '';
    background: #F5C500;
    width: 2px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -1px;
}

.section.group-first::before {
    content: '';
    transform: scaleY(.5);
    bottom: 0;
    transform-origin: bottom;
}

.section.group-last::before {
    content: '';
    transform: scaleY(1);
    top: 0;
    transform-origin: top;
    height: calc(50% - 16px);
}

.section.group-middle::before {
    background: linear-gradient(
            to bottom,
            #f5c500 0%,
            #f5c500 calc(calc(calc(100% - 25px) / 2) - 15px),
            transparent calc(calc(calc(100% - 25px) / 2) - 15px),
            transparent calc(calc(calc(100% - 25px) / 2) + 17px),
            #f5c500 calc(calc(calc(100% - 25px) / 2) + 17px),
            #f5c500 100%
    );
}

.section.group-first .section-inner::after,
.section.group-middle .section-inner::before,
.section.group-middle .section-inner::after,
.section.group-last .section-inner::after {
    width: 16px;
    height: 16px;
    background: transparent;

    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
}

.section.group-first .section-inner::before,
.section.group-middle .section-inner::before,
.section.group-first .section-inner::after {
    border-top-left-radius: 32px;
    box-shadow: -1px -1px 0 1px #F5C500;
    margin: 1px 0 0 -16px;
}

.section.group-middle .section-inner::after,
.section.group-last .section-inner::after {
    border-bottom-left-radius: 32px;
    box-shadow: -1px 1px 0 1px #F5C500;
    margin: -16px 0 0 -16px;
}

.section.group-first::after,
.section.group-last::after,
.section.group-middle::after {
    content: '';
    position: absolute;
    top: calc(calc(100% - 25px) / 2);
    left: 17px;

    width: 12px;
    height: 12px;
    background: #F5C500;
    border-radius: 12px;
    margin: -6px 0 0 -5px;
}

.section.group-last::after {
    top: 50%;
}
</style>
