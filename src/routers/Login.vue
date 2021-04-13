<template>
  <div class="login">
    <div class="login-contain middle-center">
      <div class="login-title">新嘉源小区智慧安防管理平台</div>
      <div class="login-body">
        <table>
          <tr>
            <td>
              <input @keydown.enter="login" type="text" v-model="params.userName" placeholder="请输入用户名">
            </td>
          </tr>
          <tr>
            <td>
              <input @keydown.enter="login" type="password" v-model="params.password" placeholder="请输入密码">
            </td>
          </tr>
          <tr>
            <td><div class="login-btn" @click="login">登录</div></td>
          </tr>
        </table>
      </div>
      <div class="sign">
        <img src="/static/images/login/logo-police.png" class="img-responsive"/>
        <img style="width: 110px;margin-left: 10px;" src="/static/images/login/logo-mininglamp.png" class="img-responsive"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  inject: ['app'],
  data () {
    return {
      params: {
        userName: '',//'lxfj',
        password: '',//'123456',
      },
    }
  },
  methods: {
    login() {
      if(this.params.userName == '' || this.params.password == '') {
        this.$Notice.warning({
          title: '提示',
          desc: '用户名、密码不能为空!!!',
          duration: 3
        });
        return;
      }
      if(this.params.userName == 'admin' && this.params.password == 'longmis') {
        this.$store.commit('updateUser', {...this.params,PID: 123456});
        this.$router.push('/Home');
        return;
      } else if(this.params.userName == 'zhoujiang' && this.params.password == '123123') {
        this.$store.commit('updateUser', {...this.params,PID: 123456});
        this.$router.push('/Home');
        return;
      } else {
        this.$Notice.warning({
          title: '提示',
          desc: '用户名或密码不正确!!!',
          duration: 3
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  color: white;
  background-color: #1fc8db;
  background-image: linear-gradient(141deg,#ffffff 0%,#3fd9ea 51%,#2cb5e8 75%,#345eff 100%);
  background: url('/static/images/login/bg-login.jpg') no-repeat;
  background-size: cover;
  .login-contain {
    top: 40%;
    width: 500px;
    margin: 0 auto;
    .login-title {
      font-size: 38px;
      padding: 1em 0;
      letter-spacing: .01em;
    }
    .login-body {
      width: 80%;
      margin: 0 auto;
      padding: 3em;
      border-radius: .5em;
      background: white;
      box-shadow: 0 2px 10px hsla(0, 0%, 0%, 0.4);
      > table  {
        position: relative;
        width: 80%;
        margin: 0 auto;
        font-size: 18px;
        td {
          text-align: right;
          padding: .2em;
          &:nth-child(1) {
            text-align-last: justify;
          }
        }
        input {
          position: relative;
          display: block;
          width: 100%;
          padding: 11px 10px;
          max-height: 40px;
          background: #fff;
          border: 1px solid #b5b5b5;
          border-radius: 4px;
          font-size: 14px;
          color: #000;
        }
        .login-btn {
          text-align-last: auto;
          text-align: center;
          padding: .5em 1em;
          width: 100%;
          margin: 1em auto;
          border-radius: .5em;
          background: #288DE3;
          color: white;
          font-size: 17px;
          cursor: pointer;
          letter-spacing: .5em;
          &:hover {
            opacity: .8;
          }
        }
      }
    }

  }
  .sign {
    margin-top: 1em;
  }
}
</style>
