<template>
  <div class="Home">
    <div id="map">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  inject: ['app'],
  data () {
    return {}
  },
  methods: {
    loginout() {
      this.$router.push('/Login');
    },
    initMap() {
      this.initBaseLayer();
      this.villageLayer = new GL.VectorLayer('village');
      this.map.addLayer(this.villageLayer);
    },
    initBaseLayer() {
      if(this.$store.getters.getDevFlag) {
        this.map = new GL.Map('map', {
          center: "120.2686421,31.5816572",
          zoom: 14,
          zoomControl: false,
          scaleControl: false
        });
        // 百度默认提供了多种 style： normal,light,dark,redalert,googlelite,grassgreen,midnight,pink,darkgreen,bluish,grayscale,hardedge
        var baseLayer = GL.LayerLookup.createBaiduTiledLayer(null, { style: 'normal' });
        this.map.addBaseLayer(baseLayer);
        return;
      }
      this.map = new GL.Map("map", {
        center: [120.2686421,31.5816572],
        zoomEffect: false,
        zoom: 7,
        zoomControl: false
      });
      this.baseLayer1 = GL.LayerLookup.createPgisTiledLayer(
        "http://10.35.18.56:8080/PGIS_S_TileMapServer1820/Maps/SL",
        {
          zoomOffset: 8,
          version: "1.0.0",
          maxBounds: "119.53536,31.17233;120.56808,31.75598"
        },
        {
          origin: "-180,90",
          resolutions: [
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            0.0006866455078125,
            0.00034332275390625,
            0.000171661376953125,
            0.0000858306884765625,
            0.00004291534423828125,
            0.000021457672119140625,
            0.000010728836059570312,
            0.000005364418029785156,
            0.000002682209014892578,
            0.000001341104507446289
          ]
        }
      );
      this.baseLayer2 = GL.LayerLookup.createPgisTiledLayer(
        "http://10.35.18.56:8080/PGIS_S_TileMapServer1820/Maps/YX",
        {
          zoomOffset: 8,
          version: "1.0.0",
          maxBounds: "119.53536,31.17233;120.56808,31.75598"
        },
        {
          origin: "-180,90",
          resolutions: [
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            0.0006866455078125,
            0.00034332275390625,
            0.000171661376953125,
            0.0000858306884765625,
            0.00004291534423828125,
            0.000021457672119140625,
            0.000010728836059570312,
            0.000005364418029785156,
            0.000002682209014892578,
            0.000001341104507446289
          ]
        }
      );
      this.baseLayer3 = GL.LayerLookup.createPgisTiledLayer(
        "http://10.35.18.56/PGIS_S_TileMapServer/Maps/PGIS_TDT_SL",
        {
          zoomOffset: 8,
          version: "1.0.0",
          maxBounds: "119.53536,31.17233;120.56808,31.75598"
        },
        {
          origin: "-180,90",
          resolutions: [
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            0.0006866455078125,
            0.00034332275390625,
            0.000171661376953125,
            0.0000858306884765625,
            0.00004291534423828125,
            0.000021457672119140625,
            0.000010728836059570312,
            0.000005364418029785156,
            0.000002682209014892578,
            0.000001341104507446289
          ]
        }
      );

      this.map.addBaseLayer(this.baseLayer1);
      this.map.addBaseLayer(this.baseLayer2);
      this.map.addBaseLayer(this.baseLayer3);

    },
  },
  mounted() {

    if (GL.initialized) {
      this.initMap();
    } else {
      GL.init(this.initMap);
    }
  },
}
</script>

<style lang="scss">

</style>
<style lang="scss" scoped>
.Home {
  width: 100%;
  height: 100%;
  #map {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
