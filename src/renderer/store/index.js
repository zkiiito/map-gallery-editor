import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { v4 as uuidv4 } from 'uuid';
import EventBus from '../services/EventBus';

Vue.use(Vuex);

function exifCompare(a, b) {
    if (a.exif_date && b.exif_date) {
        return a.exif_date.getTime() - b.exif_date.getTime();
    }

    return a.exif_date ? 1 : -1;
}

export default new Vuex.Store({
    modules: {
        gallery: {
            state: {
                id: uuidv4(),
                title: '',
                description: '',
                slides: [],
                currentSlide: null,
                user: null,
                deletedSlide: null,
                deletedSlideIdx: null,
                addAfterSlide: null,
                slideMapFormOpen: false,
            },
            mutations: {
                setSlides(state, slides) {
                    state.slides = slides;
                    state.currentSlide = null;
                },
                setCurrentSlide(state, slide) {
                    state.currentSlide = slide;
                    state.slideMapFormOpen = false;
                    EventBus.$emit(EventBus.events.CURRENT_SLIDE_CHANGED, slide);
                },
                updateOrder(state, ids) {
                    state.slides = ids.reduce((newSlides, id) => {
                        newSlides.push(state.slides.find((el) => el.id === id));
                        return newSlides;
                    }, []);
                },
                addSlide(state, slide) {
                    state.slides.push(slide);
                },
                addSlideAfterCurrent(state, slide) {
                    if (state.currentSlide) {
                        const index = state.slides.findIndex((slide) => slide === state.currentSlide);
                        state.slides.splice(index + 1, 0, slide);
                    } else {
                        state.slides.push(slide);
                    }
                },
                addSlides(state, slides) {
                    if (state.addAfterSlide) {
                        const idx = state.slides.indexOf(state.addAfterSlide);
                        state.slides.splice(idx + 1, 0, ...slides);
                        state.addAfterSlide = null;
                    } else {
                        state.slides = state.slides.concat(slides);
                    }
                },
                moveSlide(state, diff) {
                    const slideCount = state.slides.length;

                    if (slideCount > 0) {
                        if (state.currentSlide === null) {
                            // eslint-disable-next-line prefer-destructuring
                            state.currentSlide = state.slides[0];
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
                            EventBus.$emit(EventBus.events.CURRENT_SLIDE_CHANGED, state.currentSlide);
                        }
                    }
                },
                updateCurrentSlide(state, newValues) {
                    if (state.currentSlide === null) {
                        return;
                    }

                    Object.keys(newValues).forEach((key) => {
                        state.currentSlide[key] = newValues[key];
                    });
                },
                updateSlide(state, obj) {
                    const idx = state.slides.indexOf(obj.slide);

                    Object.keys(obj.newValues).forEach((key) => {
                        state.slides[idx][key] = obj.newValues[key];
                    });
                },
                deleteSlide(state, slide) {
                    if (!slide) {
                        return;
                    }

                    const idx = state.slides.indexOf(slide);
                    state.slides.splice(idx, 1);

                    if (slide === state.currentSlide) {
                        if (state.slides.length > 0) {
                            state.currentSlide = state.slides[idx > 0 ? (idx - 1) : 0];
                        } else {
                            state.currentSlide = null;
                        }
                    }

                    state.deletedSlide = slide;
                    state.deletedSlideIdx = idx;
                    EventBus.$emit(EventBus.events.SLIDE_DELETED);
                },
                undoDeleteSlide(state) {
                    if (!state.deletedSlide) {
                        return;
                    }

                    state.slides.splice(state.deletedSlideIdx, 0, state.deletedSlide);

                    state.deletedSlide = null;
                    state.deletedSlideIdx = null;
                    EventBus.$emit(EventBus.events.SLIDE_DELETED_UNDO);
                },
                orderByExif(state) {
                    state.slides.sort(exifCompare);
                },
                orderByExifAfter(state, prevSlide) {
                    const startIdx = state.slides.indexOf(prevSlide) + 1;
                    let endIdx = state.slides.findIndex((slide, idx) => slide.from && idx > startIdx);

                    if (endIdx === -1) {
                        endIdx = state.slides.length;
                    }

                    const slidesToSort = state.slides.slice(startIdx, endIdx);

                    slidesToSort.sort(exifCompare);

                    state.slides.splice(startIdx, endIdx - startIdx, ...slidesToSort);
                },
                setTitle(state, title) {
                    state.title = title;
                    EventBus.$emit(EventBus.events.PROJECT_TITLE_CHANGED, title);
                },
                setDescription(state, description) {
                    state.description = description;
                },
                setId(state, id) {
                    state.id = id || uuidv4();
                },
                setAddAfterSlide(state, slide) {
                    state.addAfterSlide = slide;
                },
                setSlideMapFormOpen(state, open) {
                    state.slideMapFormOpen = open;
                },
            },
            actions: {
                resetProject({ commit }) {
                    commit('setId', null);
                    commit('setTitle', '');
                    commit('setDescription', '');
                    commit('setSlides', []);
                },
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
                fileData: (state) => ({
                    id: state.id,
                    title: state.title,
                    description: state.description,
                    slides: state.slides,
                }),
            },
        },
        ui: {
            state: {
                popups: [],
                menus: [],
                splashMode: true,
                returnToSplash: false,
                view: 'map', // map, gallery, image
                filename: null,
            },
            mutations: {
                openPopup(state, popup) {
                    state.popups.push(popup);
                    EventBus.$emit(EventBus.events.POPUP_OPENED, popup);
                },
                closePopup(state, popup) {
                    state.popups = state.popups.filter((openpopup) => popup !== openpopup);
                    EventBus.$emit(EventBus.events.POPUP_CLOSED, popup, state.popups.length);
                },
                closePopups(state) {
                    state.popups.forEach((popup) => {
                        EventBus.$emit(EventBus.events.POPUP_CLOSED, popup, 0);
                    });
                    state.popups = [];
                },
                setFilename(state, filename) {
                    state.filename = filename;
                    EventBus.$emit('filename', filename);
                },
                setSplashMode(state, splashMode) {
                    state.splashMode = splashMode;
                },
                setReturnToSplash(state, returnToSplash) {
                    state.returnToSplash = returnToSplash;
                },
                setView(state, view) {
                    state.view = view;
                },
                openMenu(state, popup) {
                    state.menus.push(popup);
                },
                closeMenu(state, menu) {
                    state.menus = state.menus.filter((openmenu) => menu !== openmenu);
                },
                closeMenus(state) {
                    state.menus = [];
                },
            },
            getters: {
                isPopupOpen: (state) => ((popup) => state.popups.indexOf(popup) >= 0),
                isMenuOpen: (state) => ((menu) => state.menus.indexOf(menu) >= 0),
            },
            actions: {
                toggleMenu({ commit, state }, menu) {
                    if (state.menus.indexOf(menu) > -1) {
                        commit('closeMenu', menu);
                    } else {
                        commit('openMenu', menu);
                    }
                },
            },
        },
        user: {
            state: {
                googleUser: null,
                flickrUser: null,
            },
            mutations: {
                setGoogleUser(state, user) {
                    state.googleUser = user;
                },
                setFlickrUser(state, user) {
                    state.flickrUser = user;
                },
            },
        },
        app: {
            state: {
                projectHistory: [],
                currentProject: {},
            },
            mutations: {
                setFilename(state, filename) {
                    if (filename) {
                        const idx = state.projectHistory.findIndex((project) => project.filename === filename);
                        if (idx > -1) {
                            state.projectHistory.splice(idx, 1);
                        }

                        if (state.currentProject.filename) {
                            state.currentProject = {
                                filename,
                            };
                        } else {
                            state.currentProject.filename = filename;
                        }

                        state.projectHistory.push(state.currentProject);
                    } else {
                        state.currentProject = {};
                    }
                },
                setTitle(state, title) {
                    state.currentProject.title = title;
                },
                setDescription(state, description) {
                    state.currentProject.description = description;
                },
                setHistory(state, projects) {
                    projects = projects.map((project) => {
                        project.filename = project.id;
                        return project;
                    });
                    state.projectHistory = projects;
                },
            },
        },
    },
    plugins: [createPersistedState({
        key: 'MapGalleryEditor',
        paths: [
            'app.projectHistory',
            'user.flickrUser',
        ],
    })],
});
