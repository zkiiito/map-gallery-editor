<template>
    <Modal width="650" padding="0">
        <template slot="body">
            <div id="splash-welcome">
                <h1>MapGallery</h1>
                <h3>version 0.1.0</h3>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
                <div class="button-holder">
                    <BigButton label="New trip" @click="newProject"/>
                </div>
            </div>
            <div id="splash-history">
                <h2>Recent trips</h2>

                <div class="trip-history">
                    <h5>Trip title</h5>
                    <p>Lorem ipsum dolor sit amet</p>
                </div>
                <div class="trip-history">
                    <h5>Trip title</h5>
                    <p>Lorem ipsum dolor sit amet</p>
                </div>
                <div class="trip-history">
                    <h5>Trip title</h5>
                    <p>Lorem ipsum dolor sit amet</p>
                </div>
                <div class="trip-history">
                    <h5>Trip title</h5>
                    <p>Lorem ipsum dolor sit amet</p>
                </div>

                <div class="button-holder">
                    <a href="#" @click="openProject">Open other trip</a>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import Modal from './Modal';
import BigButton from './BigButton';
import Controller from '../services/Controller';

export default {
    name: 'SplashPopup',
    components: {
        BigButton,
        Modal,
    },
    methods: {
        openProject() {
            Controller.openProject();
        },
        newProject() {
            this.close();
            Controller.openProjectData(true);
        },
        close() {
            this.$store.commit('closePopup', 'splash');
        },
    },
};
</script>

<style scoped>
div#splash-welcome, div#splash-history {
    height: 500px;
    padding: 40px 0 0 34px;
    position: relative;
}

div#splash-welcome {
    float: left;
    width: 52%;
    padding-right: 20px;
}

div#splash-welcome h1 {
    font-size: 22px;
    font-weight: 300;
    margin-bottom: 0;
}

div#splash-welcome h3 {
    font-size: 14px;
    color: #b0b0b0;
    margin-top: 0;
    font-weight: normal;
}

.button-holder {
    position: absolute;
    bottom: 34px;
}

div#splash-history {
    float: right;
    width: 36%;
    background-color: #f6f6f6;
    border-left: 1px solid #dddddd;
    padding-left: 20px;
}

div#splash-history h2 {
    font-size: 18px;
    color: #000000;
}

div.trip-history h5 {
    margin-top: 0;
    margin-bottom: 4px;
    font-size: 16px;
    font-weight: normal;
}

div.trip-history p {
    font-size: 12px;
    color: #b0b0b0;
}

div.trip-history {
    cursor: pointer;
    padding: 15px 20px;
    margin-left: -20px;
}
div.trip-history:hover {
    background-color: #eeeeee;
}

</style>