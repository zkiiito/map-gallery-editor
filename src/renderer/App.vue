<template>
    <div id="app">
        <AuthPopup v-if="$store.getters.isPopupOpen('auth')"/>
        <FlickrPopup v-if="$store.getters.isPopupOpen('flickr')"/>
        <ProjectDataPopup v-if="$store.getters.isPopupOpen('projectData')"/>
        <SplashPopup v-if="$store.getters.isPopupOpen('splash')"/>
        <ErrorBar/>
        <!--FileMenu/-->

        <div v-if="!$store.state.ui.splashMode" id="main">
            <div id="main-left">
                <div id="main-logo">
                    <img src="static/ui/logo.png" alt="logo">
                    <vue-progress-bar/>
                </div>

                <div id="main-title" @click="openProjectData">
                    <h1>{{ $store.state.gallery.title.length ? $store.state.gallery.title : 'Unnamed trip' }}</h1>
                    <h2>{{ $store.state.gallery.description }}</h2>
                </div>

                <ProjectNavigator v-if="$store.state.gallery.slides.length > 0"/>

                <AddButtons/>
                <PersistMenu/>
            </div>

            <div id="main-right">
                <ViewSwitch/>

                <div v-show="$store.state.ui.view === 'map'" id="view-map">
                    <GoogleMap style="height: 100%"/>
                </div>

                <div v-show="$store.state.ui.view === 'gallery'" id="view-gallery">
                    <p align="right">
                        <a href="#" @click="sortAllImages"><i class="fas fa-sort-amount-down"/> EXIF sort all</a>
                    </p>
                    <div id="slides">
                        <Draggable
                            id="slideholder"
                            v-model="slides"
                            :options="{group: 'slides', draggable: '.draggable'}"
                            :class="$store.getters.currentSlideType !== null ? 'small' : 'big'"
                        >
                            <SlidePreview v-for="slide in slides" :key="slide.id" :slide="slide" class="draggable"/>
                        </Draggable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import GoogleMap from './components/GoogleMapWebview.vue';
import SlidePreview from './components/SlidePreview.vue';
// import FileMenu from './components/FileMenu.vue';
import ErrorBar from './components/ErrorBar';
import AuthPopup from './components/AuthPopup';
import FlickrPopup from './components/FlickrPopup';
import ProjectDataPopup from './components/ProjectDataPopup';
import SplashPopup from './components/SplashPopup';
import ViewSwitch from './components/ViewSwitch';
import ProjectNavigator from './components/ProjectNavigator';
import Controller from './services/Controller';
import AddButtons from './components/AddButtons';
import PersistMenu from './components/PersistMenu';

export default {
    name: 'App',
    components: {
        PersistMenu,
        AddButtons,
        ProjectNavigator,
        GoogleMap,
        SlidePreview,
        Draggable,
        // FileMenu,
        ErrorBar,
        AuthPopup,
        FlickrPopup,
        ProjectDataPopup,
        SplashPopup,
        ViewSwitch,
    },
    computed: {
        slides: {
            get() {
                return this.$store.state.gallery.slides;
            },
            set(value) {
                this.$store.commit('updateOrder', value.map(el => el.id));
            },
        },
    },
    mounted() {
        this.$bus.$on('progress', (percent) => {
            if (percent === 0) {
                this.$Progress.start();
                this.$Progress.pause();
            }

            const currentWindow = this.$electron.remote.getCurrentWindow();
            currentWindow.setProgressBar(percent / 100);
            this.$Progress.set(percent);

            if (percent === 100) {
                setTimeout(() => {
                    currentWindow.setProgressBar(-1);
                    this.$Progress.finish();
                }, 500);
            }
        });

        this.$bus.$on('error', () => {
            const currentWindow = this.$electron.remote.getCurrentWindow();
            currentWindow.setProgressBar(-1);
            this.$Progress.fail();
        });

        this.$bus.$on('user', (user) => {
            this.$store.commit('setGoogleUser', user);
        });

        Controller.openSplash();
    },
    methods: {
        openProjectData() {
            Controller.openProjectData();
        },
        sortAllImages() {
            Controller.orderExif();
        },
    },
};
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  p {
      margin: 0;
  }

  a {
      text-decoration: none;
      color: #23abad;
  }

  input, textarea {
      border-radius: 5px;
      background-color: #f6f6f6;
      color: #404041;
      line-height: 1.2;
      border: 0 none;
      padding: 8px;
  }

  body,
  button,
  input,
  select,
  textarea {
    font-family: 'Roboto', sans-serif;
    color: #404041;
  }
</style>

<style scoped>
    #app {
        width: 100%;
        height: 100%;
    }

    #main {
        height: 100%;
        display: flex;
        flex-direction: row;
        background-color: #ffffff;
    }

    #main-left {
        height: 100%;
        width: 380px;
        flex-shrink: 0;
        overflow-y: auto;
    }

    #main-logo {
        border-bottom: 1px solid #f6f6f6;
        margin-bottom: 30px;
    }

    #main-logo img {
        padding: 20px 40px;
    }

    #main-title {
        border-left: 8px solid #f5c500;
        padding: 10px 32px;
    }

    #main-title h1 {
        font-size: 24px;
        font-weight: 400;
        margin: 0 0 5px;
    }

    #main-title h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 300;
    }

    #main-right {
        height: 100%;
        background-color: #f6f6f6;
        overflow-y: scroll;
        flex-grow: 1;
        border-left: 1px solid #dddddd;
    }

    #view-map {
        height: 100%;
    }

    #view-gallery {
        margin-top: 100px;
        margin-right: 40px;
    }
</style>
