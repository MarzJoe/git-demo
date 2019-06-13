<template>
  <div class="container">
    <div class="container-top">
      <span>乐学商品管理系统</span>
    </div>
    <div class="container-mid">
      <div class="shop">
        <div class="left">
          <Menu :theme="theme3" active-name="1" style="width:100%">
              <MenuItem name="1" to="/productmanger">
                <Icon type="md-document"/>商品管理
              </MenuItem>
              <MenuItem name="2" to="/ordermanger">
                <Icon type="md-chatbubbles"/>订单管理
              </MenuItem>
          </Menu>
        </div>
        <div class="right">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div class="container-bot">2011-2016 &copy; TalkingData</div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      theme3:"dark"
    }
  },
  computed: {},
  methods: {
    },
  // getdata:function(){
  //   this.$ajax.get(
  //     'https://www.myyd.xyz/baas/takeoutAdmin/cuisine/queryTakeout_food'
  //   )
  //   .then(r=>{
  //     if(r.status === 200){
  //       console.log(r.data,'r.data.data');
  //       const {rows,} = r.data;
  //       this.giftXueKeList = rows
  //         && rows.length>0
  //         && rows.map(m=>{
  //           const imgsrc = `https://wxwaimai.oss-cn-huhehaote.aliyuncs.com/kyq/${m.ownerID.value}/${m.storeFileName.value}`
  //           return {
  //             fName: m.fName.value,
  //             fPrice: m.fPrice.value,
  //             fDescription:m.fDescription.value,
  //             fSumNum:m.fSumNum.value,
  //             imgsrc,
  //           };
  //         })
  //         console.log(this.giftXueKeList,'ddddd');
  //     }
  //   })
  //   .catch(function(){
  //     console.log('服务器异常')
  //   })
  // }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.container-top {
  height: 8%;
  width: 100%;
  background-color: #515a6e;
    color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.container-mid {
  height: 87%;
  width: 100%;
  background-color: gold;
}
.container-bot {
  text-align: center;
  /* color: #9ea7b4; */
  /* background-color: red; */
  margin-bottom: 0;
  height: 5%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.color {
  width: 100%;
  padding: 0;
}
.z {
  width: 100%;
  margin: 0;
}
.shop {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.left {
  width: 10%;
  height: 100%;
}
.right {
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 10px;
}
.top {
  width: 100%;
  height: 25%;
}
.top-1 {
  width: 100%;
  height: 35%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #666;
  box-sizing: border-box;
}
.top-2 {
  width: 100%;
  height: 35%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-right: 1px solid #666;
  border-left: 1px solid #666;
  box-sizing: border-box;
}
.row-1 {
  width: 25%;
  height: 100%;
  border-right: 1px solid #666;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.top-3 {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 25px;
  border: 1px solid #666;
  box-sizing: border-box;
}
.bot {
  width: 100%;
  height: 75%;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
