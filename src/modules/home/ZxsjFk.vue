<template>
  <transition
    name="fade"
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
  <div class="ZxsjFk" v-if="visible">
    <div class="ZxsjFk-head">
      <span>反馈</span>
      <i class="gfl gf-icon-difference btn-close" @click="cancel"></i>
    </div>
    <div class="ZxsjFk-body">
      <table>
        <tr>
          <td>上报人：</td><td>{{item.SBR}}</td>
        </tr>
        <tr>
          <td>电话：</td><td>{{item.DH}}</td>
        </tr>
        <tr>
          <td>上报时间：</td><td>{{item.SBSJ}}</td>
        </tr>
        <tr>
          <td>类别：</td><td>{{item.LB}}</td>
        </tr>
        <tr>
          <td>地点：</td><td>{{item.ADDRESS}}</td>
        </tr>
        <tr>
          <td>内容：</td><td>{{item.CONTENT}}</td>
        </tr>
      </table>
      <Input v-model="params.content" :maxlength="300" show-word-limit style="width: 100%" type="textarea" :autosize="{maxRows: 4,minRows: 4}" :rows="4" placeholder="反馈内容"/>
      <div style="text-align: right;margin-top: 1em">
        <div style="display: inline-block;padding:.3em 1em;border-radius: .3em;color:white;background:#09c7da" @click="feedback">反馈</div>
      </div>
      <div class="ZxsjFk-record">
        <div>
          记录
        </div>
        <table>
          <tr>
            <td>时间</td>
            <td>反馈内容</td>
          </tr>
          <tr v-for="item in list">
            <td>{{item.CREATE_TIME}}</td>
            <td>{{item.CONTENT}}</td>
          </tr>
          <tr v-if="list.length<1">
            <td colspan="2" style="color: red">暂无数据</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'ZxsjFk',
  inject: ['app'],
  data () {
    return {
      visible: false,
      params: {
        content: '',
      },
      list: [],
      pid: '',
      item: {},
    }
  },
  methods: {
    cancel() {
      this.visible = false
    },
    resetClear() {
      for(var p in this.params) {
        this.params[p] = '';
      }
    },
    feedback() {
      var p = {
        content: this.params.content,
        pid: this.pid
      }
      if(this.params.content=='') {
        this.$Notice.warning({
          title: '提示',
          desc: '请输入反馈内容！',
          duration: 3
        });
        return;
      }
      this.$service.call(this.$service.url.home.saveWgsjFk,p).then((res) => {
        this.resetClear();
        this.searchList();
      });
    },
    searchList() {
      this.$service.call(this.$service.url.home.searchWgsjFk,{pid: this.pid}).then((res) => {
        this.list = res.data;
      });
    },
    show(item) {
      this.item = item;
      this.pid = item.PID;
      this.visible = true;
      this.searchList();

    },
  },
  mounted() {
    window.showZxsjFk = this.show
  },
}
</script>
<style lang="scss">
.ZxsjFk {
  .ivu-input {
    background: rgba(2, 56, 53, 0.6) !important;
    color: white;
  }
}
</style>
<style lang="scss" scoped>
.ZxsjFk {
  position: absolute;
  z-index: 600;
  width: 600px;
  height: 600px;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(1,1,1,.8);
  box-shadow: 0 0 15px #00efff, 0 0 15px #00efff inset;
  border-radius: .5em;
  color: white;
  .ZxsjFk-head {
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
  .ZxsjFk-body {
    height: calc(100% - 60px);
    overflow: auto;
    padding: 1em;
    > table {
      width: 100%;
      td {
        padding: .5em 1em;
        &:nth-child(1) {
          text-align: right;
          color: white;
          white-space: nowrap;
          width: 8em;
        }
        &:nth-child(2) {
          text-align: left;
          color: #00DFFF;
          text-shadow: 0.2rem 0rem 0.5rem black, -0.2rem 0rem 0.5rem #b78a8a, 0rem 0.2rem 0.5rem #985656, 0rem -0.2rem 0.5rem #c16161;
        }
      }
    }
    .ZxsjFk-record {
      table {
        width: 100%;
        border-collapse: collapse;
        td {
          padding: .3em .5em;
          border: 1px solid #a7a7a7;
        }
      }
    }
  }
}
</style>
