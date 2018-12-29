<template>
    <div id="app">
        <AuthPopup v-if="$store.getters.isPopupOpen('auth')"/>
        <FlickrPopup v-if="$store.getters.isPopupOpen('flickr')"/>
        <ProjectDataPopup v-if="$store.getters.isPopupOpen('projectData')"/>
        <SplashPopup v-if="$store.getters.isPopupOpen('splash')"/>
        <vue-progress-bar/>
        <ErrorBar/>
        <!--FileMenu/-->

        <div id="main">
            <div id="main-left">
                <div id="main-logo">
                    <img src="static/logo.png" alt="logo">
                </div>
                <div id="main-title">
                    <h1>Weekend in Austria</h1>
                    <h2>Salzburg, Wien, Linz and other adventures</h2>
                </div>

                <label @click="addMapSlide">+ add map slide</label><br>
                <label id="addImages" @click="addImages">+ add images</label>
            </div>

            <div id="main-right">
                <ViewSwitch/>

                <div v-show="$store.state.ui.view === 'map'" id="view-map">
                    <GoogleMap style="height: 100%"/>
                    <!--GoogleMapForm/-->
                </div>

                <div v-show="$store.state.ui.view === 'gallery'" id="view-gallery">
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
import GoogleMapForm from './components/GoogleMapForm.vue';
import ImageView from './components/ImageView.vue';
import SlidePreview from './components/SlidePreview.vue';
import FileMenu from './components/FileMenu.vue';
import ErrorBar from './components/ErrorBar';
import AuthPopup from './components/AuthPopup';
import FlickrPopup from './components/FlickrPopup';
import ProjectDataPopup from './components/ProjectDataPopup';
import SplashPopup from './components/SplashPopup';
import ViewSwitch from './components/ViewSwitch';
import Controller from './services/Controller';

export default {
    name: 'App',
    components: {
        GoogleMap,
        GoogleMapForm,
        ImageView,
        SlidePreview,
        Draggable,
        FileMenu,
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

        // Controller.openSplash();
    },
    methods: {
        addMapSlide() {
            Controller.addMapSlide();
        },
        addImages() {
            Controller.addImages();
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

  body,
  button,
  input,
  select,
  textarea {
    font-family: 'Roboto', sans-serif;
    color: #404041;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  #main {
      height: 100%;
      display: flex;
      flex-direction: row;
  }

  #main-left {
      height: 100%;
      width: 380px;
      flex-shrink: 0;
  }

  #main-logo {
      padding: 20px 40px;
      border-bottom: 1px solid #f6f6f6;
      margin-bottom: 30px;
  }

  #main-title {
      border-left: 8px solid #f5c500;
      padding: 10px 32px;
  }

  #main-title h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 400;
      margin-bottom: 5px;
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
  }

  #view-map {
      height: 100%;
  }

  #view-gallery {
      margin-top: 100px;
  }
</style>
