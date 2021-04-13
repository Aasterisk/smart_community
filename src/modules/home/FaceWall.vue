<template>
  <transition
    name="fade"
    enter-active-class="animated flipInY"
    leave-active-class="animated flipOutY"
  >
    <div class="FaceWall pub-border" v-if="visible">
      <div class="FaceWall-head">
        <span>人像识别</span>
        <i class="gfl gf-icon-difference btn-close" @click="cancel"></i>
      </div>
      <div class="FaceWall-body">
          <div class="face-item" v-for="item in list">
            <div class="img-con">
              <img :src="item.IMAGEURL" :onerror="app.noImg">
            </div>
            <div>
              <span>姓名：</span>
              <span>{{item.PERSON_NAME}}</span>
            </div>
            <div>
              <span>性别：</span>
              <span>{{item.GENDER=='1'?'男':'女'}}</span>
            </div>
            <div>
              <span>身份证号：</span>
              <span>{{item.PERSON_ID}}</span>
            </div>
            <div>
              <span>出生年份：</span>
              <span>{{item.BORNYEAR}}</span>
            </div>
            <div>
              <span>相似度：</span>
              <span>{{item.SIMILARITY}}</span>
            </div>
            <div>
              <span>是否登记：</span>
              <!--<span>{{item.IDCARD&&item.IDCARD!=''?'已登记':'未登记'}}</span>-->
              <span>已登记</span>
            </div>

            <div>
              <span>采集时间：</span>
              <span>{{dateFormat(new Date(item.TIMESTAMP*1000))}}</span></div>
          </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'FaceWall',
  inject: ['app'],
  data () {
    return {
      visible: false,
      list: [],
    }
  },
  methods: {
    dateFormat (date,fmt){
      if (!fmt) {
        fmt = "yyyy-MM-dd HH:mm:ss";
      }
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    cancel() {
      this.visible = false;
    },
    show(pid) {
      this.visible = true;
      this.pid = pid;
      this.search();
    },
    search() {
      var params = {pageSize: 100};
      //params.pid = this.pid;
      this.$service.call(this.$service.url.home.searchFace,params).then((res) => {
        this.list = res.data;
      });
    },
  },
  mounted() {
      window.showFace = this.show;
  },
}
</script>

<style lang="scss" scoped>
.FaceWall {
  position: absolute;
  z-index: 1000;
  width: 80%;
  height: 80%;
  left: 10%;
  top: 10%;
  background-size: 100% 100%;
  color: white;
  .FaceWall-head {
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
  .FaceWall-body {
    padding: .3em;
    width: 96%;
    margin: 1em auto;
    height: calc(100% - 60px);
    overflow: auto;
    display: grid;
    grid-gap: .5em;
    grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
      .face-item {
        padding: .5em;
        .img-con {
          width: 180px;
          height: 140px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        > div {
          text-align: left;
        }
      }
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

  }
}
</style>
