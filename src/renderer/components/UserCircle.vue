<template>
    <div id="user-circle">
        <a v-if="this.$store.state.user.googleUser === null" href="#" title="Log in" @click="login">
            <i class="fas fa-user"/>
        </a>
        <a v-if="this.$store.state.user.googleUser !== null"
           href="#"
           @click="toggleMenu"
        >
            <img :src="this.$store.state.user.googleUser.photoURL" alt="profile">
        </a>
    </div>
</template>

<script>
import Controller from 'EnvServices/Controller';

export default {
    name: 'UserCircle',
    methods: {
        toggleMenu() {
            this.$store.dispatch('toggleMenu', 'user');
        },
        login() {
            Controller.login();
        },
    },
};
</script>

<style scoped>
div#user-circle {
    position: absolute;
    top: 24px;
    right: 24px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background-color: #23abad;
    color: #f6f6f6;
    text-align: center;
    line-height: 40px;
    font-size: 30px;
    border: 4px solid #23abad;
    overflow: hidden;
    z-index: 10;
}

a {
    color: #f6f6f6;
}

a:hover {
    color: #ffffff;
}

img {
    width: 32px;
}
</style>
