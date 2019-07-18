<template>
    <Transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div :style="style" class="modal-container">
                    <div class="modal-header">
                        <slot name="header"/>
                    </div>

                    <div class="modal-body">
                        <slot name="body"/>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer"/>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        width: {
            type: Number,
            default: 500,
        },
        padding: {
            type: Number,
            default: 40,
        },
    },
    computed: {
        style() {
            return `width: ${this.width - 2 * this.padding}px; padding: ${this.padding}px`;
        },
    },
};
</script>

<style scoped>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        width: 420px;
        margin: 0 auto;
        padding: 40px;
        overflow: auto;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 11px 3px rgba(0, 0, 0, 0.5);
        transition: all .3s ease;
    }

    .modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {
        /* margin: 2px 0; */
    }

    .modal-default-button {
        float: right;
    }

    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
