<template>
    <div class="googleMap">
        <webview ref="webview" src="https://mapgallery.online/webview.html?v=0.2.0"
                 httpreferrer="https://editor.mapgallery.online"
        />
    </div>
</template>

<script>
export default {
    name: 'GoogleMap',
    computed: {
        currentSlide() {
            return this.$store.state.gallery.currentSlide;
        },
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
    mounted() {
        const that = this;
        this.$refs.webview.setAttribute('preload', `file://${__static}/webview-preload.js`);

        this.$refs.webview.addEventListener('did-stop-loading', function webviewLoaded() {
            that.$refs.webview.removeEventListener('did-stop-loading', webviewLoaded);
            that.$refs.webview.executeJavaScript('worldViewFit()');
            that.$bus.$on('map-showroute', () => {
                that.$refs.webview.executeJavaScript(`showRoute(${JSON.stringify(that.currentSlide)});`);
            });
            that.$bus.$on(that.$bus.events.PROJECT_OPENED, () => {
                that.$refs.webview.executeJavaScript('worldViewFit()');
            });
        });

        this.$refs.webview.addEventListener('ipc-message', (msg) => {
            this.$bus.$emit('error', msg.channel);
        });
    },
};
</script>

<style scoped>
webview {
    height: 100%;
}
</style>
