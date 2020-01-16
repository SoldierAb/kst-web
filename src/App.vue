<template>
  <div class="app-container">
    <Test-page />
    <button @click="toggleSkin('light')">light</button>
    <button @click="toggleSkin('default')">default</button>
  </div>
</template>

<style lang="less">
    .app-container{
      height:100px;
    }
</style>

<script>
import TestPage from './views/TestPage';

export default {
  name: 'App',
  components:{TestPage},
  data() {
    return { };
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    toggleSkin(skin){
      K.toggleSkin(skin);
    },
  },
};
</script>


