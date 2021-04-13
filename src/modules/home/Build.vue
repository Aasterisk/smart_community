<template>
  <transition
    name="fade"
    enter-active-class="animated flipInY"
    leave-active-class="animated flipOutY"
  >
  <div class="Build" v-if="visible">
    <div style="float: right;margin-top: 4%;margin-right: 2%">
      <a @click="close()"><img style="width: 40px" src="static/images/build/close.svg"></a>
    </div>
    <div class="sq_title">新嘉源智慧社区</div>
    <div style="margin-top: 1.8%;margin-left: 5%">
      <div class="menu" @click="menu = '1'" :style="menu==1?'background: url(\'static/images/build/menu-click.png\');background-size: 100% 100%;':''">楼幢信息</div>
      <div v-show="menu>=2" class="menu" @click="menu = '2'" :style="menu==2?'background: url(\'static/images/build/menu-click.png\');background-size: 100% 100%;':''">住户信息</div>
      <div v-show="menu>=3" class="menu" @click="showRyda()" :style="menu==3?'background: url(\'static/images/build/menu-click.png\');background-size: 100% 100%;':''">人员档案</div>
    </div>
    <div class="build-content" v-show="menu == '1'">
      <div class="build-title">新嘉源{{params}}幢
        <Select v-model="qy" style="width:200px;position: absolute;right: 0;top:10px;" placeholder="企业" @on-change="searchBuild">
          <Option value="">--全部--</Option>
          <Option v-for="item in qys" :value="item.COMPANY" :key="item.COMPANY">{{ item.COMPANY }}</Option>
        </Select>
      </div>
      <div>
        <div class="build-total" style="width: 20%;border-right: #57565d solid 1px">
          <p style="width: 20%;color: rgb(0,214,244);font-size: 16px">总户数</p>
          <p style="width: 20%;color: rgb(207,254,15);font-size: 18px">{{buildTotal.ZHS}}</p>
        </div>
        <div class="build-total" style="width: 30%;border-right: #57565d solid 1px">
          <p style="color: rgb(0,214,244);font-size: 16px">楼层数</p>
          <p style="color: rgb(207,254,15);font-size: 18px">{{buildTotal.LCS}}</p>
        </div>
        <div class="build-total" style="width: 30%;border-right: #57565d solid 1px">
          <p style="color: rgb(0,214,244);font-size: 16px">已入住户数</p>
          <p style="color: rgb(207,254,15);font-size: 18px">{{buildTotal.YRZHS}}</p>
        </div>
        <div class="build-total" style="width: 20%;padding-right: 30px">
          <p style="width: 30%;margin-left: 80%;color: rgb(0,214,244);font-size: 16px">已入住人数</p>
          <p style="width: 30%;margin-left: 80%;color: rgb(207,254,15);font-size: 18px">{{buildTotal.YRZRS}}</p>
        </div>
      </div>
      <div class="build-table">
        <div style="margin-top: 1px" v-for="(item, index) in floorData" :key="index + 'floor'">
          <div class="floor-name">
            <div class="floor-name-bg" :class="{'zdry-red-floor':hasZdry(item)}" @click="showInfo(item.floor)">
              {{item.floor}}
            </div>
          </div>
          <!--<div style="height: 100%;margin-left: 2px;float: left;" :style="'width:' + (89/item.doors.length) + '%'" v-for="(door, doorIndex) in item.doors" :key="doorIndex + 'door'">-->
          <div style="float: left;width: 90%;">
            <div v-if="doorIndex < 8" style="width: 12.3%;height: 115px;margin-left: 2px;float: left;" v-for="(door, doorIndex) in item.doors" :key="doorIndex + 'door'">
              <div @click="floorInfo(item.floor,door.no)" class="floor-no" style="background-color: rgb(13,44,75)" :style="clickFloor==(item.floor + door.no)?'color: rgb(207,254,15)':''" :class="door.ZDRXZ&&door.ZDRXZ!=''?'zdry-up':''">{{door.no}}</div>
              <p @click="floorInfo(item.floor,door.no)" class="floor-no" style="background-color: rgba(17,19,40,0.7)" :style="clickFloor==(item.floor + door.no)?'color: rgb(207,254,15)':''" :class="door.ZDRXZ&&door.ZDRXZ!=''?'zdry-up':''">{{door.COMPANY}}</p>
            </div>
            <div v-if="doorIndex >= 8 && showFloorInfo && (floorNo == item.floor)" class="floor-record" v-for="(door, doorIndex) in item.doors" :key="doorIndex + 'door'">
              <div @click="floorInfo(item.floor,door.no)" class="floor-no" style="background-color: rgb(13,44,75)" :style="clickFloor==(item.floor + door.no)?'color: rgb(207,254,15)':''" :class="door.ZDRXZ&&door.ZDRXZ!=''?'zdry-up':''">{{door.no}}</div>
              <p @click="floorInfo(item.floor,door.no)" class="floor-no" style="background-color: rgba(17,19,40,0.7)" :style="clickFloor==(item.floor + door.no)?'color: rgb(207,254,15)':''" :class="door.ZDRXZ&&door.ZDRXZ!=''?'zdry-up':''">{{door.COMPANY}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="build-content" v-show="menu == '2'">
      <div class="build-title">新嘉源{{params}}幢{{roomNo}}室</div>
      <div style="width: 100%;height: 100%;margin-top: 50px">
        <div class="door-left">
          <div style="color: white;width: 16%;font-size: 16px;margin-top: 1.5%;margin-left: 30px">当前住户</div>
          <div style="width: 100%;height: 55%;overflow: auto">
            <div v-for="(item, index) in nowPeopleData" :key="index + 'people'" style="width: 100%;height: 174px;margin-left: 10px;" :style="index==0?'margin-top: 1.8%':'margin-top: 5%'">
              <div @click="showRyda(item)" class="photo-div">
               <!-- <div style="width: 100%;height: 80%;color: white;font-size: 15px;" v-if="!checkImgExists(imgUrl + item.IDCARD + '.jpg')">暂无图片</div>-->
                <img style="width: 100%;height: 80%"  :src="imgUrl + item.IDCARD + '.jpg'" :onerror="app.noImg"/>
                <div class="ryda">
                  人员档案
                </div>
              </div>
              <div class="people-div" >
                <div class="people-info" style="background-color: rgb(14,48,83)">房间号</div>
                <div class="people-info" style="background-color: rgb(14,48,83)">{{item.ROOM_NO}}</div>
                <div class="people-info" style="background-color: rgb(14,48,83)">联系电话</div>
                <div class="people-info" style="background-color: rgb(14,48,83)">{{item.PHONE}}</div>

                <div class="people-info" style="background-color: rgb(18,24,46)">入住人</div>
                <div class="people-info" style="background-color: rgb(18,24,46)">{{item.NAME}}</div>
                <div class="people-info" style="background-color: rgb(18,24,46)">工作单位</div>
                <div class="people-info" style="background-color: rgb(18,24,46)">{{item.COMPANY}}</div>

                <div class="people-info" style="background-color: rgb(14,48,83)">性别</div>
                <div class="people-info" style="background-color: rgb(14,48,83)">{{item.SEX}}</div>
                <div class="people-info" style="background-color: rgb(14,48,83)">车辆</div>
                <div class="people-info" style="background-color: rgb(14,48,83)">{{item.CAR_NO}}</div>

                <div class="people-info" style="background-color: rgb(18,24,46)">身份证</div>
                <div class="people-info" style="background-color: rgb(18,24,46);" :title="item.IDCARD">{{item.IDCARD}}</div>
                <div class="people-info" style="background-color: rgb(18,24,46)">登记时间</div>
                <div class="people-info" style="background-color: rgb(18,24,46)">{{item.REGISTER_TIME}}</div>
              </div>
            </div>
          </div>

          <div class="lszh">
            历史住户
          </div>
          <div v-if="hisPeopleData.length > 0" style="width: 100%;height: 25%;margin-left: 10px;margin-top: 2%">
            <div class="photo-div">
              <img style="width: 100%;height: 80%" src="static/images/build/people.jpg" :onerror="app.noImg"/>
              <div class="ryda" style="background: url('static/images/build/ryda1.png');background-size: 100% 100%">
                人员档案
              </div>
            </div>
            <div class="people-div">
              <div class="people-info" style="background-color: rgb(14,48,83)">房间号</div>
              <div class="people-info" style="background-color: rgb(14,48,83)">1-601</div>
              <div class="people-info" style="background-color: rgb(14,48,83)">联系电话</div>
              <div class="people-info" style="background-color: rgb(14,48,83)">15652365232</div>

              <div class="people-info" style="background-color: rgb(18,24,46)">入住人</div>
              <div class="people-info" style="background-color: rgb(18,24,46)">王大锤</div>
              <div class="people-info" style="background-color: rgb(18,24,46)">工作单位</div>
              <div class="people-info" style="background-color: rgb(18,24,46)">大禹科技</div>

              <div class="people-info" style="background-color: rgb(14,48,83)">性别</div>
              <div class="people-info" style="background-color: rgb(14,48,83)">男</div>
              <div class="people-info" style="background-color: rgb(14,48,83)">车辆</div>
              <div class="people-info" style="background-color: rgb(14,48,83)">苏J 4RH50</div>

              <div class="people-info" style="background-color: rgb(18,24,46)">身份证</div>
              <div class="people-info" style="background-color: rgb(18,24,46)">320322326652136</div>
              <div class="people-info" style="background-color: rgb(18,24,46)">登记时间</div>
              <div class="people-info" style="background-color: rgb(18,24,46)">2020-01-01</div>
            </div>
          </div>
          <div v-if="hisPeopleData.length == 0" style="width: 100%;height: 25%;margin-left: 10px;margin-top: 2%;font-size: 20px;color: white">
            暂无数据
          </div>
        </div>
        <div class="door-right">
          <div style="color: white;width: 16%;font-size: 16px;margin-top: 1.5%;margin-left: 30px">当月消耗能量</div>
          <div class="consume" style="margin-top: 5%">
            <div class="consume-value" style="padding-top: 20%">0t</div>
            <div class="consume-value" style="height: 10%">当月用水量</div>
          </div>
          <div class="consume" style="margin-top: 15%">
            <div class="consume-value" style="padding-top: 20%">0Kw-h</div>
            <div class="consume-value" style="height: 10%">当月用电量</div>
          </div>
        </div>
      </div>
    </div>
    <div class="build-content" v-show="menu == '3'" style="background-color: rgb(6,22,48);overflow: auto">
      <div class="ry-title" style="margin-top: 0" @click="showContent.ryxx = !showContent.ryxx">
        <p class="ry-title-name">人员信息</p>
        <!--<img style="width: 15px;float: right;margin-right: 15px" :src="showContent.ryxx?'static/images/build/top.png':'static/images/build/bot.png'"/>-->
      </div>
      <div v-show="showContent.ryxx" style="width: 100%;height: 20%;margin-left: 10px;margin-top: 1%">
        <div class="ry-photo-div">
          <img style="width: 100%;height: 100%" :src="imgUrl + rydaData.IDCARD + '.jpg'" :onerror="app.noImg"/>
        </div>
        <div class="people-div people-detail-con">
          <div class="ry-info">姓名</div>
          <div class="ry-info">{{rydaData.NAME}}</div>
          <div class="ry-info">性别</div>
          <div class="ry-info">{{rydaData.SEX}}</div>
          <!--<div class="ry-info">年龄</div>
          <div class="ry-info">{{rydaData.AGE}}</div>-->
          <div class="ry-info">车牌</div>
          <div class="ry-info">{{rydaData.CAR_NO}}</div>
          <div class="ry-info">身份证</div>
          <div class="ry-info">{{rydaData.IDCARD}}</div>

          <div class="ry-info">住址</div>
          <div class="ry-info">新嘉源{{rydaData.BUILD_NO}}幢{{rydaData.ROOM_NO}}室</div>
          <div class="ry-info">工作单位</div>
          <div class="ry-info">{{rydaData.COMPANY}}</div>
          <div class="ry-info">手机MAC</div>
          <div class="ry-info">{{rydaData.MAC}}</div>
          <div class="ry-info">手机IMSI</div>
          <div class="ry-info">{{rydaData.IMSI}}</div>
          <div class="ry-info">紧急联系人</div>
          <div class="ry-info">{{rydaData.FR_XM}}</div>
          <div class="ry-info">紧急联系人电话</div>
          <div class="ry-info">{{rydaData.FR_DH}}</div>

          <div class="ry-info">疫情风险等级</div>
          <div class="ry-info">绿色</div>
          <div class="ry-info">重点人性质</div>
          <div class="ry-info" style="color:red;font-weight: bold">{{rydaData.ZDRXZ}}</div>
        </div>
      </div>
      <div class="ry-title" @click="showContent.xqcrxx = !showContent.xqcrxx">
        <p class="ry-title-name">小区出入信息</p>
        <!--<img style="width: 15px;float: right;margin-right: 15px" :src="showContent.xqcrxx?'static/images/build/top.png':'static/images/build/bot.png'"/>-->
      </div>
      <div v-show="showContent.xqcrxx" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">序号</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">出入方式</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">出入时间</td>
          </tr>
          <tr v-for="(item, index) in xqcrData" :key="index + 'xqcrxx'">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{index+1}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">人脸识别</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.PASS_TIME}}</td>
          </tr>
          <tr v-if="!xqcrData||xqcrData.length < 1">
            <td colspan="3" class="no-data">暂无数据</td>
          </tr>
        </table>
      </div>
      <div class="ry-title" @click="toggleShowState('kmxx')">
        <p class="ry-title-name">开门信息</p>
      </div>
      <div v-show="showContent.kmxx" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">开门时间</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">地点</td>
          </tr>
          <td v-if="kmxxData.length == 0" colspan="5" class="no-data" >暂无数据</td>
          <tr v-for="(item, index) in kmxxData" :key="index + 'kmxx'">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.OPERATE_TIME}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.DEVICE_NAME}}</td>
          </tr>
        </table>
      </div>
      <div class="ry-title" @click="showContent.rlzp = !showContent.rlzp">
        <p class="ry-title-name">人脸抓拍信息</p>
        <!--<img style="width: 15px;float: right;margin-right: 15px" :src="showContent.rlzp?'static/images/build/top.png':'static/images/build/bot.png'"/>-->
      </div>
      <div v-show="showContent.rlzp" style="width: 96%;height: 30%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">序号</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">抓拍时间</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">抓拍照片</td>
          </tr>
          <tr v-if="rlzpData.length == 0">
            <td colspan="3" class="no-data" >暂无数据</td>
          </tr>
          <tr v-for="(item, index) in rlzpData" :key="index + 'rlzp'" class="rlzp-tr">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{index+1}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{dateFormat(new Date(item.TIMESTAMP*1000))}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'"><img style="width: 70px;height: 65px" :src="item.IMAGEURL" :onerror="app.noImg"></td>
          </tr>
        </table>
      </div>
      <div class="ry-title" @click="showContent.txxx = !showContent.txxx">
        <p class="ry-title-name">同行信息</p>
        <!--<img style="width: 15px;float: right;margin-right: 15px" :src="showContent.txxx?'static/images/build/top.png':'static/images/build/bot.png'"/>-->
      </div>
      <div v-show="showContent.txxx" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">姓名</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">性别</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">身份证号</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">同行方式</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">同行时间</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">班次</td>
          </tr>
          <tr v-if="txxxData.length == 0">
            <td colspan="6" class="no-data" >暂无数据</td>
          </tr>
          <tr v-for="(item, index) in txxxData" :key="index + 'xqcrxx'">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.no}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.address}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.crxq}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.type}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.time}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.time}}</td>
          </tr>
        </table>
      </div>
      <!--<div class="ry-title" @click="showContent.tzxx = !showContent.tzxx">
        <p class="ry-title-name">同住信息</p>
        &lt;!&ndash;<img style="width: 15px;float: right;margin-right: 15px" :src="showContent.tzxx?'static/images/build/top.png':'static/images/build/bot.png'"/>&ndash;&gt;
      </div>
      <div v-show="showContent.tzxx" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">姓名</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">性别</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">年龄</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">身份证号码</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">联系方式</td>
          </tr>
          <tr v-if="tzxxData.length == 0">
            <td colspan="5" class="no-data" >暂无数据</td>
          </tr>
          <tr v-for="(item, index) in tzxxData" :key="index + 'xqcrxx'" @click="showRyda(item)">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.NAME}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.SEX}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.AGE}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.IDCARD}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.PHONE}}</td>
          </tr>
        </table>
      </div>-->
      <div class="ry-title" @click="showContent.hcdp = !showContent.hcdp">
        <p class="ry-title-name">火车订票</p>
        <!--<img style="width: 15px;float: right;margin-right: 15px" :src="showContent.hcdp?'static/images/build/top.png':'static/images/build/bot.png'"/>-->
      </div>
      <div v-show="showContent.hcdp" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">火车班次</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">起始站</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">到达站</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">车厢</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">发车日期</td>
          </tr>
          <td v-if="dpxxData.length == 0" colspan="5" class="no-data" >暂无数据</td>
          <tr v-for="(item, index) in dpxxData" :key="index + 'xqcrxx'">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.TRAIN_NO}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.FROM_STATION}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.TO_STATION}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.COACH}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.FCRQ}}</td>
          </tr>
        </table>
      </div>
      <div class="ry-title" @click="showContent.qcdp = !showContent.qcdp">
        <p class="ry-title-name">汽车订票</p>
      </div>
      <div v-show="showContent.qcdp" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">车次</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">起始站</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">到达站</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">出发时间</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">到达时间</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">座位号</td>
          </tr>
          <td v-if="qcdpData.length == 0" colspan="6" class="no-data" >暂无数据</td>
          <tr v-for="(item, index) in qcdpData" :key="index + 'qcdp'">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.TRAINNUMBER}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.STARTSTATION}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.ENDSTATION}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.STARTTIME}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.ENDTIME}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.SEATNUMBER}}</td>
          </tr>
        </table>
      </div>
      <div class="ry-title" @click="showContent.hkdp = !showContent.hkdp">
        <p class="ry-title-name">航空订票</p>
      </div>
      <div v-show="showContent.hkdp" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">航班号</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">起飞机场</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">到达机场</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">出发时间</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">到达时间</td>
          </tr>
          <td v-if="hkdpData.length == 0" colspan="5" class="no-data" >暂无数据</td>
          <tr v-for="(item, index) in hkdpData" :key="index + 'qcdp'">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.FLT_NUMBER}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.SEG_DEPT_CODE}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.SEG_DEST_CODE}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.STA_DEPTTM}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.STA_ARVETM}}</td>
          </tr>
        </table>
      </div>
      <div class="ry-title" @click="showContent.lgxx = !showContent.lgxx">
        <p class="ry-title-name">旅店住宿</p>
      </div>
      <div v-show="showContent.lgxx" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">入住时间</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">退房时间</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">入住地点</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">房间号</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">所属派出所编号</td>
          </tr>
          <td v-if="lgxxData.length == 0" colspan="5" class="no-data" >暂无数据</td>
          <tr v-for="(item, index) in lgxxData" :key="index + 'qcdp'">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.INDATE}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.OUTDATE}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.G_ADDR}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.G_ROOM}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.P_CODE}}</td>
          </tr>
        </table>
      </div>
      <div class="ry-title" @click="showCqdd()">
        <p class="ry-title-name">常去地点</p>
        <!--<img style="width: 15px;float: right;margin-right: 15px" :src="showContent.cqdd?'static/images/build/top.png':'static/images/build/bot.png'"/>-->
      </div>
      <div v-show="showContent.cqdd" style="width: 96%;height: 20%;margin-left: 2%;margin-top: 1%;overflow:auto;">
        <table>
          <tr>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">序号</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">地点</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">MAC信息</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">手机IMSI</td>
            <td style="color: rgb(0,224,253);background-color: rgb(14,48,83)">时间</td>
          </tr>
          <tr v-for="(item, index) in cqddData" :key="index + 'cqdd'">
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.no}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.address}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.mac}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.imsi}}</td>
            <td :style="index%2==1?'background-color: rgb(14,48,83)':'background-color: rgb(18,24,46)'">{{item.time}}</td>
          </tr>
        </table>
      </div>
      <div v-if="showContent.cqdd&&menu == '3'" id="lineMap" style="width: 96%;height: 120%;margin-left: 2%;margin-top: 1%;background: #101727;">
      </div>
    </div>
    <!--<div style="position: absolute;top: 0;width: 400px;height: 250px">
      <iframe style="width: 100%;height: 100%" src="./../../../static/media/html/video.html?channel=av/3/32099500001310000050" frameborder="0"></iframe>
    </div>-->

  </div>
  </transition>
