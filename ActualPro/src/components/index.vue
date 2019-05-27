<template>
  <div id="app">
    <div class="container">
      <div id="left">
        <Menu active-name="1-2" :open-names="['1']" class="color">
          <MenuItem class="z" name="1-1">
            <router-link to="/Getdata">Getdata</router-link>
          </MenuItem>
          <MenuItem class="z" name="1-2">
            <router-link to="/HelloWorld">HelloWorld</router-link>
          </MenuItem>
          <MenuItem class="z" name="1-3">
            <router-link to="/InsertData">InsertData</router-link>
          </MenuItem>
          <MenuItem class="z" name="1-4">
            <router-link to="/Getdata1">Getdata1</router-link>
          </MenuItem>
          <MenuItem class="z" name="2-1">
            <router-link to="/login">login</router-link>
          </MenuItem>
          <MenuItem class="z" name="2-2">
            <router-link to="/Jspang">超市管理系统</router-link>
          </MenuItem>
          <MenuItem class="z" name="3-1">Option 7</MenuItem>
          <MenuItem class="z" name="3-2">Option 8</MenuItem>
          <MenuItem class="z" name="4-1">Option 9</MenuItem>
          <MenuItem class="z" name="4-2">Option 10</MenuItem>
          <MenuItem class="z" name="4-3">Option 11</MenuItem>
          <MenuItem class="z" name="4-4">Option 12</MenuItem>
        </Menu>
      </div>
      <div id="right">
        <div id="top">
          <h1>后台商品数据管理系统</h1>
        </div>
        <div class="top-menu"></div>
        <hr>
        <div class="right-content">
          <transition name="fade" mode="out-in">
            <router-view v-if="isRouterAlive"/>
          </transition>
        </div>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
       isRouterAlive: true,
      columns5: [
        {
          title: "序号",
          key: "fID",
          sortable: true
        },
        {
          title: "名称 ",
          key: "fName"
        },
        {
          title: "图片",
          key: "fImg",
          sortable: true
        },
        {
          title: "描述",
          key: "fDresction"
        },
        {
          title: "库存",
          key: "fSum"
        }
      ]
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
.container {
  display: flex;
  flex-direction: row;
  width: 100%;
}
#top {
  width: 100%;
  height: 60px;
  background-color: #515a6e;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color:white;
}
.color {
  background-color: #515a6e;
  color: white;
  height: 100%;
}
#left {
  width: 240px;
  background-color: #515a6e;
}
#right {
  width: 100%;
}
.top-menu {
  width: 100%;
}
.z {
  color: #fff;
  font-size: 11pt;
}
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave {
  opacity: 1;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0.5s;
}
router-link{
  color: white;
}
</style>
