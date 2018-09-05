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
        <button v-on:click="closeSlide" v-show="this.$store.state.currentSlide">X</button>
        <input type="text" v-model="googleMapsApiKey" placeholder="google maps api key"/>
    </div>
</template>

<script>
    import ImageProcessor from '../nodeland/ImageProcessor.js';
    const { Menu, MenuItem, dialog } = require('electron').remote; // eslint-disable-line
    const fs = require('fs');
    const fse = require('fs-extra');
    const path = require('path');
    const SettingsStore = require('electron-store');
    const settingsStore = new SettingsStore();

    export default {
        name: 'FileMenu',
        data() {
            return {
                fileName: '',
            };
        },
        computed: {
            googleMapsApiKey: {
                get() {
                    return settingsStore.get('googleMapsApiKey');
                },
                set(value) {
                    settingsStore.set('googleMapsApiKey', value);
                },
            },
        },
        methods: {
            newProject() {
                this.$store.dispatch('loadSlides', []);
                this.fileName = '';
            },
            openProject() {
                dialog.showOpenDialog({
                    properties: ['openFile'],
                    // filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
                }, (filename) => {
                    this.fileName = filename.toString();
                    fs.readFile(this.fileName, 'utf-8', (err, data) => {
                        if (err) {
                            return this.$bus.$emit('error', err);
                        }

                        let parsedData = '';

                        try {
                            parsedData = JSON.parse(data);
                        } catch (err) {
                            return this.$bus.$emit('error', err);
                        }

                        // todo: verify, update thumbnails
                        parsedData = parsedData.map((slide) => {
                            if (slide.exif_date) {
                                slide.exif_date = new Date(slide.exif_date);
                            }

                            if (slide.modified_at) {
                                slide.modified_at = new Date(slide.modified_at);
                            }

                            return slide;
                        });

                        this.$store.dispatch('loadSlides', parsedData);
                    });
                });
            },
            saveProject() {
                if (this.fileName === '') {
                    this.saveProjectAs();
                    return;
                }

                fs.writeFile(this.fileName, this.$store.getters.fileData, (err) => {
                    this.$bus.$emit('file-error', err);
                });
            },
            saveProjectAs() {
                dialog.showSaveDialog((fileName) => {
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
            orderExif() {
                this.$store.commit('orderByExif');
            },
            exportProject() {
                dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] }, (dir) => {
                    if (dir) {
                        ImageProcessor.exportSlides(this.$store.state.slides, dir.toString())
                            .then(() => fse.copy(path.join(__dirname, '../../../static/MapGallery'), dir.toString()))
                            .then(() => {
                                const data = this.$store.state.slides.map((slide) => {
                                    if (slide.from) {
                                        return slide;
                                    }
                                    return `export_${slide.id}_${slide.filename}`;
                                });

                                return fse.outputFile(path.join(dir.toString(), 'scripts', 'demo.js'), `MapGallery.initialize(${JSON.stringify(data)});`);
                            }).catch((err) => {
                                this.$bus.$emit('error', err);
                            });
                    }
                });
            },
        },
    };
</script>

<style scoped>

</style>
