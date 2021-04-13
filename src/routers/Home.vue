<template>
  <div class="Home">
    <div id="map" class="animated zoomIn">
    </div>
    <div class="drzb-btn" onclick="showWorkGrid()">当日值班</div>
    <div class="home-head animated fadeInDownBig">
      新嘉源小区智慧安防管理平台
    </div>
    <home-left></home-left>
    <home-right></home-right>
    <home-build ref="buildRef"></home-build>
    <div class="layer-con animated flipInX">
      <template v-for="item in layers">
        <div class="layer-item">
          <Tooltip :content="item.label">
            <div class="layer-item-check pub-icon-circle-2" :class="{'layer-item-active':item.checked}" @click="toggleLayer(item)">
              <img :src="'/static/images/home/center/icons/'+item.type+(item.checked?'_2':'')+'.png'">
            </div>
          </Tooltip>
        </div>
      </template>

    </div>
    <zxsj-fk></zxsj-fk>
    <face-wall></face-wall>
    <zxjq-modal></zxjq-modal>
    <work-grid></work-grid>
    <wrd-record></wrd-record>
    <sjyj-modal></sjyj-modal>
    <pass-car-peole></pass-car-peole>
  </div>
</template>

<script>
    import HomeLeft from '@/modules/home/Left.vue'
    import HomeRight from '@/modules/home/Right.vue'
    import HomeBuild from '@/modules/home/Build.vue'
    import ZxsjFk from '@/modules/home/ZxsjFk.vue'
    import FaceWall from '@/modules/home/FaceWall.vue'
    import ZxjqModal from '@/modules/home/ZxjqModal.vue'
    import WorkGrid from '@/modules/home/WorkGrid.vue'
    import WrdRecord from '@/modules/home/WrdRecord.vue'
    import SjyjModal from '@/modules/home/SjyjModal.vue'
    import PassCarPeole from '@/modules/home/PassCarPeole.vue'

    function pad(num, len) {
  let count = num.length;
  while (count < len) {
    num = '0' + num;
    count++;
  }
  return num;
}

