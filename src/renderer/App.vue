<template>
    <div id="app">
        <GoogleAuthPopup v-if="$store.getters.isPopupOpen('auth')"/>
        <GooglePhotosAuthPopup v-if="$store.getters.isPopupOpen('authPhotos')"/>
        <AddImagePopup v-if="$store.getters.isPopupOpen('addImage')"/>
        <FlickrPopup v-if="$store.getters.isPopupOpen('flickr')"/>
        <GooglePhotosPopup v-if="$store.getters.isPopupOpen('googlePhotos')"/>
        <ProjectDataPopup v-if="$store.getters.isPopupOpen('projectData')"/>
        <ProjectManagerPopup v-if="$store.getters.isPopupOpen('projectmanager')"/>
        <SplashPopup v-if="$store.getters.isPopupOpen('splash')"/>
        <ErrorBar/>
        <WindowProgressbar/>

        <div v-if="!$store.state.ui.splashMode" id="main">
            <div id="main-left">
                <div id="main-logo">
                    <img src="static/ui/logo.png" alt="logo">
                    <MainMenuBars v-if="isWeb"/>
                    <MainMenu v-if="$store.getters.isMenuOpen('main')"/>
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
                    <UserMenu v-if="$store.getters.isMenuOpen('user')"/>
                </div>

                <div v-if="$store.state.ui.view === 'image'" id="view-image">
                    <ImageView style="height: 100%"/>
                </div>

                <div v-show="$store.state.ui.view === 'map'" id="view-map">
                    <GoogleMap style="height: 100%"/>
                </div>

                <div v-show="$store.state.ui.view === 'gallery'" id="view-gallery">
                    <p style="text-align: right">
                        <a href="#" @click="sortAllImages"><i class="fas fa-sort-amount-down"/> EXIF sort all</a>
                    </p>
                    <div id="slides">
                        <Draggable
                            id="slideholder"
                            v-model="slides"
                            :class="$store.getters.currentSlideType !== null ? 'small' : 'big'"
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
import GoogleAuthPopup from './components/GoogleAuthPopup';
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
import GooglePhotosPopup from '@/components/GooglePhotosPopup';
import MainMenu from '@/components/MainMenu';
import UserMenu from '@/components/UserMenu';
import MainMenuBars from '@/components/MainMenuBars';
import ProjectManagerPopup from '@/components/ProjectManagerPopup';
import GooglePhotosAuthPopup from '@/components/GooglePhotosAuthPopup';

export default {
    name: 'App',
    components: {
        GooglePhotosAuthPopup,
        ProjectManagerPopup,
        MainMenuBars,
        UserMenu,
        MainMenu,
        GooglePhotosPopup,
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
        GoogleAuthPopup,
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
        isWeb() {
            return process.env.IS_WEB;
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

  input, textarea, .input {
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
