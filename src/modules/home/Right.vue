<template>
  <div class="HomeRight animated bounceInRight">
    <div class="home-right-item home-right-sjyj">
      <div class="home-left-item-title">
        事件预警
        <div class="yj-icon">
          <img :src="'/static/images/home/right/icon_yj.svg'">
        </div>
      </div>
      <div class="sjyj-body">
        <vue-seamless-scroll :data="sjyj" class="seamless-warp">
        <div>
          <template v-for="(item) in sjyj">
            <div class="sjyj-item">
              <div class="sjyj-item-icon" @click="showSjyj(item,item.type,sjyjTypes[item.type])">
                <img :src="item.IMG&&item.IMG!=''?item.IMG:'/static/images/home/right/alarm.png'" :onerror="app.noImg">
              </div>
              <div class="sjyj-item-context" @click="showSjyj(item,item.type,sjyjTypes[item.type])">
                <div>{{sjyjTypes[item.type]}}</div>
                <template v-if="item.type=='qzdq'">
                  <div><span>姓名:</span><span>{{item.NAME}}</span></div>
                  <div><span>签证到期时间:</span><span>{{item.TIME}}</span></div>
                  <div><span>地址:</span><span>{{item.ADDRESS}}</span></div>
                </template>
                <template v-if="item.type=='jzyc'">
                  <div><span>姓名:</span><span>{{item.NAME}}</span></div>
                  <div><span>最后出现时间:</span><span>{{item.TIME}}</span></div>
                  <div><span>地址:</span><span>{{item.ADDRESS}}</span></div>
                </template>
                <template v-if="item.type=='yswdj'">
                  <div><span>姓名:</span><span>{{item.NAME}}</span></div>
                  <div><span>最后出现时间:</span><span>{{item.TIME}}</span></div>
                  <div><span>最后出现地址:</span><span>{{item.ADDRESS}}</span></div>
                  <div><span>近1周出现次数:</span><span>{{item.XCCS}}</span></div>
                </template>
                <template v-if="item.type=='phry'">
                  <div><span>姓名:</span><span>{{item.NAME}}</span></div>
                  <div><span>出现次数:</span><span>{{item.CXCS}}</span></div>
                  <div><span>开始时间:</span><span>{{item.KSSJ}}</span></div>
                  <div><span>结束时间:</span><span>{{item.JSSJ}}</span></div>
                </template>
                <template v-if="item.type=='zfyc'">
                  <div><span>姓名:</span><span>{{item.NAME}}</span></div>
                  <div><span>日期:</span><span>{{item.TIME}}</span></div>
                  <div><span>频次:</span><span>{{item.PC}}</span></div>
                </template>
                <template v-if="item.type=='dzms'">
                  <div><span>姓名:</span><span>{{item.NAME}}</span></div>
                  <div><span>预警时间:</span><span>{{item.YJSJ}}</span></div>
                  <div><span>身份证号:</span><span>{{item.SFZ}}</span></div>
                  <div><span>报警地点:</span><span>{{item.ADDRESS}}</span></div>
                </template>
                <template v-if="item.type=='sdq'">
                  <div><span>姓名:</span><span>{{item.NAME}}</span></div>
                  <div><span>预警时间:</span><span>{{item.YJSJ}}</span></div>
                  <div><span>身份证号:</span><span>{{item.SFZ}}</span></div>
                  <div><span>户号:</span><span>{{item.HH}}</span></div>
                </template>
              </div>

            </div>
          </template>
        </div>
        </vue-seamless-scroll>
      </div>
    </div>
    <div class="home-right-item home-right-rycl">
      <div class="home-left-item-title">
        人员/车辆出入
      </div>
      <div class="rycl-title" style="display: inline-flex">
        <div class="rycl-left-title title-bg-normal" :class="{'title-bg-active':ryclType=='ry'}" @click="changeRycl('ry')">人员</div>
        <div class="rycl-right-title title-bg-normal" :class="{'title-bg-active':ryclType=='cl'}" @click="changeRycl('cl')">车辆</div>
      </div>
      <div class="rycl-body">
        <template v-if="ryclType =='cl'">
          <div class="rycl-item animated fadeInDownBig" v-for="(item,index_t) in clList">
            <div class="rycl-item-left">
              <!--<img :src="item.CAR_PHOTO&&item.CAR_PHOTO!=''?item.CAR_PHOTO.replace('http://jiakaiimg.oss-cn-hangzhou.aliyuncs.com/AnXinZhu/car_pass','http://50.147.128.157/deao_xjy/carpass'):''" :onerror="app.noImg">-->
              <img :src="item.CAR_PHOTO&&item.CAR_PHOTO!=''?('http://50.147.128.157/deao_xjy/car_pass/'+item.CAR_PHOTO.replace('C:/inetpub/wwwroot/deao_xjy/car_pass','')):''" :onerror="app.noImg">
            </div>
            <div class="rycl-item-right">
              <div>车牌号码:{{item.CAR_NO}}</div>
              <!--<div>车辆类型:{{item.CARD_ID&&item.CARD_ID!=''?'已登记':'未登记'}}</div>-->
              <div>车辆类型:已登记</div>
              <div>出入地点:新嘉源西门</div>
              <div>IMSI:{{macs_temp[index_t].imsi}}</div>
              <div>采集时间:{{item.PASS_TIME_STR}}</div>
            </div>
          </div>
        </template>
        <template v-if="ryclType =='ry'">
          <div class="rycl-item animated fadeInDownBig" v-for="(item, index_t) in ryList">
            <div class="rycl-item-left">
              <img :src="item.IMAGEURL" :onerror="app.noImg">
            </div>
            <div class="rycl-item-right">
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
                <span>MAC：</span>
                <span></span>
              </div>
              <div>
                <span>IMSI：</span>
                <span>{{macs_temp[index_t].imsi}}</span>
              </div>
              <div>
                <span>入库时间：</span>
                <span>{{dateFormat(new Date(item.TIMESTAMP*1000))}}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="home-right-item home-right-afsb">
      <div class="home-left-item-title">
        安防设备
      </div>
      <div class="afsb-body">
        <div class="afsb-item" v-for="item in afsb">
          <div>
            <img class="pub-icon-circle-2" :src="'/static/images/home/right/'+item.IMG_NUM+'.png'" :onerror="app.noImg">
          </div>
          <div>{{item.NAME}}</div>
          <div class="pub-num-light">{{item.NUM}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
    import vueSeamlessScroll from 'vue-seamless-scroll'

    export default {
  name: 'HomeRight',
  components: {vueSeamlessScroll},
  inject: ['app'],
  data () {
    return {
      sjyj: [],
      afsb: {
        spjk: {
          img: '/static/images/home/right/1.png',
          name: '视频监控',
          num: '102',
        },
        rlxj: {
          img: '/static/images/home/right/2.png',
          name: '人脸相机',
          num: '8',
        },
        rxdz: {
          img: '/static/images/home/right/3.png',
          name: '人行道闸',
          num: '102',
        },
        cldz: {
          img: '/static/images/home/right/4.png',
          name: '车辆道闸',
          num: '102',
        },
        wrd: {
          img: '/static/images/home/right/5.png',
          name: '微热点',
          num: '102',
        },
        dzms: {
          img: '/static/images/home/right/6.png',
          name: '电子门锁',
          num: '102',
        },
        yg: {
          img: '/static/images/home/right/7.png',
          name: '烟感',
          num: '102',
        },
        xf: {
          img: '/static/images/home/right/8.png',
          name: '消防',
          num: '102',
        },
      },
      ryclType: 'cl',
      clList: [],
      sjyjTypes: {
        sdq: '水电气异常预警',
        qzdq: '签证到期预警',
        dzms: '电子门锁开门预警',
        jzyc: '居住异常预警',
        phry: '徘徊人员(异常出行）',
        yswdj: '高频陌生人（疑似未登记）',
        zfyc: '非规律性异常出行',
      },
      macs_temp: [
        {imsi:'460025244423362',mac:'70:47:E9:9F:5B:1B'},
        {imsi:'460110804294979',mac:'04:00:00:7C:00:00'},
        {imsi:'460025512742066',mac:'60:83:73:6D:61:55'},
        {imsi:'460016255102021',mac:'BC:54:FC:A3:2C:2E'},
        {imsi:'460110841947315',mac:'04:00:D0:7B:00:00'},
        {imsi:'460020852577401',mac:'44:9E:F9:53:B0:D5'},
        {imsi:'460110841849595',mac:'48:FD:A3:0A:5F:5D'},
        {imsi:'460110173280608',mac:'74:05:A5:38:28:1E'},
        {imsi:'460110804377860',mac:'04:00:80:7B:00:00'},
        {imsi:'460028510646258',mac:'E0:3E:44:08:F3:CC'},
      ],
    }
  },
  methods: {
    showSjyj(item,type,typeCn) {
      showSjyjModal(item,type,typeCn);
    },
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
    changeRycl(type) {
      this.ryclType = type;
      /*if(type == 'cl') {
        this.$service.call(this.$service.url.home.searchRycl,{type: type}).then((res) => {
          this.clList = res.data;
        });
      } else {

      }*/
    },
    searchCl() {
      this.$service.call(this.$service.url.home.searchRycl,{type: 'cl'}).then((res) => {
        this.clList = res.data;
      });
    },
    searchSjyj() {
      this.$service.call(this.$service.url.home.searchSjyj,{}).then((res) => {
        var arr = [];
        for(var r in res.data) {
          for(var j in res.data[r]) {
            arr.push({
              type: r,
              ...res.data[r][j]
            })
          }
        }
        this.sjyj = arr;
      });
    },
    searchAfsb(){
      this.$service.call(this.$service.url.home.searchAfsb,{}).then((res) => {
        this.afsb = res.data;
      });
    },
    searchFace() {
      var params = {pageSize: 10};
      this.$service.call(this.$service.url.home.searchFace,params).then((res) => {
        this.ryList = res.data;
      });
    },
  },
  created() {
    this.searchAfsb();
    this.searchSjyj();
    this.searchFace();
    this.changeRycl(this.ryclType);
    this.searchCl();
  },
  mounted() {
    clearInterval(this.dsq);
    this.dsq = setInterval(() => {
      this.changeRycl(this.ryclType);
      this.searchCl();
      this.searchSjyj();
      this.searchFace();
    },10000)
  },
}
</script>

<style lang="scss" scoped>
$MainColor:#00DFFF;
.HomeRight {
  position: absolute;
  z-index: 500;
  top: 8%;
  right: 3em;
  width: 400px;
  height: 84%;
  color: white;
  &::before {
    position: absolute;
    width: 128%;
    height: 119%;
    top: -9%;
    left: -14%;
    content: '';
    background: url(/static/images/home/bg.svg);
    background-size: 100%;
    pointer-events: none;
    opacity: .8;
  }
  .home-right-item {
    width: 100%;
    height: 33.3%;
    .home-left-item-title {
      text-align: center;
      font-size: 15px;
      color: $MainColor;
      letter-spacing: .1em;
      padding: .3em;
      background: url(/static/images/home/title_bg.png) no-repeat;
      background-size: contain;
      background-position: center;
      margin: 1em 0;
    }
    &.home-right-sjyj {
      .sjyj-body {
        height: 80%;
        overflow: auto;
        padding: .3em 1em;
        .sjyj-item {
          width: 90%;
          height: 45%;
          padding: .5em 1em;
          margin: .5em auto;
          display: inline-flex;
          &::before {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            content: '';
            background: url(/static/images/home/right/sjyj_bg.svg) no-repeat;
            background-size: contain;
            background-position: center;
            pointer-events: none;
          }

          .sjyj-item-icon {
            width: 60px;
            height: 60px;
            margin-right: 1em;
            > img {
              width: 100%;
              height: 100%;
            }
          }
          .sjyj-item-context {
            width: calc(100% - 40px);
            padding: 0 .5em;
            overflow: auto;
            &::-webkit-scrollbar{
              width:0;
              height:0;
            }
            > div {
              text-align: left;
              letter-spacing: .1em;
              &:nth-child(1) {
                font-weight: bold;
                color: #D34862;
                font-family: tencentFont;
                font-size: 14px;
              }
              >span {
                &:nth-child(1) {
                  color: #bdc2ff;
                }
                &:nth-child(2) {
                  color: white;
                }
              }
            }

          }
        }
        &::-webkit-scrollbar{
          width:0;
          height:0;
        }
      }

    }
    &.home-right-afsb {
      .afsb-body {
        padding: .5em;
        .afsb-item {
          display: inline-block;
          width: 25%;
          img {
            width: 60px;
            height: 60px;
          }
          > div {
            &:nth-child(2) {
              color: $MainColor;
            }
            &:nth-child(3) {
              text-shadow: 0.2rem 0 0.5rem white, -0.2rem 0rem 0.5rem #ffffff, 0rem 0.2rem 0.5rem #797979, 0rem -0.2rem 0.5rem #080808;
            }
          }
        }
      }
    }
    &.home-right-rycl {
      height: 30%;
      .rycl-body {
        height: 65%;
        overflow: auto;
        padding: 1em 2%;
        width: 90%;
        margin: 0 auto;
        margin-top: 1em;
        &::-webkit-scrollbar{
          width:0;
          height:0;
        }
        .rycl-item {
          width: 100%;
          display: inline-flex;
          color: $MainColor;
          margin-bottom: 10px;
          .rycl-item-left {
            display: -webkit-box;
            -webkit-box-orient: horizontal;
            -webkit-box-pack: center;
            -webkit-box-align: center;
            img {
              width: 100px;
              height: 70px;
            }
          }
          .rycl-item-right {
            width: calc(100% - 100px);
            padding: .5em;
            > div {
              text-align: left;
              padding-left: 1em;
            }
          }
          &:hover {
            box-shadow: 0 0 5px #081c1d, 0 0 5px #00efff inset;
            text-shadow: 0.2rem 0 0.5rem black, -0.2rem 0rem 0.5rem #b78a8a, 0rem 0.2rem 0.5rem #985656, 0rem -0.2rem 0.5rem #c16161;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.yj-icon {
  position: absolute;
  width: 25px;
  height: 25px;
  left: 2em;
  top: 2px;
  animation:icon-yj-ani 1.5s infinite linear forwards;
  >img {
    width: 100%;
    height: 100%;
  }
  &:before {
    position: absolute;
    width: 145%;
    height: 145%;
    content: '';
    top: 50%;
    left: 50%;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 12px #00DFFF, 0 0 12px red inset;
    border: 1px solid red;
    animation:icon-yj-ani2 .75s infinite linear forwards;
  }
}
@keyframes icon-yj-ani2 {
  0% {
    width: 0%;
    height: 0%;
  }
  100% {
    width: 145%;
    height: 145%;
  }
}
@keyframes icon-yj-ani {
  0% {
    opacity: 1;
    transform:rotate(0deg) scale(1.1);
  }
  50% {
    opacity: .8;
    transform:rotate(0deg) scale(.9);
  }
  100% {
    opacity: 1;
    transform:rotate(0deg) scale(1.1);
  }
}
</style>
