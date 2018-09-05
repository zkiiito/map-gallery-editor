import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
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
    },
    actions: {
        loadSlides({ commit }, data) {
            commit('setSlides', data);
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
        fileData: state => JSON.stringify(state.slides),
    },
});
