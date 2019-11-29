<template>
    <div id="app">
        <AuthPopup v-if="$store.getters.isPopupOpen('auth')"/>
        <AddImagePopup v-if="$store.getters.isPopupOpen('addImage')"/>
        <FlickrPopup v-if="$store.getters.isPopupOpen('flickr')"/>
        <ProjectDataPopup v-if="$store.getters.isPopupOpen('projectData')"/>
        <SplashPopup v-if="$store.getters.isPopupOpen('splash')"/>
        <ErrorBar/>
        <WindowProgressbar/>

        <div id="main" v-if="!$store.state.ui.splashMode">
            <div id="main-left">
                <div id="main-logo">
                    <img src="static/ui/logo.png" alt="logo">
                    <vue-progress-bar/>
                </div>

                <div id="main-title" @click="openProjectData">
                    <h1>
                        {{ $store.state.gallery.title.length ? $store.state.gallery.title : 'Unnamed trip' }}
                        ({{ $store.state.gallery.slides.length }})
                    </h1>
                    <h2>{{ $store.state.gallery.description }}</h2>
                </div>

                <ProjectNavigator v-if="$store.state.gallery.slides.length > 0"/>

                <AddButtons/>
                <PersistMenu/>
            </div>

            <div id="main-right">
                <div v-show="$store.state.ui.view !== 'image'">
                    <ViewSwitch/>
                    <UserCircle/>
                </div>

                <div id="view-image" v-if="$store.state.ui.view === 'image'">
                    <ImageView style="height: 100%"/>
                </div>

                <div id="view-map" v-show="$store.state.ui.view === 'map'">
                    <GoogleMap style="height: 100%"/>
                </div>

                <div id="view-gallery" v-show="$store.state.ui.view === 'gallery'">
                    <p align="right">
                        <a @click="sortAllImages" href="#"><i class="fas fa-sort-amount-down"/> EXIF sort all</a>
                    </p>
                    <div id="slides">
                        <Draggable
                            id="slideholder"
                            :class="$store.getters.currentSlideType !== null ? 'small' : 'big'"
                            v-model="slides"
                            group="slides"
                            draggable=".draggable"
                        >
                            <SlidePreview v-for="slide in slides" :key="slide.id" :slide="slide" class="draggable"/>
                        </Draggable>
                    </div>
                </div>

                <ToasterUndo/>
            </div>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import Controller from 'EnvServices/Controller';
import PersistMenu from 'EnvComponents/PersistMenu';
import WindowProgressbar from '@/components/WindowProgressbar';
import GoogleMap from '@/components/GoogleMap.vue';
import SlidePreview from './components/SlidePreview.vue';
import ErrorBar from './components/ErrorBar';
import AuthPopup from './components/AuthPopup';
import FlickrPopup from './components/FlickrPopup';
import ProjectDataPopup from './components/ProjectDataPopup';
import SplashPopup from './components/SplashPopup';
import ViewSwitch from './components/ViewSwitch';
import ProjectNavigator from './components/ProjectNavigator';
import AddButtons from './components/AddButtons';
import UserCircle from './components/UserCircle';
import ImageView from './components/ImageView';
import ToasterUndo from './components/ToasterUndo';
import EventBus from '@/services/EventBus';
import AddImagePopup from '@/components/AddImagePopup';

export default {
    name: 'App',
    components: {
        AddImagePopup,
        ToasterUndo,
        ImageView,
        UserCircle,
        PersistMenu,
        AddButtons,
        ProjectNavigator,
        GoogleMap,
        SlidePreview,
        Draggable,
        ErrorBar,
        AuthPopup,
        FlickrPopup,
        ProjectDataPopup,
        SplashPopup,
        ViewSwitch,
        WindowProgressbar,
    },
    computed: {
        slides: {
            get() {
                return this.$store.state.gallery.slides;
            },
            set(value) {
                this.$store.commit('updateOrder', value.map((el) => el.id));
            },
        },
    },
    mounted() {
        this.$bus.$on('progress', (percent) => {
            if (percent === 0) {
                this.$Progress.start();
                this.$Progress.pause();
            }

            this.$Progress.set(percent);

            if (percent === 100) {
                setTimeout(() => {
                    this.$Progress.finish();
                }, 500);
            }
        });

        this.$bus.$on('error', () => {
            this.$Progress.fail();
        });

        this.$bus.$on(EventBus.events.USER_CHANGED, (user) => {
            this.$store.commit('setGoogleUser', user);
        });

        Controller.init();
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

  a:hover {
      color: #1d8c8e;
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
        display: flex;
        flex-direction: column;
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

    #view-map, #view-image {
        height: 100%;
    }

    #view-gallery {
        margin-top: 100px;
        margin-right: 40px;
    }
</style>
