<template>
    <div id="toaster" v-show="show">
        <p class="text">Slide deleted</p>
        <a @click="undo" href="#">UNDO</a>
    </div>
</template>

<script>
import Controller from '../services/Controller';

export default {
    name: 'ToasterUndo',
    data() {
        return {
            show: false,
        };
    },
    mounted() {
        const that = this;

        this.$bus.$on(this.$bus.events.SLIDE_DELETED, () => {
            that.show = true;
            setTimeout(() => {
                that.show = false;
            }, 2000);
        });

        this.$bus.$on(this.$bus.events.SLIDE_DELETED_UNDO, () => {
            that.show = false;
        });
    },
    methods: {
        undo() {
            Controller.undoDeleteSlide();
        },
    },
};
</script>

<style scoped>
#toaster {
    position: absolute;
    top: 90%;
    left: 50%;
    width: 368px;
    height: 43px;
    border-radius: 10px;
    box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.25);
    background-color: #313745;
    line-height: 43px;
    padding: 0 16px;
}

p {
    color: #ffffff;
    float: left;
}

a {
    color: #f5c500;
    float: right;
}
</style>
