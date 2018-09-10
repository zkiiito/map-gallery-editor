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
        this.$refs.webview.setAttribute('preload', `file://${__static}/webview-preload.js`);

        this.$refs.webview.addEventListener('did-stop-loading', function webviewLoaded() {
            that.$refs.webview.removeEventListener('did-stop-loading', webviewLoaded);
            that.$bus.$on('map-showroute', () => {
                that.$refs.webview.executeJavaScript(`showRoute(${JSON.stringify(that.currentSlide)});`);
            });
        });

        this.$refs.webview.addEventListener('ipc-message', (msg) => {
            this.$bus.$emit('map-error', msg.channel);
        });
    },
    watch: {
        currentSlide(newSlide, oldSlide) {
            if (!oldSlide || !newSlide || newSlide.id !== oldSlide.id) {
                this.$refs.webview.executeJavaScript('MapAnimator.stopAnimation();');
                if (newSlide && newSlide.from) {
                    this.$refs.webview.executeJavaScript(`showRoute(${JSON.stringify(newSlide)});`);
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
