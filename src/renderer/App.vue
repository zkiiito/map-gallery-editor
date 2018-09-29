<template>
  <div id="app">
    <Auth v-show="$store.getters.isPopupOpen('auth')"/>
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
          <label for="addImages">+ add images</label>
          <input type="file" multiple id="addImages" style="display: none" v-on:change="addImages" accept="image/*">
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
import Auth from './components/Auth';

import ImageProcessor from './services/ImageProcessor.js';
const uuidv4 = require('uuid/v4');

export default {
    name: 'app',
    components: {
        GoogleMap, GoogleMapForm, ImageView, SlidePreview, draggable, FileMenu, ErrorBar, Auth,
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
            this.$store.commit('addSlide', {
                id: uuidv4(),
                from: 'Budapest',
                to: 'Vienna',
                speed: 5000,
                mode: 'DRIVING',
            });
        },
        addImages(event) {
            const files = Array.from(event.target.files);

            ImageProcessor.processNewImages(files).then((slides) => {
                this.$store.commit('addSlides', slides);
            }).catch((err) => {
                this.$bus.$emit('error', err);
            });
        },
    },
    mounted() {
        document.getElementById('slides').addEventListener('wheel', (evt) => {
            if (evt.currentTarget.className.indexOf('small')) {
                evt.currentTarget.scrollLeft += evt.deltaY;
            }
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
