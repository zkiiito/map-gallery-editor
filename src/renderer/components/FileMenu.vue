<template>
    <div>
        <button @click="addMapSlide">add Map</button>
        <button v-show="this.$store.state.user.googleUser === null" @click="login">login</button>
        <button v-if="this.$store.state.user.googleUser !== null" @click="logout">logout: {{ username }}</button>
        <button @click="openFlickrPopup">Flickr</button>
    </div>
</template>

<script>
import Controller from '../services/Controller';

export default {
    name: 'FileMenu',
    computed: {
        username() {
            return this.$store.state.user.googleUser ? this.$store.state.user.googleUser.displayName : '';
        },
    },
    methods: {
        addMapSlide() {
            Controller.addMapSlide();
        },
        logout() {
            Controller.logout();
        },
        login() {
            Controller.login();
        },
        openFlickrPopup() {
            Controller.openFlickr();
        },
    },
};
</script>

<style scoped>

</style>
