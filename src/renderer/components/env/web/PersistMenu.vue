<template>
    <div id="persist-menu">
        <BigButton v-if="this.$store.state.user.googleUser === null"
                   @click="login"
                   cssstyle="width: 300px; margin-bottom: 10px"
        >
            <img class="google-logo" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg">
            <span> Sign in with Google</span>
        </BigButton>
        <br>
        <BigButton :class="`${this.$store.state.user.googleUser === null ? 'disabled' : ''}`"
                   @click="publishProject"
                   cssstyle="width: 300px"
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
        publishProject() {
            if (this.$store.state.user.googleUser !== null) {
                Controller.publish();
            }
        },
        login() {
            Controller.login();
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

    img.google-logo {
        width: 20px;
        background-color: white;
        border-radius: 25px;
        padding: 5px;
        vertical-align: middle;
    }
</style>
