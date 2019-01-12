<template>
    <div id="projectNavigator">
        <div v-for="(block, idx) in blocks" :key="idx" :class="`${getClass(idx)}`">
            <ProjectNavigatorBlock :block="block" class="section-inner"/>
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
    margin-left: 34px;
}

.section {
    padding: 0 0 16px 8px;
    position: relative;
}

.section:last-of-type {
    padding: 0 0 0 8px;
}

.section-inner {
    position: relative;
}

.section::before {
    content: '';
    background: #F5C500;
    width: 1px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -2px;
}

.section.group-first::before {
    content: '';
    top: unset;
    bottom: 0;
    height: calc(50% + 5px)
}

.section.group-last::before {
    content: '';
    top: 0;
    height: calc(50% - 20px);
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
    width: 8px;
    height: 8px;
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
    border-top-left-radius: 8px;
    box-shadow: -1px -1px 0 0 #F5C500;
    margin: -4px 0 0 -9px;
}

.section.group-middle .section-inner::after,
.section.group-last .section-inner::after {
    border-bottom-left-radius: 8px;
    box-shadow: -1px 1px 0 0 #F5C500;
    margin: -14px 0 0 -9px;
}

.section.group-first::after,
.section.group-last::after,
.section.group-middle::after {
    content: '';
    position: absolute;
    top: calc(calc(100% - 24px) / 2);
    left: 9px;

    width: 9px;
    height: 9px;
    background: #F5C500;
    border-radius: 9px;
    margin: -5px 0 0 -5px;
}

.section.group-last::after {
    /*top: 50%;*/
}
</style>
