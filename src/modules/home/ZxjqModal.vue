<template>
  <transition
    name="fade"
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
  <div class="ZxjqModal pub-border" v-if="visible">
    <div class="ZxjqModal-head">
      <span>详情</span>
      <i class="gfl gf-icon-difference btn-close" @click="cancel"></i>
    </div>
    <div class="ZxjqModal-body">
      <table>
        <tr>
          <td>接警编号：</td><td>{{item.JJBH}}</td>
        </tr>
        <tr>
          <td>事发场所：</td><td>{{item.SFCSMC}}</td>
        </tr>
        <tr>
          <td>街路巷：</td><td>{{item.CJJLXMC}}</td>
        </tr>
        <tr>
          <td>处警详址：</td><td>{{item.CJXZ}}</td>
        </tr>
        <tr>
          <td>处警类型：</td><td>{{item.CJLBMC}}</td>
        </tr>
        <tr>
          <td>处警时间：</td><td>{{item.CJSJ}}</td>
        </tr>
        <tr>
          <td>处警编号：</td><td>{{item.CJBH}}</td>
        </tr>
        <tr>
          <td>出警人：</td><td>{{item.CJRHZXS}}</td>
        </tr>
        <tr>
          <td>出警人联系方式：</td><td>{{item.CJRLXFS}}</td>
        </tr>
        <tr>
          <td>处理结果内容：</td><td>{{item.CLJGNR}}</td>
        </tr>
        <tr>
          <td>登记人：</td><td>{{item.DJRXM}}</td>
        </tr>
        <tr>
          <td>登记单位：</td><td>{{item.DJDWMC}}</td>
        </tr>

      </table>
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
      item: '',
    }
  },
  methods: {
    cancel() {
      this.visible = false
    },
    show(item) {
      this.item = item;
      this.visible = true;
    },
  },
  mounted() {
    window.showZxjqModal = this.show
  },
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.ZxjqModal {
  position: absolute;
  z-index: 600;
  width: 600px;
  height: 500px;
  top: 15%;
  left: calc(50% - 300px);
  background: rgba(1,1,1,.8);
  box-shadow: 0 0 15px #00efff, 0 0 15px #00efff inset;
  border-radius: .5em;
  color: white;
  .ZxjqModal-head {
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
  .ZxjqModal-body {
    height: calc(100% - 60px);
    padding: 1em;
    overflow: auto;
    table {
      width: 100%;
      td {
        padding: .5em 1em;
        &:nth-child(1) {
          text-align: right;
          color: white;
          white-space: nowrap;
        }
        &:nth-child(2) {
          text-align: left;
          color: #00DFFF;
          text-shadow: 0.2rem 0rem 0.5rem black, -0.2rem 0rem 0.5rem #b78a8a, 0rem 0.2rem 0.5rem #985656, 0rem -0.2rem 0.5rem #c16161;
        }
      }
    }
  }
}
</style>
