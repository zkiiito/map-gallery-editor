<template>
    <button :style="style" @click="$emit('click')" type="button">{{ label }}</button>
</template>

<script>
export default {
    name: 'BigButton',
    props: {
        label: {
            type: String,
            default: 'Label',
        },
        type: {
            type: String,
            default: 'full',
        },
        color: {
            type: String,
            default: '#23abad',
        },
    },
    computed: {
        style() {
            let css = `border-color: ${this.color};`;
            if (this.type === 'full') {
                css += `background-color: ${this.color};`;
            } else {
                css += `color: ${this.color};`;
            }

            return css;
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
        background-color: transparent;
        border-width: 2px;
        border-style: solid;
        cursor: pointer;
        color: #ffffff;
    }

    button:hover {
        box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.25);
    }

    button:focus {
        outline: none;
    }
</style>
