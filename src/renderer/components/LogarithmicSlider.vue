<template>
    <input v-model="realValue" class="input" type="range" :min="minpos" :max="maxpos">
</template>

<script>
// https://stackoverflow.com/questions/846221/logarithmic-slider

export default {
    name: 'LogarithmicSlider',
    props: {
        value: {
            type: Number,
        },
        minpos: {
            default: 1,
            type: Number,
        },
        maxpos: {
            default: 100,
            type: Number,
        },
        minval: {
            default: Math.log(1000),
            type: Number,
        },
        maxval: {
            default: Math.log(10000000),
            type: Number,
        },
    },
    computed: {
        scale() {
            // calculate adjustment factor
            return (this.maxval - this.minval) / (this.maxpos - this.minpos);
        },
        realValue: {
            get() {
                const position = parseInt(this.value, 10);
                return ((Math.log(position) - this.minval) / this.scale) + this.minpos;
            },
            set(value) {
                const position = parseInt(value, 10);
                const v = Math.exp(this.minval + (this.scale * (position - this.minpos)));
                this.$emit('input', v);
            },
        },
    },
};
</script>

<style scoped>

</style>
