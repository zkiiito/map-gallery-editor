import Vue from 'vue';

const EventBus = new Vue();

EventBus.events = {
    FLICKR_USER_READY: 'flickr_user_ready',
    PROJECT_OPENED: 'project_opened',
    PROJECT_TITLE_CHANGED: 'project_title_changed',
    POPUP_OPENED: 'popup_opened',
    POPUP_CLOSED: 'popup_closed',
};

export default EventBus;
