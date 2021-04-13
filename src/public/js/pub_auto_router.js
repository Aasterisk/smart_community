var r = require.context('@/routers',true,/.vue/);
const routers = [];

var paths = [
  r
];
paths.forEach((item) => {
  item.keys().forEach((key) => {
    let c = item(key);
    routers.push({
      path: '/' + c.default.name,
      name: c.default.name,
      component: c.default || c
    })
  });
});
export default routers

