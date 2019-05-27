<template>
  <div class="hello">
    <div class="top">
      <div class="top-1">
        <div class="row-1">
          <template>
            <div>
              商品编码：
              <Input suffix="ios-search" style="width: auto"/>
            </div>
          </template>
        </div>
        <div class="row-1">
          <template>
            状态：
            <Select v-model="model3" style="width:100px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value"></Option>
            </Select>
          </template>
        </div>
        <div class="row-1">
          <template>
            价格区间：
            <Select v-model="model3" style="width:100px">
              <Option
                v-for="itemPrice in cityListPrice"
                :value="itemPrice.value"
                :key="itemPrice.value"
              ></Option>
            </Select>
          </template>
        </div>
      </div>
      <div class="top-2">
        <div class="row-1">
          <template>
            <div>
              商品名称：
              <Input suffix="ios-search" style="width: auto"/>
            </div>
          </template>
        </div>
        <div class="row-1">
          上架日期：
          <template>
            <Row>
              <Col span="12">
                <DatePicker
                  type="daterange"
                  :options="options2"
                  placement="bottom-end"
                  placeholder="Select date"
                  style="width: 200px"
                ></DatePicker>
              </Col>
            </Row>
          </template>
        </div>
      </div>
      <div class="top-3">
        <div>
          <i-button type="primary" style="width:80px;margin-left:20px;">查询</i-button>
          <i-button type="success" style="width:80px;margin-left:20px;">添加</i-button>
          <i-button type="warning" style="width:80px;margin-left:20px;">上架</i-button>
          <i-button type="warning" style="width:80px;margin-left:20px;">下架</i-button>
        </div>
        <div>
          <template>
            <Page :total="100" show-elevator/>
          </template>
        </div>
      </div>
    </div>
    <div class="bot">
      <template>
        <Table :columns="columns8" :data="data7" size="small" ref="table"></Table>
        <br>
        <Button type="primary" size="large" @click="exportData(1)">
          <Icon type="ios-download-outline"></Icon>Export source data
        </Button>
        <Button type="primary" size="large" @click="exportData(2)">
          <Icon type="ios-download-outline"></Icon>Export sorting and filtered data
        </Button>
        <Button type="primary" size="large" @click="exportData(3)">
          <Icon type="ios-download-outline"></Icon>Export custom data
        </Button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "Getdata1",
  data() {
    return {
      columns8: [
        {
          title: "Name",
          key: "name",
          fixed: "left",
          width: 200
        },
        {
          title: "Show",
          key: "show",
          width: 150,
          sortable: true,
          filters: [
            {
              label: "Greater than 4000",
              value: 1
            },
            {
              label: "Less than 4000",
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.show > 4000;
            } else if (value === 2) {
              return row.show < 4000;
            }
          }
        },
        {
          title: "Weak",
          key: "weak",
          width: 150,
          sortable: true
        },
        {
          title: "Signin",
          key: "signin",
          width: 150,
          sortable: true
        },
        {
          title: "Click",
          key: "click",
          width: 150,
          sortable: true
        },
        {
          title: "Active",
          key: "active",
          width: 150,
          sortable: true
        },
        {
          title: "7, retained",
          key: "day7",
          width: 150,
          sortable: true
        },
        {
          title: "30, retained",
          key: "day30",
          width: 150,
          sortable: true
        }
      ],
      data7: [
        {
          name: "Name1",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },
        {
          name: "Name2",
          fav: 0,
          show: 4720,
          weak: 4086,
          signin: 3792,
          click: 8690,
          active: 8470,
          day7: 8172,
          day30: 5197,
          tomorrow: 1684,
          day: 2593,
          week: 2507,
          month: 1537
        },
        {
          name: "Name3",
          fav: 0,
          show: 7181,
          weak: 8007,
          signin: 8477,
          click: 1879,
          active: 16,
          day7: 2249,
          day30: 3450,
          tomorrow: 377,
          day: 1561,
          week: 3219,
          month: 1588
        },
        {
          name: "Name4",
          fav: 0,
          show: 9911,
          weak: 8976,
          signin: 8807,
          click: 8050,
          active: 7668,
          day7: 1547,
          day30: 2357,
          tomorrow: 7278,
          day: 5309,
          week: 1655,
          month: 9043
        },
        {
          name: "Name5",
          fav: 0,
          show: 934,
          weak: 1394,
          signin: 6463,
          click: 5278,
          active: 9256,
          day7: 209,
          day30: 3563,
          tomorrow: 8285,
          day: 1230,
          week: 4840,
          month: 9908
        },
        {
          name: "Name6",
          fav: 0,
          show: 6856,
          weak: 1608,
          signin: 457,
          click: 4949,
          active: 2909,
          day7: 4525,
          day30: 6171,
          tomorrow: 1920,
          day: 1966,
          week: 904,
          month: 6851
        },
        {
          name: "Name7",
          fav: 0,
          show: 5107,
          weak: 6407,
          signin: 4166,
          click: 7970,
          active: 1002,
          day7: 8701,
          day30: 9040,
          tomorrow: 7632,
          day: 4061,
          week: 4359,
          month: 3676
        },
        {
          name: "Name8",
          fav: 0,
          show: 862,
          weak: 6520,
          signin: 6696,
          click: 3209,
          active: 6801,
          day7: 6364,
          day30: 6850,
          tomorrow: 9408,
          day: 2481,
          week: 1479,
          month: 2346
        },
        {
          name: "Name9",
          fav: 0,
          show: 567,
          weak: 5859,
          signin: 128,
          click: 6593,
          active: 1971,
          day7: 7596,
          day30: 3546,
          tomorrow: 6641,
          day: 1611,
          week: 5534,
          month: 3190
        },
        {
          name: "Name10",
          fav: 0,
          show: 3651,
          weak: 1819,
          signin: 4595,
          click: 7499,
          active: 7405,
          day7: 8710,
          day30: 5518,
          tomorrow: 428,
          day: 9768,
          week: 2864,
          month: 5811
        }
      ],
      options2: {
        shortcuts: [
          {
            text: "1 week",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "1 month",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "3 months",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      cityListPrice: [
        { value: "100-200", label: "100-200" },
        { value: "200-300", label: "200-300" }
      ],
      cityList: [
        {
          value: "未上架",
          label: "未上架"
        },
        {
          value: "已上架",
          label: "已上架"
        }
      ],
      giftXueKeList: [],
      self: this,
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
          title: "电话",
          key: "fTel"
        },
        {
          title: "地址",
          key: "fAddress"
        }
      ]
    };
  },
  computed: {},
  methods: {}
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
.hello {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 10px;
}
.top {
  width: 100%;
  height: 150px;
}
.top-1 {
  width: 100%;
  height: 35%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #666;
}
.top-2 {
  width: 100%;
  height: 35%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-right: 1px solid #666;
  border-left: 1px solid #666;
}
.row-1 {
  width: 25%;
  height: 100%;
  border-right: 1px solid #666;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
}
.bot {
  width: 100%;
  height: 520px;
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
