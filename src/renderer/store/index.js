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
    },
});
