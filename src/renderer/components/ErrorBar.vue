<template>
    <div>
        <p v-for="(error, idx) in errors" :key="idx">{{ error ? error.toString() : 'Error' }}</p>
    </div>
</template>

<script>
export default {
    name: 'ErrorBar',
    data() {
        return {
            errors: [],
        };
    },
    mounted() {
        this.$bus.$on('error', (err) => {
            this.errors.push(err);
        });

        this.$bus.$on('clearErrors', () => {
            this.errors = [];
        });
    },
};
</script>

<style scoped>
div {
    color: #ffffff;
    background-color: #ff0000;
    width: 100%;
}
</style>
