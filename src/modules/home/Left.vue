<template>
  <div class="HomeLeft animated bounceInLeft">
    <div class="home-left-item home-left-sjzl">
      <div class="home-left-item-title">
        数据总览
      </div>
      <div class="home-left-item-body">
        <div class="sjzl-item" v-for="item in sjzl">
          <img class="sjzl-item-icon" :src="'/static/images/home/left/'+item.IMG_NUM+'.png'">
          <div class="sjzl-item-body">
            <div class="pub-num-light">{{item.NUM}}</div>
            <div>{{item.NAME}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-left-item home-left-ryfx">
      <div class="home-left-item-title">
        人员分析
      </div>
      <div class="home-left-item-body">
        <div class="ryfx-title">
          <div class="title-bg-normal" style="width: 10em;padding:.5em;" :class="{'title-bg-active':ryfxType=='ssqyfb'}" @click="changeRyfx('ssqyfb')">所属企业分布</div>
          <div class="title-bg-normal" style="width: 10em;padding:.5em;" :class="{'title-bg-active':ryfxType=='ryfl'}" @click="changeRyfx('ryfl')">人员分类</div>
          <div class="title-bg-normal" style="width: 10em;padding:.5em;" :class="{'title-bg-active':ryfxType=='yqjkm'}" @click="changeRyfx('yqjkm')">疫情风险等级</div>

        </div>

        <div v-show="ryfxType=='ryfl'" class="ryfx-body animated zoomIn" id="ryfx">
        </div>
        <template v-if="ryfxType=='ssqyfb'">
          <div class="ryfx-body ryfx-body-ssqyfb animated fadeIn">
            <div class="ssqyfb-item" v-for="item in ssqyfb">
              <div class="no-wrap" :title="item.COMPANY">{{item.COMPANY}}</div>
              <div><div :style="'width:'+(item.RN/ssqyfbSum*100).toFixed(2)+'%'"></div></div>
              <div class="no-wrap" :title="item.RN">{{item.RN}}</div>
            </div>
          </div>
        </template>
        <div v-show="ryfxType=='yqjkm'" class="ryfx-body animated zoomIn" id="yqjkm">
        </div>
      </div>
    </div>
    <div class="home-left-item home-left-zxsj">
      <div class="home-left-item-title">
        最新事件
      </div>
      <div class="home-left-item-body">
        <div class="zxsj-title">
          <div class="zxsj-left-title title-bg-normal" :class="{'title-bg-active':zxsjType=='zxjq'}" @click="changeZxsj('zxjq')">最新警情</div>
          <div class="zxsj-right-title title-bg-normal" :class="{'title-bg-active':zxsjType=='wgsj'}" @click="changeZxsj('wgsj')">网格事件</div>
        </div>
        <div class="zxsj-body-con">
          <div class="zxsj-body">
            <template v-if="zxsjType=='zxjq'">
              <div class="zxsj-item animated fadeInDownBig">
                <div>时间</div>
                <div>类别</div>
                <div>地点</div>
              </div>
              <div v-for="item in zxsj" class="zxsj-item animated fadeInDownBig" :class="{'zxsj-item-active':showZxjq.JJBH==item.JJBH&&showZxjq.CJBH==item.CJBH}" @click="showZxjqModal(item)">
                <div class="no-wrap" :title="item.CJSJ.substring(0,10)">{{item.CJSJ.substring(0,10)}}</div>
                <div class="no-wrap" :title="item.CJLBMC">{{item.CJLBMC}}</div>
                <div class="no-wrap" :title="item.CJXZ">{{item.CJXZ}}</div>
              </div>
            </template>
            <template v-if="zxsjType=='wgsj'" class="animated fadeInDownBig">
              <div class="zxsj-item zxsj-item-wgsj animated fadeInDownBig">
                <div>时间</div>
                <div>类别</div>
                <div>地点</div>
                <div>操作</div>
              </div>
              <div v-for="item in zxsj" class="zxsj-item zxsj-item-wgsj animated fadeInDownBig">
                <div class="no-wrap" :title="item.TIME">{{item.TIME}}</div>
                <div class="no-wrap" :title="item.TYPE">{{item.TYPE}}</div>
                <div class="no-wrap" :title="item.ADDRESS">{{item.ADDRESS}}</div>
                <div class="no-wrap"><div class="btn-fk" @click="showFk(item)">反馈</div></div>
              </div>
            </template>
          </div>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'HomeLeft',
  inject: ['app'],
  data () {
    return {
      sjzl: [],
      echart: '',
      echartYqjkm: '',
      dsq: '',
      zxsj: [],
      zxsjType: 'zxjq',
      ryfxType: 'ryfl',//ryfl
      ssqyfb: [],
      ssqyfbSum: 0,
      showZxjq: {},
    }
  },
  methods: {
    showZxjqModal(item) {
      this.showZxjq = item;
      window.showZxjqModal(item);
    },
    drawEchart(params) {
      if(!this.echart || this.echart == '') {
        this.echart = this.$echarts.init(document.getElementById("ryfx"));
      }
      var dataArr = params.ry;
      var childArr = params.qy;
      dataArr.forEach((item) => {
        item.name = item.NATION=='中国'?'流动人员':'外籍人员';
        item.value = item.RN;
      })
      dataArr.push({
        name: '重点人员',
        value: 2,
      })
      var option;
      var nameArr = [];
      dataArr.forEach((item) => {
        nameArr.push(item.name);
      });

      childArr.forEach((item)=> {
        item.name = item.COMPANY;
        item.value = item.RN;
      })

      option = {
        textStyle: {
          fontFamily: 'tencentFont',
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: { // 图例-图上面的分类
          orient: 'vertical',
          y:'center',     //可设定图例在上、下、居中
          right: 30,
          //   icon: 'rect',//长方形
          icon: 'roundRect',
          itemWidth: 20,
          itemHeight: 3,
          itemGap: 13,
          data: nameArr,
          textStyle: {
            fontSize: 12,
            color: '#a6cde8',
//            lineHeight: 49
            rich:{
              a:{
                align:'right',
                color: '#18A0E5',
              },
              b:{
                color: 'white',
                fontSize: '14',
                width: 50,
                align:'right',
              },
              c:{
                color: 'white',
                fontSize: '14',
                width: 65,
                align:'right',
              }
            }
          },
          formatter: function(name) {
            var total = 0;
            var target;
            for (var i = 0, l = dataArr.length; i < l; i++) {
              total += dataArr[i].value;
              if (dataArr[i].name == name) {
                target = dataArr[i].value;
              }
            }
            return '\n' +'{c|'+((target/total)*100).toFixed(2) + '%}'+ ' {b|' + target +'}' + '\n' +'{a|'+name+'}';
          },
          padding: [2, 2]
        },
        series: [
          {
            name:'统计',
            type:'pie',
            color:['#02D5F6','#027FFF','red'],
            selectedMode: 'single',
            radius: [0, '45%'],
            center: ['30%', '50%'],

            label:{show:false},
            labelLine:{show:false},
            data: dataArr
          },
          {
            name:'统计',
            type:'pie',
            color:['#6ac9ff','#42acff','#0c84fc','#3666ee','#7978fa','#00dbe3','#f97da1','#ff9e85'],
            radius: ['65%', '70%'],
            center: ['30%', '50%'],
            label:{show:false},
            labelLine:{show:false},
            data: childArr
          },
          {
            type: 'pie',
            zlevel: 1,
            silent: true,
            /*
             radius
             饼图的半径。可以为如下类型：
             number：直接指定外半径值。
             string：例如，'20%'，表示外半径为可视区尺寸（容器高宽中较小一项）的 20% 长度。
             Array.<number|string>：数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述。
             */
            radius: ['60%', '61%'],
            center: ['30%', '50%'],
            hoverAnimation: false,
            //color: "rgba(88,142,197,0.5)",
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#00CCFF' // 0% 处的颜色
              }, {
                offset: 1, color: '#00CCFF' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            // animation:false,    //charts3 no
            label: {
              normal: {
                show: false
              },
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [1]
          },
        ]
      };
      this.echart.setOption(option)

      var Ii=-1;
      clearInterval(this.dsq);
      this.dsq = setInterval(()=>{
        if( Ii>= dataArr.length-1){
          Ii = -1;
        }
        Ii++;
        this.echart.dispatchAction({
          type: 'downplay', seriesIndex:0
        });
        this.echart.dispatchAction({
          type: 'highlight', seriesIndex:0 ,dataIndex: Ii
        });
        this.echart.dispatchAction({
          type: 'showTip', seriesIndex:0 ,dataIndex: Ii
        });
      },3000);
    },
    drawEchartYqjkm(params) {
      if(!this.echartYqjkm || this.echartYqjkm == '') {
        this.echartYqjkm = this.$echarts.init(document.getElementById("yqjkm"));
      }
      var dataArr = params;
      dataArr.forEach((item) => {
        item.name = item.NAME;
        item.value = item.VALUE;
      })
      var option;
      var nameArr = [];
      dataArr.forEach((item) => {
        nameArr.push(item.name);
      });

      option = {
        textStyle: {
          fontFamily: 'tencentFont',
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: { // 图例-图上面的分类
          orient: 'vertical',
          y:'center',     //可设定图例在上、下、居中
          right: 30,
          //   icon: 'rect',//长方形
          icon: 'roundRect',
          itemWidth: 20,
          itemHeight: 3,
          itemGap: 13,
          data: nameArr,
          textStyle: {
            fontSize: 12,
            color: '#a6cde8',
//            lineHeight: 49
            rich:{
              a:{
                align:'right',
                color: '#18A0E5',
              },
              b:{
                color: 'white',
                fontSize: '14',
                width: 50,
                align:'right',
              },
              c:{
                color: 'white',
                fontSize: '14',
                width: 65,
                align:'right',
              }
            }
          },
          formatter: function(name) {
            var total = 0;
            var target;
            for (var i = 0, l = dataArr.length; i < l; i++) {
              total += parseInt(dataArr[i].value);
              if (dataArr[i].name == name) {
                target = parseInt(dataArr[i].value);
              }
            }
            return '\n' +'{c|'+((target/total)*100).toFixed(2) + '%}'+ ' {b|' + target +'}' + '\n' +'{a|'+name+'}';
          },
          padding: [2, 2]
        },
        series: [
          {
            name:'统计',
            type:'pie',
            color:['green','orange','red'],
            selectedMode: 'single',
            radius: [0, '45%'],
            center: ['30%', '50%'],

            label:{show:false},
            labelLine:{show:false},
            data: dataArr
          },
          {
            type: 'pie',
            zlevel: 1,
            silent: true,
            /*
             radius
             饼图的半径。可以为如下类型：
             number：直接指定外半径值。
             string：例如，'20%'，表示外半径为可视区尺寸（容器高宽中较小一项）的 20% 长度。
             Array.<number|string>：数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述。
             */
            radius: ['60%', '61%'],
            center: ['30%', '50%'],
            hoverAnimation: false,
            //color: "rgba(88,142,197,0.5)",
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#00CCFF' // 0% 处的颜色
              }, {
                offset: 1, color: '#00CCFF' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            // animation:false,    //charts3 no
            label: {
              normal: {
                show: false
              },
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [1]
          },
        ]
      };
      this.echartYqjkm.setOption(option)

      var Ii=-1;
      clearInterval(this.dsq2);
      this.dsq2 = setInterval(()=>{
        if( Ii>= dataArr.length-1){
          Ii = -1;
        }
        Ii++;
        this.echartYqjkm.dispatchAction({
          type: 'downplay', seriesIndex:0
        });
        this.echartYqjkm.dispatchAction({
          type: 'highlight', seriesIndex:0 ,dataIndex: Ii
        });
        this.echartYqjkm.dispatchAction({
          type: 'showTip', seriesIndex:0 ,dataIndex: Ii
        });
      },3000);
    },
    searchSqqyfb() {
      var arr = [];
      for(var i = 0; i < 10; i++) {
          arr.push({
            name: '企业' + i,
            num: Math.floor(Math.random()*200),
          });
      }
      this.$service.call(this.$service.url.home.searchSsqyfb,{}).then((res) => {
        var sum = 0,arr=res.data;
        arr.forEach((item)=> {
          sum += item.RN;
        })
        this.ssqyfb = arr;
        this.ssqyfbSum = sum;
      });

    },
    searchZxsj() {
      this.$service.call(this.$service.url.home.searchZxjq,{type:this.zxsjType}).then((res) => {
        this.zxsj = res.data;
      });
    },
    changeZxsj(type) {
      this.zxsjType = type||'zxjq'
      this.searchZxsj();
    },
    changeRyfx(type) {
      this.ryfxType = type||'ryfl'
      if(this.ryfxType =='ssqyfb') {
        this.searchSqqyfb();
      } else if(this.ryfxType =='ryfl') {
        this.$service.call(this.$service.url.home.searchRyfl,{}).then((res) => {
          this.drawEchart(res.data);
        });
      } else if(this.ryfxType =='yqjkm') {
        this.$service.call(this.$service.url.home.searchYqjkm,{}).then((res) => {
          this.drawEchartYqjkm(res.data);
        });
      }
    },
    searchSjzl() {
      this.$service.call(this.$service.url.home.searchSjzl,{}).then((res) => {
          this.sjzl = res.data;
      });
    },
    showFk(item) {
      showZxsjFk(item)
    }
  },
  mounted() {
    this.searchSjzl();
    this.searchZxsj();
    this.changeRyfx(this.ryfxType);
    clearInterval(this.dsq);
    this.dsq = setInterval(() => {
      this.changeRyfx(this.ryfxType);
    },10000)
  },
}
</script>

<style lang="scss" scoped>
$MainColor:#00DFFF;
.HomeLeft {
  position: absolute;
  z-index: 500;
  top: 8%;
  left: 3em;
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
  .home-left-item {
    width: 100%;
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
    &.home-left-sjzl {
      height: 26%;
      .home-left-item-body {
        grid-gap: 1em;
        grid-template-columns: 33%;
        text-align: left;
        padding: .5em 1em;
        .sjzl-item {
          display: inline-block;
          padding: .6em 1.5em;
          width: 33%;
          .sjzl-item-icon {
            width: 30px;
          }
          .sjzl-item-body {
            display: inline-block;
            > div {
              &:nth-child(1) {
                color: white;
                font-size: 15px;
                text-shadow: 0.2rem 0rem 0.5rem white, -0.2rem 0rem 0.5rem #ffffff, 0rem 0.2rem 0.5rem #797979, 0rem -0.2rem 0.5rem #080808;
              }
              &:nth-child(2) {
                color: $MainColor;
              }
            }
          }
        }
      }
    }
    &.home-left-ryfx {
      height: 32%;
      .home-left-item-body {
        width: 100%;
        height: 100%;
        .ryfx-title {
          width: 100%;
          > div {
            display: inline-block;
          }
        }
        .ryfx-body {
          width: 100%;
          height: 80%;
          &.ryfx-body-ssqyfb {
            padding: 1em 0;
            overflow: auto;
            &::-webkit-scrollbar{
              width:0;
              height:0;
            }
          }
          .ssqyfb-item {
            width: 90%;
            margin: .2em auto;
            display: inline-flex;
            > div {
              &:nth-child(1) {
                width: 30%;
                color: $MainColor;
              }
              &:nth-child(2) {
                width: 50%;
                background: #144046;
                text-align: left;
                height: 8px;
                margin-top: 5px;
                border-radius: 3px;
                > div {
                  background: $MainColor;
                  height: 100%;
                  background: linear-gradient(to right, #65a1a9 0%,#0be0ff 100%);
                  border-radius: 3px;
                }
              }
              &:nth-child(3) {
                width: 20%;
                text-shadow: 0.2rem 0rem 0.5rem white, -0.2rem 0rem 0.5rem #ffffff, 0rem 0.2rem 0.5rem #797979, 0rem -0.2rem 0.5rem #080808;
              }
            }
          }
        }
      }
    }
    &.home-left-zxsj {
      height: 30%;
      .home-left-item-body {
        width: 100%;
        height: 100%;
        .zxsj-title {
          width: 100%;
          > div {
            display: inline-block;
          }
        }
        .zxsj-body-con {
          width: 100%;
          height: 100%;
          margin-top: 1em;
          padding: 2em 1em;
          &::before {
            position: absolute;
            width: 92%;
            height: 95%;
            top: -2%;
            left: 4%;
            content: '';
            background: url(/static/images/home/left/zxsj_bg.png) no-repeat;
            background-size: 100%;
            background-position: center;
          }
        }
        .zxsj-body {
          width: 100%;
          height: 80%;
          overflow-y: auto;
          padding: 3% 8%;
          &::-webkit-scrollbar{
            width:0;
            height:0;
          }
          .zxsj-item {
            width: 100%;
            cursor: pointer;
            background: url(/static/images/home/left/zxsj_bottom.png) no-repeat;
            background-size: 100%;
            background-position: center;
            > div {
              width: 31%;
              display: inline-block;
              padding: .42em .5em;
              color: $MainColor;
            }
            &.zxsj-item-wgsj {
              > div {
                width: 23%;
              }
              .btn-fk {
                background: #09c7da;
                color: white;
                border-radius: .3em;
                width: 4em;
                cursor: pointer;
              }
            }
            &:hover,&.zxsj-item-active {
              box-shadow: 0 0 5px #081c1d, 0 0 5px #00efff inset;
              text-shadow: 0.2rem 0rem 0.5rem black, -0.2rem 0rem 0.5rem #b78a8a, 0rem 0.2rem 0.5rem #985656, 0rem -0.2rem 0.5rem #c16161;
              > div {
                color: orange;
              }
            }
          }
        }
      }
    }
  }
}
</style>
