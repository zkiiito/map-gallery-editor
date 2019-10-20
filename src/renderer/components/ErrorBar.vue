<template>
    <div id="errorHolder">
        <div v-for="(error, idx) in errors" :key="idx" class="error">
            {{ error ? error.toString() : 'Error' }}
            <a @click="closeError(idx)" href="#" class="close fas fa-times"/>
        </div>
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
            const that = this;
            this.errors.push(err);

            setTimeout(() => {
                const idx = this.errors.indexOf(err);
                that.errors.splice(idx, 1);
            }, 5000);
        });

        this.$bus.$on('clearErrors', () => {
            this.errors = [];
        });
    },
    methods: {
        closeError(idx) {
            this.errors.splice(idx, 1);
        },
    },
};
</script>

<style scoped>
div#errorHolder {
    position: absolute;
    left: 412px;
    top: 24px;
}

div.error {
    position: relative;
    color: #ffffff;
    background-color: #ff0000;
    width: 226px;
    height: 43px;
    border-radius: 10px;
    line-height: 43px;
    text-align: center;
    margin-bottom: 20px;
    z-index: 10;
}

a.close {
    position: absolute;
    right: 5px;
    top: 5px;
    color: #ffffff;
}
</style>
