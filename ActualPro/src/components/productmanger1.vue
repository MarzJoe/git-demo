<template>
  <div class="shop">
    <Modal v-model="modal1" title="添加商品" @on-ok="ok" @on-cancel="cancel">
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
    <div class="right">
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
                <Input suffix="ios-search" style="width: auto" v-model="pName" @keyup.enter="query"/>
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
            <!-- <i-button type="primary" style="width:80px;margin-left:20px;" @click="query" >查询</i-button> -->
            <i-button type="success" style="width:80px;margin-left:20px;" @click="modal1 = true">添加</i-button>
            <i-button type="warning" style="width:80px;margin-left:20px;">上架</i-button>
            <i-button type="warning" style="width:80px;margin-left:20px;">下架</i-button>
          </div>
          <div>
            <template>
              <Page
                :total="dataCount"
                :page-size="pageSize"
                show-total
                @on-change="changepage"
                show-elevator
              />
              <!-- <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total 
              placement="top" @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>-->
            </template>
          </div>
        </div>
      </div>
      <div class="bot">
        <i-table
          border
          :height="talbleH"
          :columns="columns"
          :data="products"
          :rowClassName="rowClassName"
        >
          <template slot-scope="{ row, index }" slot="action">
            <div v-if="editIndex === index">
              <Button @click="handleSave(index)">保存</Button>
              <Button @click="handleDelete(index)">删除</Button>
              <Button @click="editIndex = -1">取消</Button>
            </div>
            <div v-else>
              <Button @click="handleEdit(row, index)">操作</Button>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="fName">
            <Input type="text" v-model="editfName" v-if="editIndex === index"/>
            <span v-else>{{ row.fName }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fSellNum">
            <Input type="text" v-model="editfSellNum" v-if="editIndex === index"/>
            <span v-else>{{ row.fSellNum }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fDescription">
            <Input type="text" v-model="editfDescription" v-if="editIndex === index"/>
            <span v-else>{{ row.fDescription }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fPrice">
            <Input type="text" v-model="editfPrice" v-if="editIndex === index"/>
            <span v-else>{{ row.fPrice }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fClassName">
            <!-- <Input type="text" v-model="editfClassName" v-if="editIndex === index"/> -->
            <Select v-model="editfClassName" v-if="editIndex === index">
              <Option :value="item.value" v-for="item in classes" :key="item.value">{{item.label}}</Option>
            </Select>
            <template v-else>
              <span
                v-for="item in classes"
                :key="item.value"
                v-if="row.fClass===item.value"
              >{{ item.label }}</span>
            </template>
          </template>
          <template slot-scope="{ row, index }" slot="imgsrc">
            <uposs @myImgFunc="getImgParams" v-model="editimgsrc" v-if="editIndex === index">99</uposs>
            <img v-else :src="row.imgsrc" style="width:40px;height:40px;">
          </template>
        </i-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'productmanger',
  data() {
    return {
      pName: '',
      talbleH: '',
      name: '',
      // 对话框显示----状态数据
      ShowState: false,
      // 状态按钮（增加记录）所在div----高度
      addH: '',
      // 表单数据对象
      formLeft: {
        fName: '',
        fDescription: '',
        fSellNum: '',
        fPrice: '',
        fClass: '',
        storeFileName: '',
        ownerID: ''
      },
      // 表单数据规则对象
      ruleClass: {
        fName: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
        fDescription: [
          { required: true, message: '请填写商品简介', trigger: 'blur' }
        ],
        fSellNum: [
          { required: true, message: '请填写商品库存', trigger: 'blur' }
        ],
        fPrice: [
          { required: true, message: '请填写商品价格', trigger: 'blur' }
        ],
        fClass: [
          { required: true, message: '请填写商品类别名称', trigger: 'blur' }
        ]
      },
      talbleH: '',
      currentId: '',
      currentScore: '',
      isSpinShow: false,
      // 模拟数据（不带value）
      products: [],
      classes: [],
      self: this,
      // 列定义
      columns: [
        {
          title: '名称',
          align: 'left',
          slot: 'fName',
          width: '100'
        },
        {
          title: '描述',
          align: 'left',
          slot: 'fDescription',
          width: '400'
        },

        {
          title: '图片',
          slot: 'imgsrc',
          align: 'center',
          width: '200'
        },
        {
          title: '库存',
          align: 'left',
          slot: 'fSellNum',
          width: '80',
          sortable: true,
          key: 'fSellNum'
        },
        {
          title: '价格',
          slot: 'fPrice',
          align: 'left',
          sortable: true,
          width: '100',
          key: 'fPrice',
          filters: [
            {
              label: '大于0.03',
              value: 1
            },
            {
              label: '小于0.03',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.fPrice > 0.03
            } else if (value === 2) {
              return row.fPrice < 0.03
            }
          }
        },
        {
          title: '类别',
          align: 'left',
          slot: 'fClassName',
          width: '100',
          sortable: true,
          key: 'fClass',
          filters: [],
          filterMultiple: false,
          filterMethod(value, row) {
            return row.fClass === value
          }
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      editIndex: -1, // 当前聚焦的输入框的行数
      editfName: '', // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
      editimgsrc: '', // 第二列输入框
      editfPrice: '', // 第三列输入框
      editAddimgsrc: '',
      editfDescription: '',
      editfSellNum: '',
      editAddress: '',
      ownerID: '',
      storeFileName: '',
      tempImg: '',
      formLeft: {
        fName: '',
        fPrice: '',
        fDescription: '',
        fClass: '',
        fSumNum: '',
        fOldPrice: ''
      },
      formLeftChange: {
        fName: '',
        fPrice: '',
        fDescription: '',
        fClass: '',
        fSumNum: '',
        fOldPrice: ''
      },
      modal1: false,
      modal2: false,
      showList: [],
      dataCount: 1,
      pageSize: 8,
      model3: '',
      columns8: [
        {
          title: 'Id',
          type: 'index',
          sortable: true
        },
        {
          title: '名称',
          key: 'fName'
        },
        {
          title: '图片',
          key: 'imgsrc',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.imgsrc
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
            ])
          }
        },
        {
          title: '描述',
          key: 'fDescription'
        },
        {
          title: '库存',
          key: 'fSumNum',
          filters: [
            {
              label: '大于20',
              value: 1
            },
            {
              label: '大于20',
              value: 1
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.fSumNum > 20
            } else if (value === 2) {
              return row.fSumNum < 20
            }
          }
        },
        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
  
      giftXueKeList: [],
      options2: {
        shortcuts: [
          {
            text: '1 week',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '1 month',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: '3 months',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      },
      cityListPrice: [
        { value: '100-200', label: '100-200' },
        { value: '200-300', label: '200-300' }
      ],
      cityList: [
        {
          value: '未上架',
          label: '未上架'
        },
        {
          value: '已上架',
          label: '已上架'
        }
      ],
      ajaxHistoryData: [],
      ajaxHistoryDataQuery: [],
      self: this,
      columns5: [
        {
          title: 'Id',
          type: 'index',
          sortable: true
        },
        {
          title: '名称',
          key: 'fName'
        },
        {
          title: '电话',
          key: 'fTel'
        },
        {
          title: '地址',
          key: 'fAddress'
        }
      ]
    }
  },
  computed: {
    wt() {
      return window.innerWidth * 0.9 - 20
    }
  },
  mounted() {
    this.talbleH = window.innerHeight * 0.865 * 0.75
  },
  watch: {
    pName(curVal, oldVal) {
    

    //  if(oldVal!=''&&curVal=='')
    //  this.getdata()
    //  else
     {
       this.pName=curVal
      //  alert(this.pName)
       this.query()
     }
     
   
    }
  },
  methods: {
    query() {
      let that = this
      if (that.pName != '') {
        var items2 = new Array()

        for (let i = 0; i < that.ajaxHistoryData.length; i++) {
           if ((that.ajaxHistoryData[i].fName).indexOf(that.pName)>=0) {
            // alert(that.ajaxHistoryData[i].fName+)
            //  if (that.ajaxHistoryData[i].fName===that.pName) {
            items2.push(that.ajaxHistoryData[i])
          }
        }

        // alert(items.length);
        that.ajaxHistoryDataQuery = items2

        that.dataCount = that.ajaxHistoryDataQuery.length
        // //总条数
        if (that.dataCount < that.pageSize) {
          that.products = that.ajaxHistoryDataQuery
        } else {
          that.products = that.ajaxHistoryDataQuery.slice(0, that.pageSize)
        }
      } else {
        that.getdata()
      }
    },
    handleSave(index) {
      // 编辑框的信息保存到静态数组products
      this.products[index].fName = this.editfName
      this.products[index].fPrice = this.editfPrice
      this.products[index].imgsrc = this.editimgsrc
      this.products[index].fDescription = this.editfDescription
      this.products[index].fSellNum = this.editfSellNum
      this.products[index].fClass = this.editfClassName
      // this.products[index].address = this.editAddress
      // 用编辑框里的值修改数据库记录值
      // if (this.ownerID === '') {
      //   this.ownerID = row.ownerID
      //   this.storeFileName = row.storeFileName
      // }
      if (this.ownerID != '') {
        this.$http
          .post(
            'https://www.myyd.xyz/baas/takeoutAdmin/api/update_Takeout_food',
            JSON.stringify({
              fID: this.products[index].fID,
              fName: this.editfName,
              fPrice: this.editfPrice,
              fDescription: this.editfDescription,
              fSellNum: this.editfSellNum,
              fClass: this.editfClassName,
              ownerID: this.ownerID,
              storeFileName: this.storeFileName
            }),
            { emulateJSON: true }
          )
          .then(
            function(res) {
              // document.write(res.state)
            },
            function(res) {
              console.log(res.state)
            }
          )
      } else {
        this.$http
          .post(
            'https://www.myyd.xyz/baas/takeoutAdmin/api/update_noimage_Takeout_food',
            JSON.stringify({
              fID: this.products[index].fID,
              fName: this.editfName,
              fPrice: this.editfPrice,
              fDescription: this.editfDescription,
              fSellNum: this.editfSellNum,
              fClass: this.editfClassName
            }),
            { emulateJSON: true }
          )
          .then(
            function(res) {
              // document.write(res.state)
            },
            function(res) {
              console.log(res.state)
            }
          )
      }

      this.editIndex = -1
    },
    // 删除商品
    handleDelete(index) {
      this.$http
        .post(
          'https://www.myyd.xyz/baas/takeoutAdmin/api/delete_Takeout_food',
          // 'http://localhost:8080/baas/takeoutAdmin/api/delete_Takeout_class',
          JSON.stringify({
            fID: this.products[index].fID
          }),
          { emulateJSON: true }
        )
        .then(
          function(res) {
            if (res.data.state === '1') {
              this.getdata()
              this.$Message.success('记录删除成功!')
            } else {
              this.$Message.success('本目录下还有商品在售，暂不能删除!')
            }
          },
          function(res) {
            console.log(res.state)
          }
        )
      this.editIndex = -1
    },
    // 操作---按钮
    handleEdit(row, index) {
      // 模拟数据==》编辑数据
      this.editfName = row.fName
      this.editfPrice = row.fPrice
      this.editimgsrc = row.imgsrc
      this.editfDescription = row.fDescription
      this.editfSellNum = row.fSellNum
      this.editfClassName = row.fClass
      // this.editBirthday = row.birthday
      // 记录当前行号
      //  this.classes=this.columns[5].filters

      this.editIndex = index
    },
    get: function() {
      if (this.isSpinShow === false) {
        this.isSpinShow = true
        this.$http
          .post(
            // 'https://www.myyd.xyz/baas/takeoutAdmin/cuisine/queryTakeout_food',
            'http://localhost:8080/baas/takeoutAdmin/cuisine/queryTakeout_food',
            JSON.stringify({
              // filter: 'fPID like ' + this.name
            }),
            {
              emulateJSON: true
            }
          )
          .then(function(res) {
            var items = new Array()
            for (let i = 0; i < res.data.rows.length; i++) {
              var object = new Object()
              object.fID = res.data.rows[i].fID.value
              object.fName = res.data.rows[i].fName.value
              object.fPrice = res.data.rows[i].fPrice.value
              object.fDescription = res.data.rows[i].fDescription.value
              object.fSellNum = res.data.rows[i].fSellNum.value
              object.fClass = res.data.rows[i].fClass.value
              object.imgsrc =
                'https://wxwaimai.oss-cn-huhehaote.aliyuncs.com/kyq/' +
                res.data.rows[i].ownerID.value +
                '/' +
                res.data.rows[i].storeFileName.value
              object.ownerID = res.data.rows[i].ownerID.value
              object.storeFileName = res.data.rows[i].storeFileName.value
              items[i] = object
            }
            this.products = items
            this.isSpinShow = false
          })
          .then(function() {
            this.$http
              .post(
                'https://www.myyd.xyz/baas/takeoutAdmin/api/queryTakeout_foodclass',
                {
                  emulateJSON: true
                }
              )
              .then(function(res) {
                var myclassitems = new Array()
                for (let i = 0; i < res.data.rows.length; i++) {
                  var object = new Object()
                  object.value = res.data.rows[i].fID.value
                  object.label = res.data.rows[i].fName.value
                  myclassitems[i] = object
                }
                this.classes = myclassitems
                this.columns[5].filters = myclassitems
                console.log('tag', this.classes)
              })
              .catch(function() {
                alert('error')
                console.log('服务器异常')
                // this.isSpinShow = false
              })
          })
          .catch(function() {
            alert('error')
            console.log('服务器异常')
            this.isSpinShow = false
          })
      }
    },
    rowClassName(row, index) {
      return 'demo-table-info-row'
    },
    change: function() {
      this.$http
        .get(
          'https://marsjoe.work/Baas/mypay/api/updateTest',
          JSON.stringify({
            fID: this.giftXueKeList[index].fID,
            fName: this.formLeft.fName,
            fPrice: this.formLeft.fPrice,
            fDescription: this.formLeft.fDescription,
            fClass: this.formLeft.fClass,
            fSumNum: this.formLeft.fSumNum,
            fOldPrice: this.formLeft.fOldPrice
          })
        )
        .then(function(response) {
          console.log(response)
          this.getdata()
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    InsertData: function() {
      // var qs = require("qs");
      // this.$ajax.post(
      //   "http://localhost:8080/baas/mypay/api/insertTest",
      //   qs.stringify({ fName: "小店" }, { indices: false })
      // );
      this.$http
        .get('https://www.myyd.xyz/baas/takeoutAdmin/api/INSERT_Takeout_food', {
          params: {
            fName: this.formLeft.fName,
            fPrice: this.formLeft.fPrice,
            fDescription: this.formLeft.fDescription,
            fClass: this.formLeft.fClass,
            fSumNum: this.formLeft.fSumNum,
            fOldPrice: this.formLeft.fOldPrice
          }
        })
        .then(function(response) {
          console.log(response)
          this.getdata()
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    ok() {
      this.InsertData()
      this.$Message.info('添加成功')
    },
    cancel() {
      this.$Message.info('取消操作')
    },
    okChange() {
      this.change()
      this.$Message.info('添加成功')
    },
    cancelChange() {
      this.$Message.info('取消操作')
    },
    remove: function(index) {
      this.$http
        .post(
          'https://marsjoe.work/Baas/mypay/api/deleteTest',
          // 'http://localhost:8080/baas/takeoutAdmin/api/delete_Takeout_class',
          JSON.stringify({
            fID: this.giftXueKeList[index].fID
          }),
          { emulateJSON: true }
        )
        .then(
          function(res) {
            if (res.data.state === '1') {
              this.$Message.success('记录删除成功!')
            } else {
              this.$Message.success('本目录下还有商品在售，暂不能删除!')
            }
            this.getdata()
          },
          function(res) {
            console.log(res.state)
          }
        )
      this.editIndex = -1
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
      var that = this
      this.$http
        .post(
          'https://www.myyd.xyz/baas/takeoutAdmin/cuisine/queryTakeout_food',
          // 'http://marsjoe.work/Baas/xiaodian/mypay/queryTakeout_food',
          // "http://localhost:8080/baas/xiaodian/mypay/queryTakeout_food",
          {
            emulateJSON: true
          }
        )
        .then(function(res) {
          var items = new Array()
          for (let i = 0; i < res.data.rows.length; i++) {
            var object = new Object()
            object.fID = res.data.rows[i].fID.value
            object.fName = res.data.rows[i].fName.value
            object.fPrice = res.data.rows[i].fPrice.value
            object.fDescription = res.data.rows[i].fDescription.value
            object.fSellNum = res.data.rows[i].fSellNum.value
            object.fClass = res.data.rows[i].fClass.value
            object.imgsrc =
              'https://wxwaimai.oss-cn-huhehaote.aliyuncs.com/kyq/' +
              res.data.rows[i].ownerID.value +
              '/' +
              res.data.rows[i].storeFileName.value
            object.ownerID = res.data.rows[i].ownerID.value
            object.storeFileName = res.data.rows[i].storeFileName.value
            items[i] = object
          }
          that.ajaxHistoryData = items
          console.log('====', that.ajaxHistoryData)
          that.dataCount = that.ajaxHistoryData.length
          //总条数
          if (that.dataCount < that.pageSize) {
            that.products = that.ajaxHistoryData
          } else {
            that.products = that.ajaxHistoryData.slice(0, that.pageSize)
          }
        })
        .then(function() {
          this.$http
            .post(
              'https://www.myyd.xyz/baas/takeoutAdmin/api/queryTakeout_foodclass',
              {
                emulateJSON: true
              }
            )
            .then(function(res) {
              var myclassitems = new Array()
              for (let i = 0; i < res.data.rows.length; i++) {
                var object = new Object()
                object.value = res.data.rows[i].fID.value
                object.label = res.data.rows[i].fName.value
                myclassitems[i] = object
              }
              this.classes = myclassitems
              this.columns[5].filters = myclassitems
              console.log('tag', this.classes)
            })
            .catch(function() {
              alert('error')
              console.log('服务器异常')
              // this.isSpinShow = false
            })
        })
        .catch(function() {
          alert('error')
          console.log('服务器异常')
        })
    },
    changepage(index) {
      var that = this
      var _start = (index - 1) * that.pageSize
      var _end = index * this.pageSize
      this.products = this.ajaxHistoryData.slice(_start, _end)
    }
  },
  created() {
    // this.handleListApproveHistory()
    this.getdata()
    //  this.get()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color {
  width: 100%;
  padding: 0;
}
.z {
  width: 100%;
  margin: 0;
  color: white;
}
.shop {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: yellow;
}
.right {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
.mytable {
  height: 100%;
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
  background-color: greenyellow;
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
.demo-table-info-row tr {
  background: #218af3 !important;
  color: red;
  font-size: 36px;
}
</style>
