<template>
    <button :class="cssclass" :style="cssstyle" @click="$emit('click')" type="button">
        <slot/>
    </button>
</template>

<script>
export default {
    name: 'BigButton',
    props: {
        type: {
            type: String,
            default: 'full',
        },
        cssclass: {
            type: String,
            default: '',
        },
        cssstyle: {
            type: String,
            default: '',
        },
    },
};
</script>

<style scoped>
    button {
        width: 156px;
        height: 52px;
        border-radius: 10px;
        font-size: 22px;
        border-width: 2px;
        border-style: solid;
        cursor: pointer;
        color: #ffffff;
        border-color: #23abad;
        background-color: #23abad;
    }

    button.empty, button.link {
        background-color: transparent;
        color: #23abad;
    }

    button.link, button.link:hover {
        border-color: rgba(0, 0, 0, 0);
    }

    button.empty:hover, button.link:hover {
        background-color: transparent;
        color: #1d8c8e;
    }

    button.empty.disabled:hover, button.link.disabled:hover {
        background-color: transparent;
        color: #b0b0b0;
    }

    button.empty:hover {
        border-color: #1d8c8e;
    }

    button.empty.disabled:hover {
        border-color: #b0b0b0;
    }

    button.small {
        width: 75px;
        height: 36px;
        border-radius: 5px;
        font-size: 14px;
        border-width: 1px;
    }

    button.huge {
        width: 300px;
        height: 120px;
        font-size: 22px;
        padding: 15px;
    }

    button.disabled, button.disabled:hover {
        background-color: #b0b0b0;
        border-color: #b0b0b0;
        cursor: not-allowed;
        box-shadow: none;
    }

    button:hover {
        box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.25);
        background-color: #1d8c8e;
        border-color: #1d8c8e;
    }

    button:focus {
        outline: none;
    }
</style>
