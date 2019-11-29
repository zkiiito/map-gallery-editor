<template>
    <div class="spinner">
        <div class="disc disc--red"/>
        <div class="disc disc--blue"/>
    </div>
</template>

<script>
export default {
    name: 'FlickrLoader',
};
</script>

<style scoped>
    @keyframes side-to-side {
        0% {
            margin-left:0;
            z-index:0;
        }
        50% {
            margin-left:-20px;
        }
        100% {
            margin-left:0px;
            z-index:1;
        }
    }


    .spinner {
        width:40px;
        height:20px;
        margin:90px auto;
    }

    .disc{
        display:inline-block;
        width:20px;
        height:20px;
        position:absolute;
        border-radius:50%;
    }
    .disc--red{
        background:#FE0087;
        -webkit-animation-name: side-to-side;
        -webkit-animation-duration: 1000ms;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-timing-function: ease-in-out;
        animation-name: side-to-side;
        animation-duration: 800ms;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        animation-delay: -2000ms;

    }
    .disc--blue{
        background:#0062DD;
        -webkit-animation-name: side-to-side-to-side;
        -webkit-animation-duration: 1000ms;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-timing-function: ease-in-out;
        animation-name: side-to-side;
        animation-duration: 800ms;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;

    }
</style>