export default {
  name: 'Home',
  inject: ['app'],
  components: {HomeLeft,HomeRight,HomeBuild,ZxsjFk,FaceWall,ZxjqModal,WorkGrid,WrdRecord,SjyjModal,PassCarPeole},
  data () {
    return {
      layersLayer: {},
      layers: [
        {
          label: '小区', checked: true, type: 'xq',
        },
        {
          label: '楼栋', checked: true, type: 'lz',
        },
        {
          label: '网格', checked: true, type: 'wg',
        },
        {
          label: '车辆道闸', checked: true, type: 'cldz',
        },
        {
          label: '人行道闸', checked: true, type: 'rxdz',
        },
        {
          label: '监控', checked: true, type: 'jk',
        },
        {
          label: '无人机', checked: true, type: 'wrj',
        },
        {
          label: '人脸识别', checked: true, type: 'rlsb',
        },
        {
          label: '微热点', checked: true, type: 'wrd',
        },
        {
          label: '350M电台', checked: true, type: 'dt',
        },
        {
          label: '消防', checked: true, type: 'xf',
        },
      ],
      xq: {
        "type": "FeatureCollection",
        "name": "小区边界0706",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [
          { "type": "Feature", "properties": { "Id": 0, "name": "新嘉园小区" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 120.222990617697747, 33.365669093438783 ], [ 120.222970441609107, 33.365657057661288 ], [ 120.222948499169917, 33.36564866338616 ], [ 120.222925441596701, 33.365644159742054 ], [ 120.222901953201401, 33.36564368038993 ], [ 120.222878731082019, 33.365647239556189 ], [ 120.222856464433974, 33.365654731610476 ], [ 120.222835814095774, 33.365665934200585 ], [ 120.222817392936463, 33.365680514851533 ], [ 120.220268514307008, 33.368724321370223 ], [ 120.220261411197725, 33.368754307462254 ], [ 120.220259243773867, 33.368785047048306 ], [ 120.220262068933138, 33.368815733174685 ], [ 120.220269812511432, 33.368845560291071 ], [ 120.220282271229877, 33.368873745397273 ], [ 120.220299118031065, 33.368899548597973 ], [ 120.220319910664784, 33.368922292525951 ], [ 120.223626409678559, 33.370820150624183 ], [ 120.223657256052419, 33.370835449909052 ], [ 120.223690113952202, 33.370845741911751 ], [ 120.223724176343865, 33.37085077384689 ], [ 120.223758606609451, 33.370850422123404 ], [ 120.2237925590955, 33.370844695380093 ], [ 120.22382519988345, 33.370833734273447 ], [ 120.22385572727184, 33.37081780802292 ], [ 120.223883391467098, 33.370797307798568 ], [ 120.225457642868719, 33.368935617507589 ], [ 120.226428462959007, 33.367783958380755 ], [ 120.226433672316745, 33.367765447761563 ], [ 120.22643580668425, 33.367746336903224 ], [ 120.226434809404552, 33.367727133105056 ], [ 120.226430706950538, 33.367708346133455 ], [ 120.226423608222177, 33.367690474690122 ], [ 120.226413701655801, 33.367673993174002 ], [ 120.22640125022204, 33.367659339088291 ], [ 120.226386584445208, 33.367646901426895 ], [ 120.222990617697747, 33.365669093438783 ] ] ] } }
        ]
      },
      dsqs: {},
    }
  },
  methods: {
    presentFullScreen(id){
      if(document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen) {
        this.exitFullscreen();
        return;
      }
      if(document.fullscreenEnabled){
        document.getElementById(id).requestFullscreen()
      }
      else if(document.webkitFullscreenEnabled){
        document.getElementById(id).webkitRequestFullscreen()
      }
      else if(document.mozFullScreenEnabled){
        document.getElementById(id).mozRequestFullScreen();
      }
      else if(document.msFullscreenEnabled){
        document.getElementById(id).msRequestFullscreen();
      }else{
        console.log("Fullscreen API 不存在")
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    loginout() {
      this.$router.push('/Login');
    },
    initMap() {
      this.initBaseLayer();
      this.map.on('zoomend', (e) => {
        this.changeLzSize(this.map.getZoom());
      });
      this.changeLzSize();
      this.initDrawLayer();
    },
    initBaseLayer() {
      var center = '120.2236784,33.3684068';

      this.map = new GL.Map('map', {
        zoom: 17,
        center: center,
        zoomControl: false,
        scaleControl: false
      });
      var invertedBaseLayer = GL.LayerLookup.createGaeaTiledLayer(
        process.env.mapUrl,
        {
          maxBounds: '120.1848507,33.3513225;120.2672482,33.3849054',
          maxZoom: 19,
          minZoom: 16,
          format: 'png',
        },
        {code: '3857'}
      );
      this.map.addBaseLayer(invertedBaseLayer);
      window.map = this.map;
      this.map.on('click',(e) => {
        console.log(e.lnglat.toString())
      })
    },
    changeLzSize(zoom) {
      zoom = zoom?zoom:this.map.getZoom();
      var scale = zoom/19
      scale = scale==1?scale:scale*.85
      document.documentElement.style.setProperty('--font-scale-lz',scale);
      scale = zoom>=18?1:scale*.9
      document.documentElement.style.setProperty('--icon-scale-point',scale);
    },
    showBuild(params) {
      this.$refs.buildRef.show(params);
    },
    closeBuild() {
      this.$refs.buildRef.close()
    },
    initDrawLayer() {
      this.layers.forEach((item) => {
        this.drawLayer(item)
      });
    },
    toggleLayer(item) {
      item.checked = !item.checked
      this.drawLayer(item)
    },
    randomShap(xy) {
      xy = xy || '120.2234477,33.3682119'
      var xys = xy.split(",");
      let r = Math.random() / 1000;
      let angle = Math.random() * Math.PI * 2;
      var x = parseFloat(xys[0]) + 1.5 * r * Math.cos(angle);
      var y = parseFloat(xys[1]) + r * Math.sin(angle);
      return x + "," + y;
    },
    drawLayer(item) {
      let curId = item.type+'-ll';
      var curLayer = this.layersLayer[item.type]
      if(!curLayer||curLayer=='') {
        this.layersLayer[item.type] = curLayer = new GL.VectorLayer(curId);
        this.map.addLayer(curLayer);
      }
      curLayer.clear();
      clearTimeout(this.dsqs[item.type])
      if(!item.checked) {
        return;
      }
      if(item.type=='xq') {
//        var style = new GL.Style.Fill({ fillColor: 'rgba(1,1,1,0)', color: 'rgba(12, 153, 234, 1)',width: '1'}, false);
        var style = new GL.Style({ color: 'rgba(25, 251, 252, 1)',width: '0.1'}, false);
        let p = new GL.Polyline(this.xq.features[0].geometry.coordinates, style);
        curLayer.addOverlay(p);
      }
      if(item.type=='xf') {
        this.$service.call(this.$service.url.home.searchXf,{}).then((res) => {
          for(var i=0;i<res.data.length;i++) {
            let item = res.data[i];
            var pp = new GL.Point(item.X+','+item.Y,new GL.Icon.Smart('/static/images/home/center/icons/xf_p.png', [32, 32]));
            pp.bindPopup('<div class="popup-wg-body">' +
              '<table>' +
              '<tr><td><img class="img-xf" src="'+process.env.fileBaseUrl+'xf/'+item.ICON+'"></td></tr>' +
//              '<tr><td style="text-align: center">'+item.NAME+'</td></tr>' +
              '</table>' +
              '</div>',
              {className: 'popup-wg popup-div-con'})
            curLayer.addOverlay(pp);
          }
          pp.on('click',() => {
              console.log(item)
          })
          curLayer.bringToFront();
        });

      }
      if(item.type=='wg') {
        var colors = ['rgba(247, 206, 144,.8)','rgba(211, 218, 140,.8)','rgba(157, 166, 211,.8)','rgba(231, 140, 184,.8)','rgba(254, 164, 159,.8)'];
        this.$service.call(this.$service.url.home.searchWg,{}).then((res) => {
          for(var i=0;i<res.data.length;i++) {
            let item = res.data[i];
            var style = new GL.Style.Fill({ fillColor: colors[i], color: 'rgba(165, 255, 128, 1)',width: '1'}, false);
            let p = new GL.Polygon(item.COORDS, style);
            p.bindPopup('<div class="popup-wg-body">' +
              '<table>' +
              '<tr><td colspan="2" class="img-con"><img src="'+(process.env.fileBaseUrl+'wg_person/'+item.USER_NAME+'.png')+'"></td></tr>' +
              '<tr><td>网格员姓名:</td><td>'+item.USER_NAME+'</td></tr>' +
//              '<tr><td>建成时间:</td><td>'+item.JCSJ+'</td></tr>' +
              '<tr><td>联系电话:</td><td>'+item.LXDH+'</td></tr>' +
              '</table>' +
              '</div>',
              {className: 'popup-wg pub-border'})
            let bgNormal = colors[i];
            let bgActive = '#B3EE3A';
            p.on('mouseover', (e) => {
              var c_s = e.target.getStyle();
              c_s.options.fillColor = bgActive;
              e.target.setStyle(c_s);
            })
            p.on('mouseout', (e) => {
              var c_s = e.target.getStyle();
              c_s.options.fillColor = bgNormal;
              e.target.setStyle(c_s);
            })
            p.on('click',(e) => {
              this.map.setCenter(p.getCenter())
            })
            curLayer.addOverlay(p);
          }
          curLayer.bringToBack();
        });

      }
      if(item.type=='lz') {
        this.$service.call(this.$service.url.home.searchLz,{}).then((res) => {
          var bgNormal = '#00a2ff';
          var bgActive = '#B3EE3A';
          var style = new GL.Style.Fill({ fillColor: bgNormal, color: 'rgba(242, 255, 0, .6)',width: '1'}, false);
          res.data.forEach((item) => {
            let name = item.NAME;
            let p = new GL.Polygon(JSON.parse(item.COORDS).geometry.coordinates, style);
            curLayer.addOverlay(p);
//            p.on('click', (e) => {
//              this.showBuild(name.replace('#',''));
//            })
            p.on('mouseover', (e) => {
              var c_s = e.target.getStyle();
              c_s.options.fillColor = bgActive;
              e.target.setStyle(c_s);
            })
            p.on('mouseout', (e) => {
              var c_s = e.target.getStyle();
              c_s.options.fillColor = bgNormal;
              e.target.setStyle(c_s);
            })
            var icon = new GL.Icon.Div('<div class="point-icon-lz">' +
              name+
              '</div>', 'build-icon');
            var pp = new GL.Point(item.X+','+item.Y,icon)
            pp.on('click', (e) => {
              this.showBuild(name.replace('#',''));
            })
            curLayer.addOverlay(pp);

          })
          curLayer.bringToFront();
        });

      }
      if(item.type=='jk') {
        this.$service.call(this.$service.url.home.searchJk,{}).then((res) => {
          res.data.forEach((item) => {
            var pp = new GL.Point(item.X+','+item.Y,new GL.Icon.Smart('/static/images/home/center/icons/jk_p.png', [32, 32]));
            pp.bindPopup(''+
              '<div class="video-con" id="'+item.PID+'_JK'+'" onclick="presentFullScreen(\''+item.PID+'_JK'+'\')">' +
              '<iframe class="video-item" src="/static/media/html/video.html?channel='+item.CHANNEL+'" frameborder="0"></iframe>' +
              '</div>' +
              '<div class="jk-popup-line"></div>'+
              '',
              {
                className: 'jk-popup',
              })
            curLayer.addOverlay(pp);
          });
        });

      }
      if(item.type=='wrj') {
        this.$service.call(this.$service.url.home.searchWrj,{}).then((res) => {
          res.data.forEach((item) => {
            var pp = new GL.Point(item.X+','+item.Y,new GL.Icon.Smart('/static/images/home/center/icons/wrj_p.png', [32, 32]));
            pp.bindPopup(''+
              '<div class="video-con" id="'+item.PID+'_WRJ'+'" onclick="presentFullScreen(\''+item.PID+'_WRJ'+'\')">' +
              '<iframe class="video-item" src="/static/media/html/video.html?channel='+item.CHANNEL+'" frameborder="0"></iframe>' +
              '</div>' +
              '<div class="jk-popup-line"></div>'+
              '',
              {
                className: 'jk-popup',
              })
            curLayer.addOverlay(pp);
          });
        });

      }
      if(item.type=='cldz') {
        this.$service.call(this.$service.url.home.searchCldz,{}).then((res) => {
          res.data.forEach((item) => {
            var pp = new GL.Point(item.X+','+item.Y,new GL.Icon.Smart('/static/images/home/center/icons/cldz_p.png', [32, 32]));
//            pp.bindPopup('<div class="popup-wg-body">' +
//              '<table>' +
//              '<tr><td>'+item.NAME+'</td></tr>' +
//              '</table>' +
//              '</div>',
//              {className: 'popup-wg popup-div-con'})
            pp.on('click',() => {
              showCarPeople({type:'car'});
            });
            curLayer.addOverlay(pp);
          });
        });
      }
      if(item.type=='rxdz') {
        this.$service.call(this.$service.url.home.searchRxdz,{}).then((res) => {
          res.data.forEach((item) => {
            var pp = new GL.Point(item.X+','+item.Y,new GL.Icon.Smart('/static/images/home/center/icons/rxdz_p.png', [32, 32]));
//            pp.bindPopup('<div class="popup-wg-body">' +
//              '<table>' +
//              '<tr><td>'+item.NAME+'</td></tr>' +
//              '</table>' +
//              '</div>',
//              {className: 'popup-wg popup-div-con'})
            pp.on('click',() => {
              showCarPeople({type:'people'});
            });
            curLayer.addOverlay(pp);

          });

        });

      }
      if(item.type=='rlsb') {
        this.$service.call(this.$service.url.home.searchRlsb,{}).then((res) => {
          res.data.forEach((item) => {
            var pp = new GL.Point(item.X+','+item.Y,new GL.Icon.Smart('/static/images/home/center/icons/rlsb_p.png', [32, 32]));
            pp.on('click', (e) => {
              showFace('');
            })
            curLayer.addOverlay(pp);
          });
        });

      }
      if(item.type=='wrd') {
        this.$service.call(this.$service.url.home.searchWrd,{}).then((res) => {
          res.data.forEach((item) => {
            var pp = new GL.Point(item.X+','+item.Y,new GL.Icon.Smart('/static/images/home/center/icons/wrd_p.png', [32, 32]));
            pp.on('click',(e) => {
              showWrdRecord(item.PID);
            })
            curLayer.addOverlay(pp);
          });
        });

      }
      if(item.type=='dt') {
        this.$service.call(this.$service.url.home.searchDt,{}).then((res) => {
          res.data.forEach((item) => {
            var pp = new GL.Point(item.LON+','+item.LAT,new GL.Icon.Smart('/static/images/home/center/icons/dt_p.png', [32, 32]));
            pp.bindPopup('<div class="popup-wg-body">' +
              '<table>' +
              '<tr><td>电台信息：</td><td>'+item.DEVICE_ALIAS+'</td></tr>' +
              '<tr><td>电台速度：</td><td>'+item.SPEED+'</td></tr>' +
              '<tr><td>gps更新时间：</td><td>'+item.GPS_UPDATETIME+'</td></tr>' +
              '</table>' +
              '</div>',
              {className: 'popup-wg popup-div-con'})
            curLayer.addOverlay(pp);
          });
        });
        if(item.checked) {
          this.dsqs[item.type] = setTimeout(() => {
            this.drawLayer(item)
          },5000);
        }
      }

      var wgLayer = this.layersLayer['wg']
      if(wgLayer&&wgLayer!='') {
        wgLayer.bringToFront();
      }
    },
  },
  mounted() {
    window.presentFullScreen =  this.presentFullScreen;
    if (GL.initialized) {
      this.initMap();
    } else {
      GL.init(this.initMap);
    }
  },
}
</script>

<style lang="scss">
@keyframes ani-salce0-1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.gaea-icon-wrap {
  img[src^="/static/images/home/center/icons"] {
    animation: ani-salce0-1 .8s;
    transform: scale(var(--icon-scale-point));
    &:hover {
      transform: scale(1);
    }
  }
}
.point-icon-lz {
  font-size: 16px;
  transform: scale(var(--font-scale-lz));
  font-family: tencentFont;
  text-shadow: 0.2rem 0rem 0.5rem red, -0.2rem 0rem 0.5rem red, 0rem 0.2rem 0.5rem red, 0rem -0.2rem 0.5rem red;
  &:hover {
    animation: ani-font-light 2s infinite;
    transform: scale(1.05);
    transition: scale 1.5s;
  }

}
@keyframes ani-font-light {
  0%, 100% {
    text-shadow: 0.2rem 0rem 0.5rem red, -0.2rem 0rem 0.5rem red, 0rem 0.2rem 0.5rem red, 0rem -0.2rem 0.5rem red;
  }
  50% {
    text-shadow: 0.2rem 0rem 0.5rem #58f1d4, -0.2rem 0rem 0.5rem #edfb10, 0rem 0.2rem 0.5rem #e9ff35, 0rem -0.2rem 0.5rem #7faf20;
  }
}
.title-bg-normal {
  padding: .5em 3em;
  width: 14em;
  text-align: center;
  background: url('/static/images/home/left/title_bg1.png') no-repeat 100%;
  background-size: contain;
  background-position: center;
  cursor: pointer;
  &:hover {
    opacity: .8;
  }
  &.title-bg-active {
    background: url('/static/images/home/left/title_bg2.png') no-repeat 100%;
    background-size: contain;
    background-position: center;
  }
}
.build-icon {
  color: rgba(242, 255, 0, 1);
  cursor: pointer;
  margin-top: -10px;
  margin-left: -5px;
  &:hover {
    transform: scale(1);
  }
}
.gaea-popup-close-button {
  z-index: 1;
}
.leaflet-marker-icon {
  img {
    margin-top: -16px !important;
  }
}
.popup-wg {
  background: rgba(1,1,1,0.8);
  box-shadow: 0 0 15px #00efff, 0 0 15px #00efff inset;
  border-radius: .5em;
  color: white;
  &.popup-div-con {
    margin-bottom: 47px;
  }

  .popup-wg-body {
    > table {
      color: #00DFFF;
      width: 100%;
      .img-con {
        text-align: center;
        img {
          width: 150px;
          transition: all .6s;
          &:hover {
            transform: scale(1.1);
          }
        }
      }

      td {
        padding: .5em;
      }
    }
  }
  .gaea-popup-content-wrapper,.gaea-popup-tip-container,.gaea-popup-tip {
    background: transparent;
    box-shadow: none;
  }
  .gaea-popup-tip {
    background:rgba(1,1,1,0.8);
  }
}
.jk-popup {
  background: url(/static/images/home/center/jk_bg.png) no-repeat;
  background-size: contain;
  bottom: 16px !important;
  left: -60px !important;
  .gaea-popup-content {
    width: 400px !important;
    height: 280px !important;
  }
  .gaea-popup-content-wrapper,.gaea-popup-tip-container,.gaea-popup-tip {
    background: transparent;
    box-shadow: none;
  }
  .gaea-popup-close-button {
    top: -8px !important;
    right: -10px !important;
  }
  .jk-popup-line {
    position: absolute;
    width: 55px;
    height: 1.5px;
    background: #00fff3;
    box-shadow: 0 0 5px #00efff, 0 0 5px #00efff inset;
    border-radius: 3px;
    bottom: 0px;
    left: 33px;
    transform: rotate(-40deg);
  }
  .video-con {
    width: 400px;
    height: 240px;
    padding: .5em;
    padding-top: 1em;
    .video-item {
      pointer-events: none;
      border: none;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
    }
  }

}
.img-xf {
  width: 300px;
  max-height: 450px;
}
</style>
<style lang="scss" scoped>
.Home {
  width: 100%;
  height: 100%;
  background: #101727;
  #map {
    position: relative;
    width: 100%;
    height: 100%;
    background: #101727;
  }
  .drzb-btn {
    z-index: 9999;
    position: absolute;
    font-size: 14px;
    right: 10%;
    top: 6px;
    color: #00DFFF;
    font-weight: bold;
    border-bottom: 1px solid #00f6ff;
    cursor: pointer;
    &:hover {
      opacity: .9;
    }
  }
  .home-head {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background: black;
    z-index: 400;
    color: white;
    font-size: 30px;
    font-weight: bold;
    padding: .5em;
    background: url('/static/images/home/head.png') no-repeat;
    background-size: 100%;
    height: 86px;
    pointer-events: none;
  }
  .layer-con {
    position: absolute;
    z-index: 500;
    bottom: 6%;
    left: calc(50% - 350px);
    width: auto;
    font-size: 14px;
    .layer-item {
      margin: .5em;
      text-align: left;
      line-height: 25px;
      display: inline-block;
      animation: bounceInUpSlef 1.5s;
      .layer-item-check {
        text-align: center;
        width: 50px;
        height: 50px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          border: none;
        }
      }
      .layer-item-label {
        display: inline-block;
        color: white;
      }
      .layer-item-active {
        box-shadow: 0 0 5px #dfff00, 0 0 15px #8c8314 inset;
        border-radius: 2%;
      }
    }

  }
}
@-webkit-keyframes bounceInUpSlef {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }

  75% {
    transform: translate3d(0, 10px, 0);
  }

  90% {
    transform: translate3d(0, -5px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
</style>
