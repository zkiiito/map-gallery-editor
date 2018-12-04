<template>
    <div>
        <button @click="addMapSlide">add Map</button>
        <button v-show="this.$store.state.gallery.user === null" @click="login">login</button>
        <button v-if="this.$store.state.gallery.user !== null" @click="logout">logout: {{ username }}</button>
    </div>
</template>

<script>
import Controller from '../services/Controller';

export default {
    name: 'FileMenu',
    computed: {
        username() {
            return this.$store.state.gallery.user ? this.$store.state.gallery.user.displayName : '';
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
    },
};
</script>

<style scoped>

</style>
