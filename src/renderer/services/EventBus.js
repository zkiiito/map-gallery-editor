import Vue from 'vue';

const EventBus = new Vue();

EventBus.events = {
    FLICKR_USER_READY: 'flickr_user_ready',
};

export default EventBus;
