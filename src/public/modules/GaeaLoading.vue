<template>
  <div v-if="app.loadingVisible" class="gaea-module-loading gaea-module-con">
    <div class="gaea-module-loading-body">
      <div class="gaea-module-loading-context">
        <div class="loading-item"></div>
        <div class="loading-item"></div>
        <div class="loading-item"></div>
        <div class="loading-item"></div>
        <div class="loading-item"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'gaea-module-loading',
    autoRegister: true,
    inject: ['app'],
    data() {
      return {
      }
    },
    methods: {
      cancel() {
        this.app.loadingVisible = false;
      },
    },
  }
</script>
<style lang="scss" scoped>
  .gaea-module-loading {
    z-index: 9999999;
    .gaea-module-loading-body {
      position: absolute;
      width: auto;
      height: auto;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: transparent;
      background-clip: padding-box;
      .gaea-module-loading-context {
        width: 100%;
        height: auto;
        border: none;
        padding: 1em 0;
        display: flex;
        justify-content: space-between;
        .loading-item {
          width: 8px;
          height: 16px;
          background: #00BCD4;
          animation: loading-item-anni linear 2s infinite;
          margin: 0 1em;
          border-radius: .3em;
        }
        .loading-item:nth-child(1){
          animation-delay:0s;
        }
        .loading-item:nth-child(2){
          animation-delay:0.3s;
        }
        .loading-item:nth-child(3){
          animation-delay:0.6s;
        }
        .loading-item:nth-child(4){
          animation-delay:0.9s;
        }
        .loading-item:nth-child(5){
          animation-delay:1.2s;
        }

      }
    }
    @keyframes loading-item-anni
    {
      0%,60%,100% {transform: scale(1);}
      30% {transform: scaleY(3);}
    }
    @-webkit-keyframes demo2
    {
      0%,60%,100% {transform: scale(1);}
      30% {transform: scaleY(3);}
    }
  }
</style>
