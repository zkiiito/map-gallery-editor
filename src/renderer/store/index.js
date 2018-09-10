import Vue from 'vue';
import Vuex from 'vuex';
import ImageProcessor from '../nodeland/ImageProcessor';
const Ajv = require('ajv');
const ajv = new Ajv();
const schema = require('./schema');
const validate = ajv.compile(schema);

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        title: '',
        description: '',
        slides: [],
        currentSlide: null,
    },
    mutations: {
        setSlides(state, slides) {
            state.slides = slides;
            state.currentSlide = null;
        },
        setCurrentSlide(state, slide) {
            state.currentSlide = slide;
        },
        updateOrder(state, ids) {
            state.slides = ids.reduce((newSlides, id) => {
                newSlides.push(state.slides.find(el => el.id === id));
                return newSlides;
            }, []);
        },
        addSlide(state, slide) {
            state.slides.push(slide);
        },
        addSlides(state, slides) {
            state.slides = state.slides.concat(slides);
        },
        moveSlide(state, diff) {
            const slideCount = state.slides.length;

            if (slideCount > 0) {
                if (state.currentSlide === null) {
                    state.currentSlide = state.slides[0]; // eslint-disable-line
                } else {
                    let idx = state.slides.indexOf(state.currentSlide);
                    idx += diff;

                    while (idx < 0) {
                        idx += slideCount;
                    }

                    while (idx >= slideCount) {
                        idx -= slideCount;
                    }

                    state.currentSlide = state.slides[idx];
                }
            }
        },
        deleteCurrentSlide(state) {
            if (state.currentSlide === null) {
                return;
            }

            const idx = state.slides.indexOf(state.currentSlide);
            state.slides.splice(idx, 1);

            if (state.slides.length > 0) {
                state.currentSlide = state.slides[idx > 0 ? (idx - 1) : 0];
            } else {
                state.currentSlide = null;
            }
        },
        orderByExif(state) {
            state.slides.sort((a, b) => {
                if (a.exif_date && b.exif_date) {
                    return a.exif_date.getTime() - b.exif_date.getTime();
                }

                if (a.exif_date) {
                    return 1;
                }

                return -1;
            });
        },
        setTitle(state, title) {
            state.title = title;
        },
        setDescription(state, description) {
            state.description = description;
        },
    },
    actions: {
        loadSlides({ commit }, data) {
            commit('setSlides', data);
        },
        async loadFileData({ commit }, data) {
            const valid = validate(data);
            if (!valid) {
                throw new Error('invalid file');
            }

            let slides = data.slides.map((slide) => {
                if (slide.exif_date) {
                    slide.exif_date = new Date(slide.exif_date);
                }

                if (slide.modified_at) {
                    slide.modified_at = new Date(slide.modified_at);
                }

                return slide;
            });

            slides = await ImageProcessor.updateSlides(slides);

            commit('setTitle', data.title);
            commit('setDescription', data.description);
            commit('setSlides', slides);
        },
    },
    getters: {
        currentSlideType: (state) => {
            if (state.currentSlide === null) {
                return null;
            }

            if (Object.prototype.hasOwnProperty.call(state.currentSlide, 'from')) {
                return 'map';
            }

            return 'image';
        },
        fileData: state => JSON.stringify({
            title: state.title,
            description: state.description,
            slides: state.slides,
        }),
    },
});
