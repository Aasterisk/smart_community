<template>
  <transition
    name="fade"
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
  <div class="SjyjModal pub-border" v-if="visible">
    <div class="SjyjModal-head">
      <span style="font-size: 15px;font-weight: bold;color:#D34862;padding-left: 1em" >{{typeCn}}</span>
      <i class="gfl gf-icon-difference btn-close" @click="cancel"></i>
    </div>
    <div class="SjyjModal-body">
      <table class="sjyj-modal-context">
        <template v-if="type=='qzdq'">
          <tr><td>姓名:</td><td>{{item.NAME}}</td></tr>
          <tr><td>签证到期时间:</td><td>{{item.TIME}}</td></tr>
          <tr><td>地址:</td><td>{{item.ADDRESS}}</td></tr>
          <tr><td>签证号:</td><td>M74824227</td></tr>
          <tr><td>企业名称:</td><td>润阳悦达</td></tr>
          <tr><td>紧急联系人:</td><td>仇小芬</td></tr>
          <tr><td>紧急联系人电话:</td><td>15371119323</td></tr>
        </template>
        <template v-if="type=='jzyc'">
          <tr><td>姓名:</td><td>{{item.NAME}}</td></tr>
          <tr><td>最后出现时间:</td><td>{{item.TIME}}</td></tr>
          <tr><td>地址:</td><td>{{item.ADDRESS}}</td></tr>
        </template>
        <template v-if="type=='yswdj'">
          <tr><td>姓名:</td><td>{{item.NAME}}</td></tr>
          <tr><td>最后出现时间:</td><td>{{item.TIME}}</td></tr>
          <tr><td>最后出现地址:</td><td>{{item.ADDRESS}}</td></tr>
          <tr><td>近1周出现次数:</td><td>{{item.XCCS}}</td></tr>
        </template>
        <template v-if="type=='phry'">
          <tr><td>姓名:</td><td>{{item.NAME}}</td></tr>
          <tr><td>出现次数:</td><td>{{item.CXCS}}</td></tr>
          <tr><td>开始时间:</td><td>{{item.KSSJ}}</td></tr>
          <tr><td>结束时间:</td><td>{{item.JSSJ}}</td></tr>
        </template>
        <template v-if="type=='zfyc'">
          <tr><td>姓名:</td><td>{{item.NAME}}</td></tr>
          <tr><td>日期:</td><td>{{item.TIME}}</td></tr>
          <tr><td>频次:</td><td>{{item.PC}}</td></tr>
        </template>
        <template v-if="type=='dzms'">
          <tr><td>姓名:</td><td>{{item.NAME}}</td></tr>
          <tr><td>预警时间:</td><td>{{item.YJSJ}}</td></tr>
          <tr><td>身份证号:</td><td>{{item.SFZ}}</td></tr>
          <tr><td>报警地点:</td><td>{{item.ADDRESS}}</td></tr>
        </template>
        <template v-if="type=='sdq'">
          <tr><td>姓名:</td><td>{{item.NAME}}</td></tr>
          <tr><td>预警时间:</td><td>{{item.YJSJ}}</td></tr>
          <tr><td>身份证号:</td><td>{{item.SFZ}}</td></tr>
          <tr><td>户号:</td><td>{{item.HH}}</td></tr>
        </template>
      </table>
      <Input v-model="params.content" :maxlength="300" show-word-limit style="width: 100%" type="textarea" :autosize="{maxRows: 4,minRows: 4}" :rows="4" placeholder="处理意见"/>
      <div style="text-align: left;margin: .5em 0">
        <Input v-model="params.jsry" placeholder="接收人" style="width: 200px" />
      </div>

      <div style="text-align: right;margin-top: 1em">
        <div style="display: inline-block;padding:.3em 1em;border-radius: .3em;color:white;background:#09c7da" @click="feedback">发送</div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'SjyjModal',
  inject: ['app'],
  data () {
    return {
      visible: false,
      item: '',
      type: '',
      typeCn: '',
      params: {
        content: '',
        jsry: '',
      }
    }
  },
  methods: {
    cancel() {
      this.visible = false
    },
    show(item,type,typeCn) {
      this.params.content='';
      this.params.jsry='';
      this.item = item;
      this.type = type;
      this.typeCn = typeCn;
      this.visible = true;
    },
    feedback() {
      if(this.params.content==''||this.params.jsry=='') {
        this.$Notice.warning({
          title: '提示',
          desc: '处理意见及接收人不能为空！',
          duration: 3
        });
        return;
      }
      this.$Notice.success({
        title: '提示',
        desc: '发送成功',
        duration: 2
      });
      this.cancel();
    },
  },
  mounted() {
    window.showSjyjModal = this.show
  },
}
</script>
<style lang="scss">
.SjyjModal-body {
  .ivu-input {
    background: rgba(2, 56, 53, 0.6) !important;
    color: white;
  }
}
</style>
<style lang="scss" scoped>
.SjyjModal {
  position: absolute;
  z-index: 600;
  width: 600px;
  height: auto;
  top: 15%;
  left: calc(50% - 300px);
  background: rgba(1,1,1,.8);
  box-shadow: 0 0 15px #00efff, 0 0 15px #00efff inset;
  border-radius: .5em;
  color: white;
  .SjyjModal-head {
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
  .SjyjModal-body {
    height: calc(100% - 60px);
    padding: 1em;
    overflow: auto;
    .sjyj-modal-context {

    }
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
