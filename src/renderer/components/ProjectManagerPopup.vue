<template>
    <Modal>
        <template slot="header">
            <h2>Your trips</h2>
            <a href="#" class="close fas fa-times" @click="close"/>
        </template>

        <template slot="body">
            <div class="blocks">
                <ProjectManagerBlock
                    v-for="(project, idx) in $store.state.app.projectHistory.slice(0).reverse()"
                    :key="idx"
                    :project="project"
                />
            </div>
        </template>
    </Modal>
</template>

<script>
import Modal from '@/components/Modal';
import ProjectManagerBlock from '@/components/ProjectManagerBlock';

export default {
    name: 'ProjectManagerPopup',
    components: { ProjectManagerBlock, Modal },
    beforeDestroy() {
        this.$bus.$off(this.$bus.events.MODAL_CLOSE, this.close);
    },
    mounted() {
        this.$bus.$on(this.$bus.events.MODAL_CLOSE, this.close);
    },
    methods: {
        close() {
            this.$store.commit('closePopup', 'projectmanager');
        },
    },
};
</script>

<style scoped>
    a.close {
        float: right;
    }

    h2 {
        float: left;
        margin-top: 0;
    }

    div.blocks {
        height: 500px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
</style>
