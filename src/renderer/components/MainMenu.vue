<template>
    <div id="main-menu" @mouseleave="closeMenu">
        <div id="main-menu-rectangle"/>
        <div class="main-menu-list">
            <a href="#" @click="newProject">
                <dl><dt>New</dt><dd>Ctrl + N</dd></dl>
            </a>
            <a href="#" @click="openProject">
                <dl><dt>Open</dt><dd>Ctrl + O</dd></dl>
            </a>
            <a href="#" @click="undo">
                <dl><dt>Undo</dt><dd>Ctrl + Z</dd></dl>
            </a>
        </div>
    </div>
</template>

<script>
import Controller from 'EnvServices/Controller';

export default {
    name: 'MainMenu',
    methods: {
        closeMenu() {
            this.$store.commit('closeMenu', 'main');
        },
        newProject() {
            this.closeMenu();
            Controller.newProject();
        },
        openProject() {
            this.closeMenu();
            Controller.openProjectManager();
        },
        undo() {
            this.closeMenu();
            Controller.undoDeleteSlide();
        },
    },
};
</script>

<style scoped>
#main-menu {
    position: absolute;
    width: 211px;
    left: 160px;
    top: 61px;

    background: #23ABAD;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;

    z-index: 100;
}

#main-menu-rectangle {
    position: absolute;
    width: 13px;
    height: 13px;
    left: 172px;
    top: -6px;

    background: #23ABAD;
    transform: rotate(45deg);

    font-size: 12px;
}

div.main-menu-list {
    color: #ffffff;
    margin: 12px;
    overflow: hidden;
}

dl {
    margin: 0;
}

dt, dd {
    line-height: 28px;
}

dt {
    width: 60%;
    float: left;
}

a {
    color: #ffffff;
}

dd {
    float: right;
    width: 40%;
    opacity: 0.5;
    text-align: right;
    margin: 0;
}
</style>
