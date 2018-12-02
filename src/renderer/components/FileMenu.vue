<template>
    <div>
        <button v-on:click="addMapSlide">add Map</button>
        <button v-on:click="login" v-show="this.$store.state.gallery.user === null">login</button>
        <button v-on:click="logout" v-if="this.$store.state.gallery.user !== null">logout: {{ username }}</button>
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
