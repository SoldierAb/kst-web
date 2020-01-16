<template>
  <div v-show="showPage" class="test-page">TestPage</div>
</template>

<script>
export default {
    data(){
        return {
            showPage:false,
        };
    },
};
</script>

<style lang="less">
    .test-page{
        width:100%;
        height:300px;
    }
</style>