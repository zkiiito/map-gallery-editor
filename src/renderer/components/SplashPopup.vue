<template>
    <Modal :width="650" :padding="0">
        <template slot="body">
            <div id="splash-welcome">
                <h1>MapGallery</h1>
                <h3>version {{ version }}</h3>
                <p>
                    MapGallery is a smart lightweight tool to present your trips to your friends or colleagues.
                    Show your journey in the map and upload images. You can publish it online, and start
                    the presentation. Easy peasy!
                </p>
                <div v-if="newVersion && newVersion !== version" class="upgrade-holder">
                    <strong>Version {{ newVersion }} available!</strong>
                    <BigButton cssstyle="width: 300px">
                        <a :href="newVersionUrl" class="download">Upgrade now</a>
                    </BigButton>
                </div>
                <div class="button-holder">
                    <BigButton @click="newProject">New Trip</BigButton>
                </div>
            </div>
            <div id="splash-history">
                <h2>Recent trips</h2>

                <div v-for="(project, idx) in $store.state.app.projectHistory.slice(-6).reverse()"
                     :key="idx" class="trip-history" @click="openRecentProject(project)"
                >
                    <h5>{{ project.title }}</h5>
                    <p>{{ project.description || project.filename }}</p>
                </div>

                <div class="button-holder">
                    <a href="#" @click="openProject">Open other trip</a>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import Controller from 'EnvServices/Controller';
import Modal from './Modal';
import BigButton from './BigButton';

export default {
    name: 'SplashPopup',
    components: {
        BigButton,
        Modal,
    },
    data() {
        return {
            version: process.app.version,
            newVersion: null,
            newVersionUrl: null,
        };
    },
    mounted() {
        this.getLatestVersion();
    },
    methods: {
        openProject() {
            Controller.openProject().then(() => {
                this.close();
            }).catch(() => {});
        },
        newProject() {
            this.$store.commit('closePopup', 'splash');
            Controller.openProjectData();
        },
        close() {
            this.$store.commit('closePopup', 'splash');
            this.$store.commit('setSplashMode', false);
        },
        openRecentProject(projectHistory) {
            Controller.openProjectFile(projectHistory.filename);
            this.close();
        },
        getLatestVersion() {
            if (process.env.IS_WEB) {
                return;
            }

            const n = navigator;
            const osMatch = n.platform.match(/(Win|Mac|Linux)/);
            const os = (osMatch && osMatch[1]) || '';

            fetch('https://api.github.com/repos/zkiiito/map-gallery-editor/releases')
                .then((res) => res.json())
                .then((res) => {
                    const release = res[0];
                    release.assets.forEach((asset) => {
                        const ext = asset.name.split('.').pop();
                        if (
                            (ext === 'exe' && os === 'Win')
                            || (ext === 'dmg' && os === 'Mac')
                            || (ext === 'AppImage' && os === 'Linux')
                        ) {
                            this.newVersionUrl = asset.browser_download_url;
                            this.newVersion = release.tag_name;
                        }
                    });
                });
        },
    },
};
</script>

<style scoped>
div#splash-welcome, div#splash-history {
    height: 500px;
    padding: 40px 0 0 34px;
    position: relative;
    overflow: hidden;
}

div#splash-welcome {
    float: left;
    width: 52%;
    padding-right: 20px;
}

div#splash-welcome h1 {
    font-size: 22px;
    font-weight: 300;
    margin-bottom: 0;
}

div#splash-welcome h3 {
    font-size: 14px;
    color: #b0b0b0;
    margin-top: 0;
    font-weight: normal;
}

.button-holder {
    position: absolute;
    bottom: 34px;
}

.upgrade-holder {
    position: absolute;
    bottom: 200px;
}

div#splash-history {
    float: right;
    width: 36%;
    background-color: #f6f6f6;
    border-left: 1px solid #dddddd;
    padding-left: 20px;
    overflow-y: auto;
}

div#splash-history h2 {
    font-size: 18px;
    color: #000000;
}

div.trip-history h5 {
    margin-top: 0;
    margin-bottom: 4px;
    font-size: 16px;
    font-weight: normal;
}

div.trip-history p {
    font-size: 12px;
    color: #b0b0b0;
}

div.trip-history {
    cursor: pointer;
    padding: 15px 20px;
    margin-left: -20px;
    overflow: hidden;
}
div.trip-history:hover {
    background-color: #eeeeee;
}

a.download {
    color: #ffffff;
    display: block;
}
</style>
