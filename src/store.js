import Vue from 'vue'
import Vuex from 'vuex'

let devFlag = process.env.NODE_ENV === "development";
// let storage = devFlag? localStorage : sessionStorage;
let storage = sessionStorage;
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    devFlag: devFlag,
    user: {}, //用户的所有信息
  },
  mutations: {
    updateUser(state, user) {
      if(user) {
        if(devFlag) {
          console.log(user);
        }
        storage.setItem("user",JSON.stringify(user));
        state.user = user;
        if(user.pid&&user.pid.length > 0) {
          //更新路由,权限
          state.isLogin = true;
        } else {
          state.isLogin = false;
        }
      } else {
        state.user = {};
        state.isLogin = false;
        storage.clear();
      }
    },
  },
  getters: {
    getDevFlag(state) {
      return state.devFlag;
    },
    getUser(state) {
      return state.user;
    },
  },
  actions: {
  }
})
/**初始化用户信息--从session中取--对于刷新*/
function initUser() {
  var user_json = storage.getItem("user");
  if(user_json&&user_json.length>1) {
    store.commit('updateUser', JSON.parse(user_json));
  }
}
initUser();
export default store;
