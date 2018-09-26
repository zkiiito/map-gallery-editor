<template>
    <div>
        <button v-on:click="newProject">New</button>
        <button v-on:click="openProject">Open</button>
        <button v-on:click="saveProject">Save</button>
        <button v-on:click="saveProjectAs">SaveAs</button>
        <input type="text" v-bind:value="fileName" readonly size="50"/>
        <button v-on:click="exportProject">Export</button>
        <button v-on:click="orderExif">EXIF</button>
        <button v-on:click="prevSlide">&lt;</button>
        <button v-on:click="nextSlide">&gt;</button>
        <button v-on:click="closeSlide" v-show="this.$store.state.currentSlide">close</button>
        <button v-on:click="deleteSlide" v-show="this.$store.state.currentSlide">delete</button>
        <button v-show="this.$store.state.user === null">login</button>
        <button v-on:click="logout" v-show="this.$store.state.user !== null">logout</button>
    </div>
</template>

<script>
    import AppServer from '../services/AppServer';
    import ImageProcessor from '../services/ImageProcessor.js';
    const { Menu, MenuItem, dialog } = require('electron').remote; // eslint-disable-line
    const fse = require('fs-extra');
    const path = require('path');

    export default {
        name: 'FileMenu',
        data() {
            return {
                fileName: '',
            };
        },
        methods: {
            newProject() {
                this.$store.dispatch('resetProject', []);
                this.fileName = '';
            },
            openProject() {
                dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [{ name: 'MapGallery Editor files', extensions: ['mapgallery'] }],
                }, async (filename) => {
                    this.fileName = filename.toString();

                    try {
                        const data = await fse.readFile(this.fileName, 'utf-8');
                        const parsedData = JSON.parse(data);
                        this.$store.dispatch('loadFileData', parsedData);
                    } catch (err) {
                        this.$bus.$emit('error', err);
                    }
                });
            },
            async saveProject() {
                if (this.fileName === '') {
                    this.saveProjectAs();
                    return;
                }

                try {
                    await fse.writeFile(this.fileName, this.$store.getters.fileData);
                } catch (err) {
                    this.$bus.$emit('file-error', err);
                }
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
                dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] }, async (dir) => {
                    if (dir) {
                        try {
                            await ImageProcessor.exportSlides(this.$store.state.slides, dir.toString());

                            const mapGalleryRoot = process.env.NODE_ENV !== 'development' ? process.resourcesPath : __static;

                            await fse.copy(path.join(mapGalleryRoot, 'MapGallery'), dir.toString());

                            const data = this.$store.state.slides.map((slide) => {
                                if (slide.from) {
                                    return slide;
                                }
                                return `export_${slide.id}_${slide.filename}`;
                            });

                            await fse.outputFile(
                                path.join(dir.toString(), 'scripts', 'demo.js'),
                                `MapGallery.initialize(${JSON.stringify(data)});`,
                            );
                        } catch (err) {
                            this.$bus.$emit('error', err);
                        }
                    }
                });
            },
            logout() {
                AppServer.logout();
            },
        },
    };
</script>

<style scoped>

</style>
