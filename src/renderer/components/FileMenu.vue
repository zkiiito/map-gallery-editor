<template>
    <div>
        <button v-on:click="newProject">New</button>
        <button v-on:click="openProject">Open</button>
        <button v-on:click="saveProject">Save</button>
        <button v-on:click="saveProjectAs">SaveAs</button>
        <input type="text" v-bind:value="fileName" readonly size="50"/>
        <button v-on:click="orderExif">EXIF sort</button>
        <button v-on:click="prevSlide">&lt;</button>
        <button v-on:click="nextSlide">&gt;</button>
        <button v-on:click="closeSlide" v-show="this.$store.state.gallery.currentSlide">close slide</button>
        <button v-on:click="deleteSlide" v-show="this.$store.state.gallery.currentSlide">delete slide</button>
        <button v-on:click="login" v-show="this.$store.state.gallery.user === null">login</button>
        <button v-on:click="logout" v-if="this.$store.state.gallery.user !== null">logout: {{ username }}</button>
        <button v-on:click="publish" v-show="this.$store.state.gallery.user !== null">publish</button>
        <button v-on:click="exportProject">Export to disk</button>
    </div>
</template>

<script>
    import AppServer from '../services/AppServer';
    import ProjectHandler from '../services/ProjectHandler';
    const { Menu, MenuItem, dialog } = require('electron').remote; // eslint-disable-line

    export default {
        name: 'FileMenu',
        data() {
            return {
                fileName: '',
            };
        },
        computed: {
            username() {
                return this.$store.state.gallery.user ? this.$store.state.gallery.user.displayName : '';
            },
        },
        methods: {
            newProject() {
                this.$store.dispatch('resetProject', []);
                this.fileName = '';
                this.$bus.$emit('clearErrors');
            },
            openProject() {
                dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [{ name: 'MapGallery Editor files', extensions: ['mapgallery'] }],
                }, (filename) => {
                    if (filename) {
                        this.fileName = filename.toString();
                        ProjectHandler.openProject(this.fileName)
                            .catch((err) => {
                                this.fileName = '';
                                this.$bus.$emit('error', err);
                            });
                    }
                });
            },
            saveProject() {
                if (this.fileName === '') {
                    this.saveProjectAs();
                    return;
                }

                ProjectHandler.saveProject(this.fileName)
                    .catch((err) => {
                        this.fileName = '';
                        this.$bus.$emit('error', err);
                    });
            },
            saveProjectAs() {
                dialog.showSaveDialog({
                    filters: [{ name: 'MapGallery Editor files', extensions: ['mapgallery'] }],
                }, (fileName) => {
                    if (fileName) {
                        this.fileName = fileName.toString();
                        this.saveProject();
                    }
                });
            },
            prevSlide() {
                this.$store.commit('moveSlide', -1);
            },
            nextSlide() {
                this.$store.commit('moveSlide', 1);
            },
            closeSlide() {
                this.$store.commit('setCurrentSlide', null);
            },
            deleteSlide() {
                this.$store.commit('deleteCurrentSlide');
            },
            orderExif() {
                this.$store.commit('orderByExif');
            },
            exportProject() {
                dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] }, (dir) => {
                    if (dir) {
                        ProjectHandler.exportProject(dir.toString())
                            .catch((err) => {
                                this.$bus.$emit('error', err);
                            });
                    }
                });
            },
            logout() {
                AppServer.logout();
            },
            publish() {
                ProjectHandler.publishProject()
                    .then((url) => {
                        this.$bus.$emit('error', `project url: ${url}`);
                    })
                    .catch((err) => {
                        this.$bus.$emit('error', err);
                    });
            },
            login() {
                this.$store.commit('openPopup', 'auth');
            },
        },
    };
</script>

<style scoped>

</style>
