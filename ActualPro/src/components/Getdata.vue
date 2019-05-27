<template>
  <div class="hello">
    <Button type="success" ghost @click="getdata()">点击获取数据库</Button>
    <div>{{this.formLeft.fName}}</div>
    <Button type="success" ghost @click="modal1 = true">点击插入数据</Button>
    <Table border :columns="columns5" :data="giftXueKeList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">修改</Button>
        <Button type="error" size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
    <div>
      <Button type="primary" @click="modal1 = true">Display dialog box</Button>
      <Modal
        v-model="modal1"
        title="添加商品"
        @on-ok="ok"
        @on-cancel="cancel">
         <Form :model="formLeft" label-position="left" :label-width="100">
        <FormItem label="名称">
            <Input v-model="formLeft.fName"/>
        </FormItem>
        <FormItem label="价格">
            <Input v-model="formLeft.fPrice"/>
        </FormItem>
        <FormItem label="描述">
            <Input type="textarea" v-model="formLeft.fDescription"/>
        </FormItem>
        <FormItem label="类别">
            <Input v-model="formLeft.fClass"/>
        </FormItem>
        <FormItem label="库存">
            <Input v-model="formLeft.fSumNum"/>
        </FormItem>
        <FormItem label="原价">
            <Input v-model="formLeft.fOldPrice"/>
        </FormItem>
    </Form>
    </Modal>
    </div>
  </div>
</template>

<script>
export default {
  name: "Getdata",
  data() {
    return {
      giftXueKeList: [],
      self: this,
      modal1: false,
      columns5: [
        {
          title: "Id",
          type: "index",
          sortable: true
        },
        {
          title: "名称",
          key: "fName"
        },
        {
          title: "图片",
          key: "imgsrc",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: params.row.imgsrc
                },
                style: {
                  width: "40px",
                  height: "40px"
                }
              })
            ]);
          }
        },
        {
          title: "描述",
          key: "fDescription"
        },
        {
          title: "库存",
          key: "fSumNum",
          filters: [
            {
              label: "大于20",
              value: 1
            },
            {
              label: "大于20",
              value: 1
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.fSumNum > 20;
            } else if (value === 2) {
              return row.fSumNum < 20;
            }
          }
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      formLeft: {
        fName: "",
        fPrice: "",
        fDescription: "",
        fClass: "",
        fSumNum: "",
        fOldPrice: "",
      }
    };
  },
  computed: {
    imgsrc: function() {
      return "ownerID" + "storeFileName";
    }
  },
  methods: {
    ok() {
      this.InsertData();
      this.$Message.info("提交成功");
    },
    cancel() {
      this.$Message.info("取消操作");
    },
    remove: function(index) {
      this.$http
        .post(
          "http://localhost:8080/baas/mypay/api/deleteTest",
          // 'http://localhost:8080/baas/takeoutAdmin/api/delete_Takeout_class',
          JSON.stringify({
            fID: this.giftXueKeList[index].fID
          }),
          { emulateJSON: true }
        )
        .then(
          function(res) {
            if (res.data.state === "1") {
              this.$Message.success("记录删除成功!");
            } else {
              this.$Message.success("本目录下还有商品在售，暂不能删除!");
            }
            this.getdata();
          },
          function(res) {
            console.log(res.state);
          }
        );
      this.editIndex = -1;
      // const fID = this.giftXueKeList[index].fID
      // alert(this.giftXueKeList[index].fID)
      //  this.$http
      //   .post("http://localhost:8080/baas/mypay/api/deleteTest",
      //   {
      //     params: {
      //       fID: fID
      //     }
      //   })
      //   .then(function(response) {
      //     console.log(response);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
    },
    getdata: function() {
      var that = this;
      this.$http
        .post(
          // "https://www.myyd.xyz/baas/takeoutAdmin/cuisine/queryTakeout_food"
          // "http://marsjoe.work/Baas/xiaodian/mypay/queryTakeout_food",
          "http://localhost:8080/baas/xiaodian/mypay/queryTakeout_food",
          {
            emulateJSON: true
          }
        )
        .then(function(res) {
          var items = new Array();
          for (let i = 0; i < res.data.rows.length; i++) {
            var object = new Object();
            object.fID = res.data.rows[i].fID.value;
            object.fName = res.data.rows[i].fName.value;
            object.fPrice = res.data.rows[i].fPrice.value;
            object.fDescription = res.data.rows[i].fDescription.value;
            object.fSumNum = res.data.rows[i].fSumNum.value;
            object.imgsrc =
              "https://wxwaimai.oss-cn-huhehaote.aliyuncs.com/kyq/" +
              res.data.rows[i].ownerID.value +
              "/" +
              res.data.rows[i].storeFileName.value;
            items[i] = object;
          }
          that.giftXueKeList = items;
        })
        .catch(function() {
          alert("error");
          console.log("服务器异常");
        });
    },
    // InsertData: function() {
    //   this.$ajax
    //     .post(
    //       // 'https://www.myyd.xyz/baas/takeoutAdmin/api/INSERT_Takeout_food',
    //       "http://localhost:8080/baas/mypay/api/insertTest",
    //       JSON.stringify({
    //         fName: this.formLeft.fName
    //         // fPrice: this.formLeft.fPrice,
    //         // fDescription: this.formLeft.fDescription,
    //         // fSellNum: this.formLeft.fSellNum,
    //         // fClass: this.formLeft.fClass,
    //         // storeFileName: this.formLeft.storeFileName,
    //         // ownerID: this.formLeft.ownerID,
    //         // fPID: this.name
    //       }),
    //       { emulateJSON: true }
    //     )
    //     .then(function(res) {
    //       // this.$Message.success("提交成功!");
    //       //   编辑框清空
    //       // this.formLeft.fName = "";
    //       // 重新请求数据
    //       // this.get();
    //       if ((this.formLeft.fName = "")) {
    //         alert("插入失败");
    //       } else {
    //         alert("插入成功");
    //       }
    //     })
    //     .catch(function() {
    //       console.log("服务器异常");
    //     });
    // },
    InsertData: function() {
      // var qs = require("qs");
      // this.$ajax.post(
      //   "http://localhost:8080/baas/mypay/api/insertTest",
      //   qs.stringify({ fName: "小店" }, { indices: false })
      // );
      this.$http
        .get("http://localhost:8080/baas/mypay/api/insertTest", {
          params: {
            fName: this.formLeft.fName,
            fPrice:this.formLeft.fPrice,
            fDescription:this.formLeft.fDescription,
            fClass:this.formLeft.fClass,
            fSumNum:this.formLeft.fSumNum,
            fOldPrice:this.formLeft.fOldPrice
          }
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
