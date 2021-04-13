function prints(log) {
  if (window.console) {
    console.log(log);
  }
}

function GetHttpPath() {
  var js = document.scripts;
  js = js[js.length - 1].src.substring(
    0,
    js[js.length - 1].src.lastIndexOf("/")
  );
  // js=js.substring(js.lastIndexOf(":")-1,js.lastIndexOf("/")+1)
  js = js.substring(0, js.lastIndexOf("/"));
  js = js.substring(0, js.lastIndexOf("/"));
  js = unescape(js);
  return js;
}

function downloadvideplayer(url) {
  window.open(url, "downloadFrame");
  jQuery.ajax({
    url: url,
    type: "POST",
    dataType: "jsonp",
    success: function(result) {
      prints("下载完成");
    },
    error: function() {
      prints("网络异常");
    }
  });
}
