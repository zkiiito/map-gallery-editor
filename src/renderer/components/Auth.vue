<template>
    <webview src="https://us-central1-mapgallery-216911.cloudfunctions.net/auth/" httpreferrer="https://editor.mapgallery.online" ref="webview"/>
</template>

<script>
import AppServer from '../services/AppServer';

export default {
    name: 'Auth',
    mounted() {
        this.$refs.webview.setAttribute('preload', `file://${__static}/auth-preload.js`);

        this.$refs.webview.addEventListener('ipc-message', (msg) => {
            AppServer.loginByToken(msg.channel);
        });

        this.$bus.$on('user', (user) => {
            console.log('user', user);
            this.$store.commit('setUser', user);
        });
    },
};
</script>

<style scoped>

</style>
