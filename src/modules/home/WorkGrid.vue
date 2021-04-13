<template>
  <transition
    name="fade"
    enter-active-class="animated bounceInDown"
    leave-active-class="animated flipOutY"
  >
    <div class="WorkGrid pub-border" v-if="visible">
      <div class="WorkGrid-head">
        <span>当日值班情况</span>
        <i class="gfl gf-icon-difference btn-close" @click="cancel"></i>
      </div>
      <div class="WorkGrid-body">
        <div class="mj-fj-con" style="width: 70%;margin: 0 auto">
          <div class="mj-fj-item">
            <div class="work-img-con pub-icon-circle-1"><img :src="imgUrl+mj.JH+'.jpg'" :onerror="app.noImg"></div>
            <div>
              <span>职务:</span>
              <span>{{mj.ZW_P}}</span>
            </div>
            <div>
              <span>姓名:</span>
              <span>{{mj.XM}}</span>
            </div>
            <div>
              <span>警号:</span>
              <span>{{mj.JH}}</span>
            </div>
            <div>
              <span>值班时间:</span>
              <span>{{mj.PB}}</span>
            </div>
          </div>
          <div class="mj-fj-item">
            <div class="work-img-con pub-icon-circle-1"><img :src="imgUrl+fj.LXDH+'.jpg'" :onerror="app.noImg"></div>
            <div>
              <span>职务:</span>
              <span>{{fj.ZW_P}}</span>
            </div>
            <div>
              <span>姓名:</span>
              <span>{{fj.XM}}</span>
            </div>
            <div>
              <span>值班时间:</span>
              <span>{{fj.PB}}</span>
            </div>
          </div>
        </div>
        <div class="work-grid-item-title">
          白班
        </div>
        <div class="ba-con">
          <template v-for="item in list_d">
            <div class="ba-item"  v-if="item.PB!='X'">
              <div class="work-img-con pub-icon-circle-1"><img :src="imgUrl+item.SFZ+'.jpg'" :onerror="app.noImg"></div>
              <div>
                <span>职务:</span>
                <span>{{item.ZW&&item.ZW!=''?item.ZW:item.ZW_P}}</span>
              </div>
              <div>
                <span>姓名:</span>
                <span>{{item.XM}}</span>
              </div>
              <div>
                <span>有无保安证:</span>
                <span>{{item.BAZ&&item.BAZ!=''?item.BAZ:'无'}}</span>
              </div>
              <div>
                <span>值班时间:</span>
                <span v-if="item.PB=='A'">07：30-19：00</span>
                <span v-if="item.PB=='B'">19：00-07：00</span>
                <span v-if="item.PB=='X'">休息</span>
              </div>
              <div>
                <span>联系电话：</span>
                <span>{{item.LXDH}}</span>
              </div>
            </div>
          </template>
          <template v-for="item in list_a">
            <div class="ba-item"  v-if="item.PB!='X'">
              <div class="work-img-con pub-icon-circle-1"><img :src="imgUrl+item.SFZ+'.jpg'" :onerror="app.noImg"></div>
              <div>
                <span>职务:</span>
                <span>{{item.ZW&&item.ZW!=''?item.ZW:item.ZW_P}}</span>
              </div>
              <div>
                <span>姓名:</span>
                <span>{{item.XM}}</span>
              </div>
              <div>
                <span>有无保安证:</span>
                <span>{{item.BAZ&&item.BAZ!=''?item.BAZ:'无'}}</span>
              </div>
              <div>
                <span>值班时间:</span>
                <span v-if="item.PB=='A'">07：30-19：00</span>
                <span v-if="item.PB=='B'">19：00-07：00</span>
                <span v-if="item.PB=='X'">休息</span>
              </div>
              <div>
                <span>联系电话：</span>
                <span>{{item.LXDH}}</span>
              </div>
            </div>
          </template>
        </div>
        <div class="work-grid-item-title">
          夜班
        </div>
        <div class="ba-con">
          <template v-for="item in list_b">
            <div class="ba-item"  v-if="item.PB!='X'">
              <div class="work-img-con pub-icon-circle-1"><img :src="imgUrl+item.SFZ+'.jpg'" :onerror="app.noImg"></div>
              <div>
                <span>职务:</span>
                <span>{{item.ZW&&item.ZW!=''?item.ZW:item.ZW_P}}</span>
              </div>
              <div>
                <span>姓名:</span>
                <span>{{item.XM}}</span>
              </div>
              <div>
                <span>有无保安证:</span>
                <span>{{item.BAZ&&item.BAZ!=''?item.BAZ:'无'}}</span>
              </div>
              <div>
                <span>值班时间:</span>
                <span v-if="item.PB=='A'">07：30-19：00</span>
                <span v-if="item.PB=='B'">19：00-07：00</span>
                <span v-if="item.PB=='X'">休息</span>
              </div>
              <div>
                <span>联系电话：</span>
                <span>{{item.LXDH}}</span>
              </div>
            </div>
          </template>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'WorkGrid',
  inject: ['app'],
  data () {
    return {
      visible: false,
      list_a: [],
      list_b: [],
      list_d: [],
      mj: {},
      fj: {},
      imgUrl: process.env.fileBaseUrl+'work_grid/',
    }
  },
  methods: {
    cancel() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
    search() {
      var params = {};
      this.$service.call(this.$service.url.home.searchWorkGrid,params).then((res) => {
        var arr = [];
        res.data.forEach((item) => {
          if(item.ZW_P=='民警') {
            this.mj = item;
          } else if(item.ZW_P=='辅警') {
            this.fj = item;
          } else {
            if(item.SFZ=='320911196101106358' || (!item.JTZZ || item.JTZZ=='')) {

            } else {
              arr.push(item);
            }

          }
        })
        var arr_a=[],arr_b=[],arr_d=[];
        arr.forEach((a) => {
          if(a.ZW_P=='保安队长'||a.ZW=='保安队长') {
            arr_d.push(a)
          } else if(a.PB=='A') {
            arr_a.push(a);
          } else {
            arr_b.push(a);
          }
        });
        this.list_a = arr_a;
        this.list_b = arr_b;
        this.list_d = arr_d;
      });
    },
  },
  mounted() {
    this.search();
    this.show();
    window.showWorkGrid = this.show;
  },
}
</script>

