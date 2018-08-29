<template>
    <div>
        <button v-on:click="newProject">New</button>
        <button v-on:click="openProject">Open</button>
        <button v-on:click="saveProject">Save</button>
        <button v-on:click="saveProjectAs">SaveAs</button>
        <input type="text" v-bind:value="fileName" readonly size="100"/>
    </div>
</template>

<script>
    const { Menu, MenuItem, dialog } = require('electron').remote;
    const fs = require('fs');

    export default {
        name: 'FileMenu',
        data: function () {
            return {
                fileName: '',
            };
        },
        methods: {
            newProject() {
                this.$store.dispatch('loadSlides', []);
                this.fileName = '';
            },
            openProject() {
                dialog.showOpenDialog({ properties: ['openFile'] }, (filename) => {
                    this.fileName = filename.toString();
                    fs.readFile(this.fileName, 'utf-8', (err, data) => {
                        const parsedData = JSON.parse(data);
                        // todo: verify, update thumbnails
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
        },
    };
</script>

<style scoped>

</style>
