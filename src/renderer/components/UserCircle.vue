<template>
    <div id="user-circle">
        <a v-if="this.$store.state.user.googleUser === null" @click="login" href="#" title="Log in">
            <i class="fas fa-user"/>
        </a>
        <a v-if="this.$store.state.user.googleUser !== null"
           :title="`Log out ${this.$store.state.user.googleUser.email}`"
           @click="logout"
           href="#"
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
        logout() {
            Controller.logout();
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
