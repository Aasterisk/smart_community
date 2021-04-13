import service from '@/public/js/request'

var http = {}
http.url = {
}

var urls = require.context('./urls',true,/.js/);
urls.keys().forEach((item) => {
  var u = urls(item);
  var n = item.replace(/^\.\//,'').replace(/\.\w+$/,'');

  var itemC = u.default || {};
  for (var j in itemC) {
    itemC[j].name = '/' + n + '/' + (itemC[j].method ? itemC[j].method : j)
  }
  http.url[n] = itemC;
});
http.call = (url, data) => {
  data = data || {};
  if (url.type === 'get' || url.type === 'GET') {
    return service({
      url: url.name,
      method: url.type,
      params: data,
      withCredentials: true
    })
  } else {
    return service({
      url: url.name,
      method: url.type,
      withCredentials: true,
      data: data
    })
  }
}
export default http
