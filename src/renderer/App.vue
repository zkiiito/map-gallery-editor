<template>
  <div id="app">
    <FileMenu/>
    <div id="editor" v-show="$store.getters.currentSlideType === 'map'">
      <GoogleMap></GoogleMap>
      <GoogleMapForm></GoogleMapForm>
    </div>
    <div id="imageviewer" v-show="$store.getters.currentSlideType === 'image'">
      <imageView/>
    </div>
    <div id="slides">
      <draggable :options="{group: 'slides', draggable: '.draggable'}" v-model="slides" id="slideholder"
                 v-bind:class="$store.getters.currentSlideType !== null ? 'small' : 'big'">
        <SlidePreview v-for="slide in slides" :key="slide.id" v-bind:slide="slide" class="draggable"/>
        <div class="slide-small" v-on:click="addMapSlide">
          Add map slide
        </div>
        <div class="slide-small">
          <label>Add images
            <input type="file" multiple id="addImages" style="display: none" v-on:change="addImages" accept="image/*">
          </label>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import GoogleMap from './components/GoogleMap.vue';
import GoogleMapForm from './components/GoogleMapForm.vue';
import ImageView from './components/ImageView.vue';
import SlidePreview from './components/SlidePreview.vue';
import FileMenu from './components/FileMenu.vue';

import ImageProcessor from './nodeland/ImageProcessor.js';

export default {
    name: 'app',
    components: {
        GoogleMap, GoogleMapForm, ImageView, SlidePreview, draggable, FileMenu
    },
    computed: {
        slides: {
            get() {
                return this.$store.state.slides;
            },
            set(value) {
                this.$store.commit('updateOrder', value.map(el => el.id));
            },
        },
    },
    methods: {
        addMapSlide() {
            this.$store.commit('addSlide', {
                id: Math.random(),
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
            });
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

  body,
  button,
  input,
  select,
  textarea {
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }

  .slide-small {
    width: 150px;
    height: 120px;
    margin: 10px;
    float: left;
    cursor: grab;
  }

  .slide-small .imgholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .slide-small img {
    max-height: 120px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.75);
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

  .imageview {
    flex-grow: 1;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .googleMap {
    flex-grow: 1;
  }
</style>
