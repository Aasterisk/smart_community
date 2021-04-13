var h5player = null;
var win_count = 0; //视频窗口总数
var win_hwnd_list = null;
var g_loginfo = null;
var g_channel = null;
var g_servertitle = null;
var installpath = "";

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}

$(function() {
  var issupport = H5Player.isSupported();
  if (!issupport.mseLiveH264Playback) {
    alert("不支持H5VideoPlayer!!");
    return;
  }

  g_channel = getUrlVars()["channel"];
  if (g_channel == null) {
    console.warn("参数异常");
    return;
  }
  H5Player.setupversion(function(result) {
    if (result.isexist == false) {
      //未安装或者未启动本地服务
    } else {
      result.setupver; // 本地服务版本
    }
  });

  if (h5player) {
    h5player.destroy();
  }

  h5player = new H5Player({
    ele: "#video_div",
    layout: "1*1",
    //,wsurl: "ws://172.16.133.103:9122"
    loadingTimeout: -1
    //,enableWasmDecoder:false
    //,reconnectCount: 0
    //,reconnectDuration: 0
    //,h5msUrl: 'http://172.16.133.104:7010'
    //,h5msUrl: 'http://172.16.129.69:7010'
  });

  //该方法可以丢弃，不用执行，多屏播放时用于屏幕处理的。现在是单屏
  win_hwnd_init();

  tvwCamera_dblclick();

  $(window).resize(function() {});
});

function win_load_main() {
  if (!h5player) {
    return;
  }
  var jssdkver = H5Player.version;
  prints("JSSDK Version: " + jssdkver);
  H5Player.setupversion(function(res) {
    prints(res);
    if (!res.isexist) {
      console.warn("服务不存在");
      var path = GetHttpPath() + "/setup/H5VPSetup_1.1.6.exe";
      //downloadvideplayer(path);
    } else if (res.setupver != jssdkver) {
      console.warn(
        "版本不匹配:setupver(" + res.setupver + ")!=(" + jssdkver + ")"
      );
    }
  });

  H5Player.getMacString(prints);
  var key =
    "计算机\\HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\NetPosa\\H5VP Server\\h5vpServer";
  H5Player.getRegistryInfo(key, function(res) {
    prints(res);
    if (res.error == 0) {
      var arr = res.value.split("websocket");
      if (arr && arr[0]) {
        installpath = arr[0];
        prints("安装目录：" + installpath);
      }
    }
  });
  H5Player.getExpandScreenInfo(prints);
  H5Player.getCpuMemory(prints);
}

function win_hwnd_init() {
  var win_count_old = win_count;
  win_count = h5player.layoutCount;
  if (win_hwnd_list == null) {
    win_hwnd_list = new Array();
  }

  if (win_hwnd_list.length < win_count) {
    for (var i = win_hwnd_list.length; i < win_count; i++) {
      var row = {};
      row["type"] = -1; //文件、实时流、录像、PFS、国标实时流、国标录像，0、1、2、3、4、5；
      row["path"] = {};
      row["treenode"] = null;
      win_hwnd_list.push(row);
    }
  }
}

//点击特定流后播放
function tvwCamera_dblclick() {
  var stream = {
    devicetype: "pvgplus",
    user: "vuser",
    password: "kjqb1234",
    ip: "50.147.128.149",
    port: 2015,
    // channel: "av/1/3/32099553001320000002",
    channel: g_channel,
    title: "视频播放系统",
    //title: "金水湾东北角_移动",
    streamtype: "live",
    isptz: true
  };
  //PVG流播放
  playstream(0, stream);
}

function playstream(index, stream) {
  h5player.getCpuMemory(prints);
  _onError = function(type, detail, info) {
    prints("onerror:" + type + "," + detail + "," + info.code);
    //SetBKImage(pos,1);//无法打开
  };

  _onPlaytime = function(current) {
    //prints('onplaytime:'+current);
    //SetBKImage(pos,1);//无法打开
  };

  _onNotify = function(type, detail) {
    prints("onnotify:" + type);
    if (type == "firstcanplay") {
      prints(h5player.getVideoInfo(index));
      if (stream.isptz && stream.streamtype == "live") {
        h5player.setWindowPtz(index, true);
      }
    }
  };
  var callbacks = {
    onerror: _onError,
    onnotify: _onNotify,
    onplaytime: _onPlaytime
  };
  var err = h5player.play(0, stream, callbacks);
  afterPlayStream(index, stream);
}

function afterPlayStream(index, stream) {
  win_hwnd_list[index].path = stream;
  win_hwnd_list[index].devicetype = stream.devicetype;
}
