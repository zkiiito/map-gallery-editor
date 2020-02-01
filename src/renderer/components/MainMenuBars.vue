<template>
    <a id="main-menu-btn" class="fas fa-bars" @click="toggleMenu"/>
</template>

<script>
export default {
    name: 'MainMenuBars',
    methods: {
        toggleMenu() {
            this.$store.dispatch('toggleMenu', 'main');
        },
    },
};
</script>

<style scoped>
    #main-menu-btn {
        position: absolute;
        top: 23px;
        left: 329px;
        font-size: 24px;
        cursor: pointer;
    }
</style>