<style lang="scss" scoped>
.WorkGrid {
  position: absolute;
  z-index: 1000;
  width: 580px;
  height: 80%;
  left: calc(50% - 290px);
  top: 10%;
  background-size: 100% 100%;
  color: white;
  .WorkGrid-head {
    text-align: center;
    font-weight: bold;
    font-size: 25px;
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
  .WorkGrid-body {
    padding: .3em;
    width: 96%;
    margin: 1em auto;
    height: calc(100% - 100px);
    overflow: auto;
    text-shadow: 0.2rem 0rem 0.5rem black, -0.2rem 0rem 0.5rem #b78a8a, 0rem 0.2rem 0.5rem #985656, 0rem -0.2rem 0.5rem #c16161;
    .work-img-con {
      width: 90px;
      height: 120px;
      margin: .5em auto;
      overflow: hidden;
      box-shadow: 0 0 10px hsla(0,0%,91%,.6), inset 0 0 4px hsla(0,0%,91%,.6);
      img {
        width: 100%;
        height: 100%;
        transition: all .6s;
        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .mj-fj-con {
      display: grid;
      grid-gap: 1em;
      grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
    }
    .ba-con {
      display: grid;
      grid-gap: 1em;
      grid-template-columns: repeat(auto-fit,minmax(160px,1fr));
    }

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .work-grid-item-title {
      width:100%;
      height: auto;
      padding: .5em;
      border-bottom: 1px solid #008a81;
      margin: 1em 0;
      text-align: center;
      color: white;
      font-size: 25px;
    }

  }
}
</style>
