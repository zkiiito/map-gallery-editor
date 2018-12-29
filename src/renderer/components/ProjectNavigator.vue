<template>
    <div>
        <div class="block block-map">
            <div class="dot"></div>
            <p class="header">Section 1</p>
            <p>Wien to Salzburg</p>
        </div>
        <div class="block block-gallery">
            <div class="dot"></div>
            <div class="img count">42</div>
            <div class="img"></div>
            <div class="img"></div>
            <div class="img"></div>
            <div class="img"></div>
            <div class="img"></div>
            <br style="clear:both">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProjectNavigator',
};
</script>

<style scoped>
div.block {
    width: 266px; /*  300 - 2 - 32 */
    border-radius: 10px;
    background-color: #f6f6f6;
    border: 1px solid #dddddd;
    font-size: 14px;
    line-height: 20px;
    padding: 16px;
    margin: 8px 0 8px 40px;
    position: relative;
}

div.block p.header {
    color: #b0b0b0;
    margin-bottom: 8px;
}

div.block.block-gallery {
    width: 290px;
    padding: 4px;
    /*overflow: auto;*/
    clear: both;
}

div.block.block-gallery img {
    margin: 4px;
}

div.img {
    margin: 4px;
    background-image: url('https://placeimg.com/150/70/nature?');
    height: 40px;
    width: 40px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    float: left;
    border-radius: 4px;
}

div.img.count {
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #ffffff;
}

div.dot {
    position: absolute;
    width: 9px;
    height: 9px;
    background-color: #f5c500;
    top: 50%;
    left: -5px;
    border-radius: 4px;
}
</style>
