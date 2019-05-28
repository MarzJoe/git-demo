<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
   
    };
  }
  
};
</script>

<style>
body{
  margin: 0;
  padding: 0;
  height: 100vh;
}
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
  color: white;
}
.color {
  background-color: #515a6e;
  color: white;
  height: 100%;
}
#left {
  width: 240px;
  padding-top: 60px;
}
#right {
  width: 100%;
}
.top-menu {
  width: 100%;
}
.z {
  color: white;
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
</style>
