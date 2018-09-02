<template>
    <div class="googleMap">
        <webview src="static/webview.html" ref="webview"/>
    </div>
</template>

<script>
export default {
    name: 'GoogleMap',
    computed: {
        currentSlide() {
            return this.$store.state.currentSlide;
        },
    },
    mounted() {
        const that = this;

        this.$refs.webview.addEventListener('did-stop-loading', function webviewLoaded() {
            that.$refs.webview.removeEventListener('did-stop-loading', webviewLoaded);
            that.$bus.$on('map-showroute', () => {
                that.$refs.webview.executeJavaScript(`MapAnimator.showRoute(` + JSON.stringify(that.currentSlide) + `, (err) => {
                    console.log('map-error', err);
                });`);
            });
        });
    },
    watch: {
        currentSlide(newSlide, oldSlide) {
            if (!oldSlide || !newSlide || newSlide.id !== oldSlide.id) {
                this.$refs.webview.executeJavaScript(`MapAnimator.stopAnimation();`);
                if (newSlide && newSlide.from) {
                    this.$refs.webview.executeJavaScript(`MapAnimator.showRoute(` + JSON.stringify(newSlide) + `, (err) => {
                        console.log('map-error', err);
                    });`);
                }
            }
        },
    },
};
</script>

<style scoped>
webview {
    height: 100%;
}
</style>
