<template>
    <Modal>
        <template slot="header">
            <b>Project Properties</b>
        </template>

        <template slot="body">
            <form>
                <label>
                    Title<br>
                    <input ref="inputTitle" v-model="title" type="text">
                </label>
                <br>
                <label>
                    Description<br>
                    <textarea v-model="description"/>
                </label>
                <br>
                <button type="button" @click="close">Done</button>
            </form>
        </template>
    </Modal>
</template>

<script>
import Modal from './Modal';

export default {
    name: 'ProjectDataPopup',
    components: {
        Modal,
    },
    computed: {
        title: {
            get() {
                return this.$store.state.gallery.title;
            },
            set(value) {
                this.$store.commit('setTitle', value);
            },
        },
        description: {
            get() {
                return this.$store.state.gallery.description;
            },
            set(value) {
                this.$store.commit('setDescription', value);
            },
        },
    },
    mounted() {
        this.$refs.inputTitle.focus();
    },
    methods: {
        close() {
            this.$store.commit('closePopup', 'projectData');
        },
    },
};
</script>

<style scoped>
    form {
        height: 280px;
    }
</style>
