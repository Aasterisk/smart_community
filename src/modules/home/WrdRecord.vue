<template>
  <transition
    name="fade"
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
  <div class="WrdRecord pub-border" v-if="visible">
    <div class="WrdRecord-head">
      <span>微热点</span>
      <i class="gfl gf-icon-difference btn-close" @click="cancel"></i>
    </div>
    <div class="WrdRecord-body">

      <div class="WrdRecord-con">
        <div class="WrdRecord-item animated fadeInDownBig">
          <div>IMSI</div>
          <div>采集时间</div>
        </div>
        <div v-for="item in list" class="WrdRecord-item animated fadeInDownBig" :key="item.PID">
          <div>{{item.IMSI}}</div>
          <div>{{item.CREATE_TIME}}</div>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'ZxjqModal',
  inject: ['app'],
  data () {
    return {
      visible: false,
      pid: '',
      dsq: '',
      list: [],
    }
  },
  methods: {
    clearDsq() {
      if(this.dsq && this.dsq!='') {
        clearInterval(this.dsq);
      }
    },
    cancel() {
      this.visible = false
    },
    show(pid) {
      this.pid = pid;
      this.visible = true;
      this.search();
      this.dsq = setInterval(() => {
        this.search();
      }, 5000);
    },
    search() {
      this.$service.call(this.$service.url.home.searchWrdRecord,{pid: this.pid}).then((res) => {
        this.list = res.data;
      });
    },
  },
  mounted() {
    window.showWrdRecord = this.show
  },
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.WrdRecord {
  position: absolute;
  z-index: 600;
  width: 600px;
  height: 480px;
  top: 10%;
  left: calc(50% - 300px);
  background: rgba(1,1,1,.8);
  box-shadow: 0 0 15px #00efff, 0 0 15px #00efff inset;
  border-radius: .5em;
  color: white;
  .WrdRecord-head {
    text-align: left;
    font-weight: bold;
    font-size: 15px;
    padding: .5em;
    border-bottom: 1px solid #008a81;
    .btn-close {
      position: absolute;
      right: 1em;
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
  }
  .WrdRecord-body {
    height: calc(100% - 60px);
    padding: 1em;
    overflow: auto;
    .WrdRecord-con {
      width: 100%;
      .WrdRecord-item {
        width: 100%;
        border-bottom: 1px solid rgba(74, 74, 74, 0.6);
        > div {
          display: inline-block;
          width: 48%;
          text-align: center;
          padding: .6em 1em;
        }
        &:nth-child(1) {
          text-shadow: 0.2rem 0rem 0.5rem black, -0.2rem 0rem 0.5rem #b78a8a, 0rem 0.2rem 0.5rem #985656, 0rem -0.2rem 0.5rem #c16161;
          color: orange;
        }
        &:hover {
          box-shadow: 0 0 5px #081c1d, 0 0 5px #00efff inset;
          text-shadow: 0.2rem 0rem 0.5rem black, -0.2rem 0rem 0.5rem #b78a8a, 0rem 0.2rem 0.5rem #985656, 0rem -0.2rem 0.5rem #c16161;
          color: orange;
        }
      }
    }
  }
}
</style>
