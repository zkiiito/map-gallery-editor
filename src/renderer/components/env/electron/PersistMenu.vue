<template>
    <div id="persist-menu">
        <a href="#" @click="exportProject"><i class="fas fa-download"/>Offline export</a>
        <a href="#" @click="saveProject"><i class="fas fa-save"/>Save</a>
        <br>
        <BigButton :class="`${this.$store.state.user.googleUser === null ? 'disabled' : ''}`"
                   cssstyle="width: 300px"
                   @click="publishProject"
        >
            <i class="fas fa-cloud-upload-alt"/>Publish
        </BigButton>
    </div>
</template>

<script>
import Controller from 'EnvServices/Controller';
import BigButton from '../../BigButton';

export default {
    name: 'PersistMenu',
    components: {
        BigButton,
    },
    methods: {
        exportProject() {
            Controller.exportProject();
        },
        saveProject() {
            Controller.saveProject();
        },
        publishProject() {
            if (this.$store.state.user.googleUser !== null) {
                Controller.publish();
            }
        },
    },
};
</script>

<style scoped>
    #persist-menu {
        padding: 24px 40px;
        background-color: #f6f6f6;
        border-top: 1px solid #dddddd;
        margin-top: 30px;
    }

    #persist-menu a {
        display: block;
        float: left;
        font-size: 22px;
        margin-bottom: 24px;
    }

    #persist-menu a i {
        margin-right: 4px;
    }

    #persist-menu a:nth-of-type(1) {
        margin-right: 45px;
        margin-left: 10px;
    }
</style>
