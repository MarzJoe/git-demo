<template>
  <div class="hello">
    <div class="login">
      <div class="title">商品后台管理系统</div>
      <form>
        <div>
          <i class="icon iconfont icon-wulumuqishigongandashujuguanlipingtai-ico-"></i>
          <input class="i" type="text" placeholder="请输入用户名/邮箱/手机号">
          <br>
        </div>
        <div>
          <i class="icon iconfont icon-suo"></i>
          <input class="i" type="password" placeholder="请输入密码">
          <br>
        </div>
        <div class="cc">
          <Checkbox :checked.sync="single">记住密码</Checkbox>
          <div style="font-size:13px">忘记密码？</div>
        </div>
        <input type="button" value="登陆" @click="toIndex" class="log">
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    toIndex() {
      const redirect = this.$route.query.redirect;
      if (redirect) {
        //存在回跳地址就回跳
        this.$router.push(redirect);
      } else {
        //否则就跳到默认的首页
        this.$router.push({
          name: "Index"
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cc {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 10px;

}
.s {
  background-color: red;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 16pt;
  margin-bottom: 30px;
}
html {
  width: 100%;
  height: 100%;
}
.hello {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: no-repeat;
  background-size: 100%;
  background-image: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558324957838&di=3a0350bd359cb8234a13c5455e68e068&imgtype=0&src=http%3A%2F%2Fpic141.nipic.com%2Ffile%2F20170919%2F17532204_141654438034_2.jpg");
}
.login {
  margin-left: 400px;
  width: 300px;
  height: 500px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.i {
  margin: 10px 20px 20px 5px;
  height: 35px;
  width: 225px;
}
.log {
  font-size: 12pt;
  margin: 10px 20px 20px 20px;
  height: 35px;
  width: 225px;
}
</style>
