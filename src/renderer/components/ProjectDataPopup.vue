<template>
    <Modal>
        <template slot="body">
            <form ref="project-data-form">
                <p>
                    <label>
                        Title<br>
                        <input ref="inputTitle" v-model.lazy="title" type="text" required>
                    </label>
                </p>
                <p>
                    <label>
                        Description<br>
                        <textarea v-model.lazy="description"/>
                    </label>
                </p>
                <p align="right">
                    <BigButton v-if="$store.state.ui.splashMode" cssclass="link" @click="returnToSplash">
                        Back
                    </BigButton>
                    <BigButton @click="close">{{ closeLabel }}</BigButton>
                </p>
            </form>
        </template>
    </Modal>
</template>

<script>
import Modal from './Modal';
import BigButton from './BigButton';

export default {
    name: 'ProjectDataPopup',
    components: {
        BigButton,
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
        closeLabel() {
            return this.$store.state.ui.splashMode ? 'Create' : 'Save';
        },
    },
    mounted() {
        this.$refs.inputTitle.focus();
    },
    methods: {
        close() {
            if (this.$refs['project-data-form'].reportValidity()) {
                this.$store.commit('setSplashMode', false);
                this.$store.commit('closePopup', 'projectData');
            }
        },
        returnToSplash() {
            this.$store.commit('closePopup', 'projectData');
            this.$store.commit('openPopup', 'splash');
        },
    },
};
</script>

<style scoped>
    label {
        font-size: 18px;
        color: #9c9c9c;
    }

    input, textarea {
        width: 388px;
        height: 40px;
        border-radius: 5px;
        background-color: #f6f6f6;
        color: #404041;
        line-height: 1.2;
        font-size: 20px;
        border: 0 none;
        padding: 8px 16px;
    }

    textarea {
        height: 190px;
    }
</style>
