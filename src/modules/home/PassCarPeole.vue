<template>
  <transition
    name="fade"
    enter-active-class="animated flipInY"
    leave-active-class="animated flipOutY"
  >
    <div class="PassCarPeole pub-border" v-if="visible">
      <div class="PassCarPeole-head">
        <span>{{type=='car'?'车辆道闸':'人行道闸'}}</span>
        <i class="gfl gf-icon-difference btn-close" @click="cancel"></i>
      </div>
      <div class="PassCarPeole-body">
        <template v-if="type=='car'">
          <div class="pass-item" v-for="item in list">
            <div class="img-con">
              <!--<img :src="item.CAR_PHOTO&&item.CAR_PHOTO!=''?item.CAR_PHOTO.replace('http://jiakaiimg.oss-cn-hangzhou.aliyuncs.com/AnXinZhu/car_pass','http://50.147.128.157/deao_xjy/carpass'):''" :onerror="app.noImg">-->
              <img :src="item.CAR_PHOTO&&item.CAR_PHOTO!=''?('http://50.147.128.157/deao_xjy/car_pass/'+item.CAR_PHOTO.replace('C:/inetpub/wwwroot/deao_xjy/car_pass','')):''" :onerror="app.noImg">
            </div>
            <div>
              <span>车主：</span>
              <span>{{item.NAME}}</span>
            </div>
            <div>
              <span>车牌号：</span>
              <span>{{item.CAR_NO}}</span>
            </div>
            <div>
              <span>身份证号：</span>
              <span>{{item.IDCARD}}</span>
            </div>
            <div>
              <span>手机号：</span>
              <span>{{item.PHONE}}</span>
            </div>
            <div>
              <span>是否登记：</span>
              <span>已登记</span>
            </div>
            <div>
              <span>采集时间：</span>
              <span>{{item.PASS_TIME}}</span></div>
          </div>
        </template>
        <template v-if="type=='people'">
          <div class="pass-item" v-for="item in list">
            <div class="img-con">
              <!--<img :src="item.SPOT_PHOTO&&item.SPOT_PHOTO!=''?item.SPOT_PHOTO.replace('http://jiakaiimg.oss-cn-hangzhou.aliyuncs.com/AnXinZhu/car_pass','http://50.147.128.157/deao_xjy/carpass'):''" :onerror="app.noImg">-->
              <img :src="item.SPOT_PHOTO&&item.SPOT_PHOTO!=''?('http://50.147.128.157/deao_xjy/people_pass/'+item.SPOT_PHOTO.replace('C:/inetpub/wwwroot/deao_xjy/people_pass','')):''" :onerror="app.noImg">
            </div>
            <div>
              <span>姓名：</span>
              <span>{{item.NAME}}</span>
            </div>
            <div>
              <span>身份证号：</span>
              <span>{{item.IDCARD}}</span>
            </div>
            <div>
              <span>手机号：</span>
              <span>{{item.PHONE}}</span>
            </div>
            <div>
              <span>是否登记：</span>
              <span>已登记</span>
            </div>
            <div>
              <span>采集时间：</span>
              <span>{{item.PASS_TIME}}</span></div>
          </div>
        </template>
        <template v-if="list.length < 5">
          <div class="pass-item" v-for="item in 5-list.length"></div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PassCarPeole',
  inject: ['app'],
  data () {
    return {
      visible: false,
      list: [],
      type: 'car', //car people
      dsq: '',
    }
  },
  methods: {
    cancel() {
      this.clearDsq();
      this.visible = false;
    },
    clearDsq() {
      if(this.dsq && this.dsq!='') {
        clearInterval(this.dsq);
      }
    },
    show(params) {
      this.type = params.type || 'car'
      this.clearDsq();
      this.list = [];
      this.visible = true;
      this.search();
      this.dsq =  setInterval(() => {
        this.search();
      }, 5000);
    },
    search() {
      this.$service.call(this.$service.url.home[this.type=='car'?'searchPassCar':'searchPassPeople'],{}).then((res) => {
        this.list = res.data;
      });
    },
  },
  mounted() {
    window.showCarPeople = this.show;
  },
}
</script>

<style lang="scss" scoped>
.PassCarPeole {
  position: absolute;
  z-index: 1000;
  width: 80%;
  height: 80%;
  left: 10%;
  top: 10%;
  background-size: 100% 100%;
  color: white;
  .PassCarPeole-head {
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
  .PassCarPeole-body {
    padding: .3em;
    width: 96%;
    margin: 1em auto;
    height: calc(100% - 60px);
    overflow: auto;
    display: grid;
    grid-gap: .5em;
    grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
      .pass-item {
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
