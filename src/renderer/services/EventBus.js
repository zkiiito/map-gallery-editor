import Vue from 'vue';

const EventBus = new Vue();

EventBus.events = {
    CURRENT_SLIDE_CHANGED: 'current_slide_changed',
    FLICKR_USER_READY: 'flickr_user_ready',
    MAP_DISPLAY_ROUTE: 'map_display_route',
    MAP_ANIMATE_ROUTE: 'map_animate_route',
    PROJECT_OPENED: 'project_opened',
    PROJECT_TITLE_CHANGED: 'project_title_changed',
    POPUP_OPENED: 'popup_opened',
    POPUP_CLOSED: 'popup_closed',
};

export default EventBus;