</template>

<script>
export default {
  name: 'Build',
  inject: ['app'],
  data () {
    return {
      qy: '',
      qys: [],
      map: null,
      imgUrl: process.env.fileBaseUrl+'person/',
      clickFloor: '',
      showContent: {
        ryxx: true,
        xqcrxx: true,
        cqdd: false,
        rlzp: false,
        txxx: false,
        tzxx: false,
        hcdp: false,
        qcdp: false,
        hkdp: false,
        lgxx: false,
        kmxx: false,
      },
      visible: false,
      floorNo: '',
      roomNo: '',
      showFloorInfo: false,
      menu: '1',
      floorData: [
        {
          floor: 'F6',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '609',
              name: '王大锤',
            },
            {
              no: '6010',
              name: '王大锤',
            },
            {
              no: '6011',
              name: '王大锤',
            },
            {
              no: '6012',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F5',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F4',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '609',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F3',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F2',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F1',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F6',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F6',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F6',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F6',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        },
        {
          floor: 'F6',
          doors: [
            {
              no: '601',
              name: '王大锤',
            },
            {
              no: '602',
              name: '王大锤',
            },
            {
              no: '603',
              name: '王大锤',
            },
            {
              no: '604',
              name: '王大锤',
            },
            {
              no: '605',
              name: '王大锤',
            },
            {
              no: '606',
              name: '王大锤',
            },
            {
              no: '607',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
            {
              no: '608',
              name: '王大锤',
            },
          ]
        }
      ],
      buildTotal: {
        ZHS: 0,
        LCS: 0,
        YRZHS: 0,
        YRZRS: 0
      },
      xqcrData: [
        /*{
          no: '1',
          address: '南门',
          crxq: '出',
          type: '人脸识别',
          time: '2020-07-01 15:20',
        },
        {
          no: '2',
          address: '南门',
          crxq: '出',
          type: '人脸识别',
          time: '2020-07-01 15:50',
        },
        {
          no: '3',
          address: '南门',
          crxq: '出',
          type: '人脸识别',
          time: '2020-07-01 14:30',
        },
        {
          no: '4',
          address: '南门',
          crxq: '出',
          type: '人脸识别',
          time:  '2020-07-02 14:30',
        },
        {
          no: '5',
          address: '南门',
          crxq: '出',
          type: '人脸识别',
          time: '2020-07-02 16:30',
        },
        {
          no: '6',
          address: '南门',
          crxq: '出',
          type: '人脸识别',
          time: '2020-07-02 16:10',
        }*/
      ],
      cqddData: [
        {
          no: '1',
          address: '泰山路口',
          mac: '10:13:15:13',
          imsi: '未知',
          time: '2020-07-01 12:23'
        },
        {
          no: '2',
          address: '城南超市',
          mac: '10:13:15:13',
          imsi: '未知',
          time: '2020-07-01 12:30'
        },
        {
          no: '3',
          address: '开发区工商银行支行',
          mac: '10:13:15:13',
          imsi: '未知',
          time: '2020-07-01 12:38'
        },
        {
          no: '4',
          address: '东门',
          mac: '10:13:15:13',
          imsi: '未知',
          time: '2020-07-01 12:55'
        },
        /*{
          no: '5',
          address: '开发区工商银行支行',
          mac: '10:13:15:13',
          imsi: '未知',
          time: '2020-01-01 12:23'
        }*/
      ],
      dpxxData: [],
      qcdpData: [],
      hkdpData: [],
      tzxxData: [],
      rlzpData: [],
      lgxxData: [],
      kmxxData: [],
      txxxData: [],
      nowPeopleData: [
        {
          ROOM_NO: '',
          PHONE: '',
          NAME: '',
          COMPANY: '',
          SEX: '',
          CAR_CODE: '',
          IDCARD: '',
          REGISTER_TIME: ''
        }
      ],
      rydaData: {},
      hisPeopleData: [],
      lngLats: [
        {
          label: '泰山路口',
          lng: 120.2227771,
          lat: 33.3654454
        },
        {
          label: '城南超市',
          lng: 120.2248424,
          lat: 33.3666326
        },
        {
          label: '开发区工商银行支行',
          lng: 120.22672,
          lat: 33.3677303
        },
        {
          label: '东门',
          lng: 120.2256846,
          lat: 33.3689041
        },
      ],
      params: {},
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
    //显示
    show(params) {
      this.visible = true;
      this.menu = '1'
      if(params.indexOf('#') > 0){
        params = params.substr(0, params.length - 1)
      }
      this.params = params || {}
      this.clickFloor = ''
      this.floorNo = ''
      this.qy='';
      this.qys= [];
      this.searchBuild();
    },
    searchBuild() {
      let _this = this
      this.$service.call(this.$service.url.build.findBuild, {buildNo: this.params,qy: this.qy}).then((res) => {
        if(res.result != '0') {
          _this.$Notice.warning({
            title: '提示',
            desc: '查询失败！',
            duration: 3
          });
        } else {
          _this.buildTotal = res.data.total
          _this.floorData = res.data.floors
          _this.qys = res.data.qys;
        }
      })
    },
    //关闭
    close() {
      this.visible = false;
    },
    showInfo(floor){
      this.clickFloor = ''
      if(this.floorNo == floor){
        this.showFloorInfo = !this.showFloorInfo
      }else{
        this.showFloorInfo = true
        this.floorNo = floor
      }

    },
    showCqdd(){
      let _this = this
      this.showContent.cqdd = !this.showContent.cqdd
      if(this.showContent.cqdd){
        setTimeout(function () {
          _this.initMap()
        }, 100)
      }
    },
    floorInfo(floor, no){
      this.clickFloor = floor + '' + no
      this.roomNo = no
      this.menu = '2'
      let _this = this
      this.$service.call(this.$service.url.build.findHousehold, {buildNo: _this.params, roomNo: no}).then((res) => {
        if(res.result != '0') {
          _this.$Notice.warning({
            title: '提示',
            desc: '查询失败！',
            duration: 3
          });
        } else {
          _this.nowPeopleData = res.data.nowData
        }
      })
    },
    showRyda(info){
      let _this = this
      this.menu = '3'
      this.showContent = {
        ryxx: true,
        xqcrxx: true,
        cqdd: false,
        rlzp: false,
        txxx: false,
        tzxx: false,
        hcdp: false,
        qcdp: false,
        hkdp: false,
        lgxx: false,
      }
      this.rydaData = info
      this.$service.call(this.$service.url.build.findDpxx, {card: info.IDCARD}).then((res) => {
        if(res.result != '0') {
          _this.$Notice.warning({
            title: '提示',
            desc: '查询失败！',
            duration: 3
          });
        } else {
          _this.dpxxData = res.data
        }
      })
      _this.tzxxData = []
      this.nowPeopleData.forEach(a=>{
        if(a.IDCARD.trim() != info.IDCARD.trim()){
          _this.tzxxData.push(a)
        }
      })
      this.$service.call(this.$service.url.build.findQcdp, {card: info.IDCARD}).then((res) => {
        if(res.result != '0') {
//          _this.$Notice.warning({
//            title: '提示',
//            desc: '查询失败！',
//            duration: 3
//          });
        } else {
          _this.qcdpData = res.data
        }
      })
      this.$service.call(this.$service.url.build.findHkdp, {card: info.IDCARD}).then((res) => {
        if(res.result != '0') {
//          _this.$Notice.warning({
//            title: '提示',
//            desc: '查询失败！',
//            duration: 3
//          });
        } else {
          _this.hkdpData = res.data
        }
      })
      this.$service.call(this.$service.url.build.findLgxx, {card: info.IDCARD}).then((res) => {
        if(res.result != '0') {
//          _this.$Notice.warning({
//            title: '提示',
//            desc: '查询失败！',
//            duration: 3
//          });
        } else {
          _this.lgxxData = res.data
        }
      })
      this.$service.call(this.$service.url.build.searchKmxx, {card: info.IDCARD}).then((res) => {
        _this.kmxxData = res.data
      })

      this.$service.call(this.$service.url.build.searchXqcr, {card: info.IDCARD}).then((res) => {
        _this.xqcrData = res.data
      })
      this.$service.call(this.$service.url.build.searchRlzp, {card: info.IDCARD}).then((res) => {
        _this.rlzpData = res.data
      })
    },
    toggleShowState(state) {
      this.showContent[state] = !this.showContent[state]
      this.$forceUpdate()
    },
    initBaseLayer() {
      var center = '120.2242523,33.3667402';

      this.map = new GL.Map('lineMap', {
        zoom: 17,
        center: center,
        zoomControl: false,
        scaleControl: false
      });
      var url = process.env.mapUrlArcgis;
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
//      var layer = new GL.EsriMapServerLayer(url,{
//        maxBounds: '119.89,30.75;121.406,35.08',
//        maxZoom: 19,
//        minZoom: 16,
//      },);
//      this.map.addLayer(layer);
    },
    initMap() {
      /*this.map = new GL.Map('lineMap', {
        center: '120.6114,31.27683',
        zoomControl: false,
        scaleControl: false,
        zoom: 1
      });

      let crs = {"resolutions":[0.000761427507662348,0.000380713753831174,0.000190356876915587,0.0000951784384577936,0.0000475892192288968,0.0000237946096144484,0.0000118973048072242,0.0000059486524036121,0.0000029743262572878492],"origin":"-400,400"};
      let options = {
        maxBounds:"119.89,30.75;121.406,32.08",
      };

      let baseLayer = GL.LayerLookup.createGaeaTiledLayer(
        'http://img2.sz-map.com/Layers20160414/Layers/_alllayers',
        Object.assign({}, options, { zIndex: 50}),
        crs
      );
      this.map.addBaseLayer(baseLayer);*/
      this.initBaseLayer();
      let vectorLayer = new GL.VectorLayer();
      this.map.addLayer(vectorLayer);
      let i = 0
      let lngLat = ''
      this.lngLats.forEach(a=>{
        i++
        let point = new GL.Point(
          [a.lng, a.lat],
          new GL.Icon.Smart('static/images/build/0001.png', [32, 32])
        );

        point.bindLabel(a.label,{
          offset: [0, 1],
          className: 'cqdd-div'
        });
        vectorLayer.addOverlay(point);
        lngLat = lngLat + a.lng + ',' + a.lat + ';'
      })
      let polyline = new GL.Polyline(lngLat);
      vectorLayer.addOverlay(polyline);
    },
    checkImgExists(imgurl) {
      let ImgObj = new Image(); //判断图片是否存在
      ImgObj.src = imgurl;
      //存在图片
      if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        return true;
      } else {
        return false;
      }
    },
    hasZdry(item) {
      if(item.doors&&item.doors.length > 0) {
        for(var i in item.doors) {
          if(item.doors[i].ZDRXZ&&item.doors[i].ZDRXZ!='') {
            return true;
          }
        }
      }
      return false

    },
  },
  mounted() {
//    console.log(this.checkImgExists('http://58.210.98.62:9002/imgs/person/320902199709188539.jpg'))
    //GL.init(this.initMap, '/examples/static/conf.json');
  },
}
</script>

<style lang="scss" scoped>
  .Build {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: url("./../../../static/images/build/bg.png");
    background-size: 100% 100%;
  }
  div::-webkit-scrollbar{
    width:3px;
    height:3px;
    /**/
  }
  div::-webkit-scrollbar-track{
    background: rgb(4,89,143);
    border-radius:2px;
  }
  div::-webkit-scrollbar-thumb{
    background: rgb(14,48,83);
    border-radius:3px;
  }
  .sq_title{
    width: 10%;
    float: left;
    text-align: left;
    margin-left: 3%;
    margin-top: 2%;
    font-size: 16px;
    color: rgb(0,214,244);
  }
  .menu{
    width: 7%;
    height: 30px;
    color: black;
    font-weight: bold;
    font-size: 16px;
    text-align: left;
    float: left;
    background: url("./../../../static/images/build/menu-bg.png");
    background-size: 100% 100%;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .build-content{
    width: 90%;
    height: 80%;
    margin-left: 5%;
    margin-top: 5%;
  }
  .build-title{
    width: 100%;
    height: 45px;
    text-align: center;
    color: rgb(2,222,253);
    font-size: 25px;
    margin-bottom: 20px;
    background: url("./../../../static/images/build/title-bg.png");
    background-size: 100% 100%;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .build-total{
    height: 30px;
    width: 25%;
    float: left;
  }
  .build-table{
    width: 100%;
    height: 90%;
    margin-top: 4%;
    font-size: 15px;
    color: white;
    overflow:auto;
  }
  .floor-name{
    width: 8.9%;
    height: 115px;
    background-color: rgb(7,39,78);
    float: left;
    line-height: 100%;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .floor-no{
    width: 100%;
    height: 50%;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .door-left{
    width: 43%;;
    height: 90%;
    margin-left: 3%;
    float: left;
    background: url("./../../../static/images/build/zh-bg.png");
    background-size: 100% 100%;
  }
  .door-right{
    width: 43%;;
    height: 90%;
    margin-right: 3%;
    float: right;
    background: url("./../../../static/images/build/zh-bg.png");
    background-size: 100% 100%;
  }
  .photo-div{
    width: 18%;
    height: 100%;
    float: left;
  }
  .people-div{
    width: 80%;
    height: 100%;
    margin-left: 0.5%;
    float: left;
    &.people-detail-con {
      > .ry-info {
        margin: 1px 0;
        &:nth-child(old) {
          color:white !important;
        }
        &:nth-child(even) {
          background-color: rgb(14,48,83) !important;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
      }

    }

  }
  .people-info{
    width: 24%;
    height: 25%;
    margin-left: 2px;
    font-size: 15px;
    color: rgb(0,224,253);
    float: left;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .consume{
    width: 36%;;
    height: 32%;
    margin-left: 32%;
    color: rgb(22,231,252);
    font-size: 18px;
    background: url("./../../../static/images/build/consume.png");
    background-size: 100% 100%;
  }
  .ry-title{
    width: 100%;
    height: 4%;
    margin-top: 1%;
    color: white;
    font-size: 15px;
    background: url("./../../../static/images/build/ry-title.png");
    background-size: 100% 100%;
  }
  .ry-title-name{
    float: left;
    height: 100%;
    margin-left: 30px;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .ry-info{
    width: 16.5%;
    height: 25%;
    margin-left: 2px;
    font-size: 15px;
    color: rgb(0,224,253);
    float: left;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .ry-photo-div{
    width: 7%;
    height: 100%;
    float: left;
    margin-left: 80px;
    margin-right: 80px;
  }
  .ryda{
    width: 100%;
    height: 20%;
    color: white;
    font-size: 15px;
    background: url('./../../../static/images/build/ryda.png');
    background-size: 100% 100%;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .lszh{
    color: white;
    width: 100%;
    height: 6%;
    padding-left: 58px;
    font-size: 16px;
    margin-top: 3%;
    text-align: left;
    background: url('./../../../static/images/build/yh-bg.png');
    background-size: 100% 100%;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-align: center;
  }
  .consume-value{
    width: 100%;
    height: 90%;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .floor-name-bg{
    width: 100px;
    height: 60px;
    font-size: 20px;
    background: url('./../../../static/images/build/floor.png');
    background-size: 100% 100%;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .no-data{
    color: white;
    height: 110px;
    line-height: 110px;
  }
  table{
    width: 100%;
    height: 100%;
    font-size: 15px;
    overflow: auto;
    tr{
      td{
        width: 19%;
        height: 42.5px;
        line-height: 42.5px;
        color: white;
        border-right: rgb(0,5,27) solid 2px;
      }
    }
  }
  .zdry-up{
    background: red !important;
    color: white !important;
  }
  .floor-record{
    width: 12.3%;
    height: 115px;
    margin-left: 2px;
    float: left;
  }
  @keyframes floor-record
  {
    0% {height: 0;}
    100% {height: 136px;}
  }
  .rlzp-tr {
    td {
      height: 70px !important;
      line-height: 70px !important;
      vertical-align: middle;
    }
  }
  .zdry-red-floor {
    color: red;
    font-weight: bold;
  }
</style>
<style lang="scss">

  .ivu-select-selection,.ivu-select-dropdown{
    border: none !important;
    background: transparent !important;
    box-shadow: 0 0 5px #081c1d, 0 0 5px #00efff inset !important;
    color: white !important;
  }
  .ivu-select-dropdown {
    background: rgba(1,1,1,.9) !important;
  }
  .ivu-select-item {
    color: white !important;
  }
  .ivu-select-item-selected, .ivu-select-item-selected:hover,.ivu-select-item:hover {
    color: #00efff !important;
    background: rgba(21, 203, 232, 0.8);
  }
</style>
