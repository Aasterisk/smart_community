<template>
  <div id="app">
    <router-view/>
    <gaea-module-loading></gaea-module-loading>
  </div>
</template>

<script>
    import GaeaModuleLoading from "./public/modules/GaeaLoading";

    export default {
  name: 'App',
  components: {GaeaModuleLoading},
  provide() {
    return {
      app: this
    }
  },
  data () {
      return {
        loadingVisible: false,
        noImg: 'this.src="' + require('../static/images/no-img.svg') + '"',
      }
  },
  methods: {
    openLoad() {
     this.loadingVisible = true;
    },
    closeLoad() {
      this.loadingVisible = false;
    },
  }
}
</script>

<style lang="scss">
@import "./public/css/public.css";
html,body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: tencentFont !important;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  min-width: 1400px;
  min-height: 800px;
}
.cqdd-div{
  width: 140px;
  height: 30px;
  font-size: 16px;
  background-color: #436ef0;
  color: white;
  border: none;
}
</style>
