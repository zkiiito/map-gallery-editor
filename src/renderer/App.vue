<template>
  <div id="app">
    <AuthPopup v-if="$store.getters.isPopupOpen('auth')"/>
    <vue-progress-bar></vue-progress-bar>
    <ErrorBar/>
    <FileMenu/>
    <div id="editor" v-show="$store.getters.currentSlideType === 'map'">
      <GoogleMap class="flexgrow"/>
      <GoogleMapForm/>
    </div>
    <div id="imageviewer" v-show="$store.getters.currentSlideType === 'image'">
      <ImageView class="flexgrow"/>
    </div>
    <div id="slides">
      <draggable :options="{group: 'slides', draggable: '.draggable'}" v-model="slides" id="slideholder"
                 v-bind:class="$store.getters.currentSlideType !== null ? 'small' : 'big'">
        <SlidePreview v-for="slide in slides" :key="slide.id" v-bind:slide="slide" class="draggable"/>
        <div class="addSlide">
          <label v-on:click="addMapSlide">+ add map slide</label>
        </div>
        <div class="addSlide">
          <label id="addImages" v-on:click="addImages">+ add images</label>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import GoogleMap from './components/GoogleMapWebview.vue';
import GoogleMapForm from './components/GoogleMapForm.vue';
import ImageView from './components/ImageView.vue';
import SlidePreview from './components/SlidePreview.vue';
import FileMenu from './components/FileMenu.vue';
import ErrorBar from './components/ErrorBar';
import AuthPopup from './components/AuthPopup';
import Controller from './services/Controller';

export default {
    name: 'app',
    components: {
        GoogleMap, GoogleMapForm, ImageView, SlidePreview, draggable, FileMenu, ErrorBar, AuthPopup,
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
    methods: {
        addMapSlide() {
            Controller.addMapSlide();
        },
        addImages() {
            Controller.addImages();
        },
    },
    mounted() {
        document.getElementById('slides').addEventListener('wheel', (evt) => {
            if (evt.currentTarget.className.indexOf('small')) {
                evt.currentTarget.scrollLeft += evt.deltaY;
            }
        });

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
            this.$store.commit('setUser', user);
        });
    },
};
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body,
  button,
  input,
  select,
  textarea {
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #editor, #imageviewer {
    display: flex;
    flex-grow: 1;
  }

  #slides {
    overflow-x: auto;
  }

  #slideholder.big {
    width: 100%;
  }

  #slideholder.small {
    width: 900000px;
  }

  .flexgrow {
    flex-grow: 1;
  }

  .addSlide {
    width: 150px;
    height: 120px;
    margin: 10px;
    float: left;

    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    background-color: aliceblue;
  }

  .addSlide label {
    padding: 4px;
    font-size: 0.8em;
    font-weight: bold;
    background-color: #ffffff;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.75);
    cursor: pointer;
  }
</style>
