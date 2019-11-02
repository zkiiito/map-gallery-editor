<template>
    <div/>
</template>

<script>
export default {
    name: 'WindowProgressbar',
    mounted() {
        if (!process.env.IS_WEB) {
            this.$bus.$on('progress', (percent) => {
                const currentWindow = this.$electron.remote.getCurrentWindow();
                currentWindow.setProgressBar(percent / 100);

                if (percent === 100) {
                    setTimeout(() => {
                        currentWindow.setProgressBar(-1);
                    }, 500);
                }
            });

            this.$bus.$on('error', () => {
                const currentWindow = this.$electron.remote.getCurrentWindow();
                currentWindow.setProgressBar(-1);
            });
        }
    },
};
</script>
