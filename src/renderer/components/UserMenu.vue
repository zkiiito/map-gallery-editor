<template>
    <div id="user-menu" @mouseleave="closeMenu">
        <div id="user-menu-rectangle"/>

        <span class="name"><strong>{{ this.$store.state.user.googleUser.displayName }}</strong></span><br>
        <span class="email">{{ this.$store.state.user.googleUser.email }}</span><br>
        <BigButton class="big-button" cssclass="small empty" @click="disconnectGooglePhotos">Disconnect from Google Photos</BigButton><br>
        <BigButton v-if="this.$store.state.user.flickrUser !== null" class="big-button" cssclass="small empty" @click="disconnectFlickr">Disconnect from flickr</BigButton>
        <hr>
        <BigButton class="big-button" cssclass="small empty" @click="logout">Sign out</BigButton>
    </div>
</template>

<script>
import Controller from 'EnvServices/Controller';
import BigButton from '@/components/BigButton';
import store from '@/store';
export default {
    name: 'UserMenu',
    components: { BigButton },
    methods: {
        disconnectGooglePhotos() {

        },
        disconnectFlickr() {
            store.commit('setFlickrUser', null);
        },
        logout() {
            Controller.logout();
        },
        closeMenu() {
            store.commit('closeMenu', 'user');
        },
    },
};
</script>

<style scoped>
#user-menu {
    position: absolute;
    width: 240px;
    right: 20px;
    top: 78px;

    background: #FFFFFF;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;

    z-index: 100;

    padding: 10px 0;
    text-align: center;
}

#user-menu-rectangle {
    position: absolute;
    width: 13px;
    height: 13px;
    right: 20px;
    top: -6px;

    background: #FFFFFF;
    transform: rotate(45deg);
}

.big-button.small {
    width: 90%;
    margin-top: 5px;
}

</style>
