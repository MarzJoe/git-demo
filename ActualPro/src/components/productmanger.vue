<template>
  <div class="shop">
    <Modal title="添加商品信息" width="800" v-model="ShowState" :mask-closable="false" :loading="loading">
      <Form
        ref="abcProduct"
        :model="formLeft"
        :rules="ruleClass"
        label-position="left"
        :label-width="100"
      >
        <Form-item prop="fName" label="名称">
          <Input v-model="formLeft.fName" placeholder="请录入商品名称"></Input>
        </Form-item>
        <Form-item prop="fPrice" label="价格">
          <Input v-model="formLeft.fPrice" placeholder="请录入商品价格"></Input>
        </Form-item>
        <Form-item prop="fSellNum" label="库存">
          <Input v-model="formLeft.fSellNum" placeholder="请录入商品库存数量"></Input>
        </Form-item>
        <Form-item prop="fDescription" label="简介">
          <Input v-model="formLeft.fDescription" placeholder="请录入商品简介"></Input>
        </Form-item>
        <Form-item prop="fClass" label="类别">
          <!-- <Input v-model="formLeft.fClass" placeholder="请录入商品类别"></Input> -->

          <Select v-model="formLeft.fClass">
            <Option :value="item.value" v-for="item in classes" :key="item.value">{{item.label}}</Option>
          </Select>
        </Form-item>
        <Form-item prop="fClass" label="主图">
          <!-- editAddimgsrc -->
          <!-- <uposs @myImgFunc="getAddImgParams" >99</uposs> -->
          <uposs @myImgFunc="getAddImgParams" v-model="editAddimgsrc" v-if="editAddimgsrc === ''"></uposs>
          <template v-else>
            <div class="vue-uploader">
              <div class="file-list">
                <section class="file-item">
                  <img :src="tempImg">
                </section>
                <section class="file-item">
                  <Button type="primary" @click="updateeditAddimgsrc()">更换</Button>
                </section>
              </div>
            </div>
          </template>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('abcProduct')">提交</Button>
        </Form-item>
      </Form>
      <div slot="footer"></div>
    </Modal>

    <div class="right">
      <div class="top-search">
        <div class="row-1">
          <div class="col-1">
            <div>
              名称：
              <!-- <Input prefix="ios-search" style="width: 100px" v-model="pName"/> -->
              <Input suffix="ios-search" style="width: 100px" v-model="pName"/>
            </div>
          </div>
          <div class="col-1">
            类别：
            <Select v-model="pClass" style="width:100px">
              <!-- <Option v-for="item in cityList" :value="item.value" :key="item.value"></Option> -->
              <Option :value="item.value" v-for="item in classes" :key="item.value">{{item.label}}</Option>
            </Select>
          </div>
          <div class="col-1">
            价格：
            <Input style="width: 50px" v-model="pPriceMin"/>
            <span>到</span>
            <Input style="width: 50px" v-model="pPriceMax"/>
          </div>
          <div class="col-2">
            <i-button
              type="primary"
              style="width:80px;margin-left:20px;"
              @click="queryDesc('fPrice')"
            >查询</i-button>
            <i-button type="success" style="width:80px;margin-left:20px;" @click="addProduct()">添加</i-button>
          </div>
        </div>
      </div>
      <div class="middle-mydata">
        <i-table
        :row-class-name="rowClassName"
          border
          :height="talbleH"
          :columns="columns"
          :data="products"
          @on-sort-change="changeSort()"
          class="table"
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
      <div class="foot-page">
        <div class="top-3">
          <div>
            <template>
              <Page
                ref="pages"
                :total="dataCount"
                :page-size="pageSize"
                show-total
                @on-change="changepage"
                show-elevator
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie, getCookie } from '../assets/js/cookie.js'
import api from '../assets/js/api.js'

import uposs from '@/components/uposs'
export default {
  data() {
    return {
      // search参数变量
      pName: '',
      pClass: '000',
      classes: [],
      pPriceMin: '0',
      pPriceMax: '999',

      // 表格数据部分
      talbleH: '',
      // 列定义
      columns: [
        {
          title: '名称',
          align: 'left',
          slot: 'fName',
          // width: '100'
        },
        {
          title: '描述',
          align: 'left',
          slot: 'fDescription',
          // width: '400'
        },

        {
          title: '图片',
          slot: 'imgsrc',
          align: 'center',
          // width: '200'
        },
        {
          title: '库存',
          align: 'left',
          slot: 'fSellNum',
          // width: '80',
          sortable: true,
          key: 'fSellNum',
          sortMethod: function(a, b, type) {
            this.sortKey = this.key
            setCookie('key', this.key)
            console.log('sortMethod====', getCookie('key'))
          }
        },
        {
          title: '价格',
          slot: 'fPrice',
          align: 'left',
          sortable: true,
          // width: '100',
          key: 'fPrice',
          sortMethod: function(a, b, type) {
            this.sortKey = this.key
            setCookie('key', this.key)
          }


        },
        {
          title: '类别',
          align: 'left',
          slot: 'fClassName',
          // width: '100',
          key: 'fClass'
  
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],

      // 当前页面编号
      // currentIndex:1,
      sortKey: 'fPrice',
      fNameData: [],
      fDescriptionData: [],
      fPriceData: [],
      fClassData: [],
      flsShowData: [],
      preShowData: [],
      fColumns: 'fName',
      loading: true,

      pDescription: '',

      pHuojia: 0,
      PID: '',

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

      currentId: '',
      currentScore: '',
      isSpinShow: false,
      // 模拟数据（不带value）
      products: [],

      huojias: [
        {
          fID: {
            value: 0
          },
          fName: {
            value: '全部'
          }
        },
        {
          fID: {
            value: 1
          },
          fName: {
            value: '上架'
          }
        },
        {
          fID: {
            value: 2
          },
          fName: {
            value: '下架'
          }
        }
      ],
      self: this,

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
      pageSize: 10,
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
  components: {
    uposs
  },
  name: 'test',

  computed: {
    wt() {
      return window.innerWidth * 0.9 - 20
    }
    // fClassData(){
    //           return sortByKey(this.fClassData,'fPrice')
    //       }
  },
  mounted() {
    this.queryDesc(getCookie('key'))
  },
  watch: {
    pName(curVal, oldVal) {
      // {
      //   this.pName = curVal
      //   this.query()
      // }
    },
    pID(curVal, oldVal) {
      {
        this.pID = curVal

        this.query()
      }
    }
  },
  methods: {
         rowClassName1 (row, index) {
                if (index === 1) {
                    return 'demo-table-info-row';
                } else if (index === 3) {
                    return 'demo-table-error-row';
                }
                return '';
            },
    changeSort() {
      console.log('tag', 'changeSort')
      this.$store.state.key = '123'

      if (this.sort === 'DESC') {
        this.sort = 'ASC'

        this.queryDesc(getCookie('key'))
      } else {
        this.sort = 'DESC'

        this.queryAsc(getCookie('key'))
      }
      // this.startQuery();
    },
    sortByKey(array, key, sortType) {
      return array.sort(function(a, b) {
        var x = parseFloat(a[key])

        var y = parseFloat(b[key])
        if (sortType == 'desc') return x > y ? -1 : x < y ? 1 : 0
        else return x < y ? -1 : x > y ? 1 : 0
      })
    },
    getAddImgParams(data) {
      console.log('ADD===', data)
      if (data.ownerID != '') {
        this.formLeft.ownerID = data.ownerID
        this.formLeft.storeFileName = data.storeFileName
        // 拼接图片地址 （输入框得到的地址  editimgsrc  ）
        this.editAddimgsrc =
          'https://wxwaimai.oss-cn-huhehaote.aliyuncs.com/kyq/' +
          data.ownerID +
          '/' +
          data.storeFileName
        console.log('tag', data.imgURL)
        this.tempImg = data.imgURL[0].src
      }
    },

    // 对话框表单提交
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 调用API更新数据库
          this.$http
            .post(
              'https://www.myyd.xyz/baas/takeoutAdmin/api/INSERT_Takeout_food',
              // 'http://localhost:8080/baas/takeoutAdmin/api/INSERT_Takeout_food',
              JSON.stringify({
                fName: this.formLeft.fName,
                fPrice: this.formLeft.fPrice,
                fDescription: this.formLeft.fDescription,
                fSellNum: this.formLeft.fSellNum,
                fClass: this.formLeft.fClass,
                storeFileName: this.formLeft.storeFileName,
                ownerID: this.formLeft.ownerID,
                fPID: this.name
              }),
              { emulateJSON: true }
            )
            .then(function(res) {
              this.$Message.success('提交成功!')

              //   编辑框清空
              // this.formLeft.fName = ''
              // 重新请求数据
              this.getdata()
              //  setTimeout(() => {
              //       this.loading = false;
              //       this.$nextTick(() => {
              //           this.loading = true;
              //       });
              //   }, 1000);

              this.ShowState = false
            })
            .catch(function() {
              console.log('服务器异常')
            })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    // 增加记录按钮------切换对话框显示---状态数据
    addProduct() {
      this.ShowState = true
    },

    getImgParams(data) {
      console.log('dd', data)
      if (data.ownerID != '') {
        this.ownerID = data.ownerID
        this.storeFileName = data.storeFileName
        // 拼接图片地址 （输入框得到的地址  editimgsrc  ）
        this.editimgsrc =
          'https://wxwaimai.oss-cn-huhehaote.aliyuncs.com/kyq/' +
          data.ownerID +
          '/' +
          data.storeFileName
      }
    },
    queryAsc(key) {
      let that = this
      that.products = null

      this.queryfName()
      // this.queryfDescription()
      this.queryfPrice()
      this.queryfClass()

      that.preShowData = that.fClassData
      // 下面不用修改，以preShowData为准
      that.dataCount = that.preShowData.length

      that.preShowData = this.sortByKey(this.preShowData, key, 'asc')

      // //总条数
      if (that.dataCount < that.pageSize) {
        that.products = that.preShowData
      } else {
        that.products = that.preShowData.slice(0, that.pageSize)
        this.$refs['pages'].currentPage = 1
      }
    },
    queryDesc(key) {
      let that = this
      that.products = null

      this.queryfName()
      // this.queryfDescription()
      this.queryfPrice()
      this.queryfClass()

      that.preShowData = that.fClassData
      // 下面不用修改，以preShowData为准
      that.dataCount = that.preShowData.length

      that.preShowData = this.sortByKey(this.preShowData, key, 'desc')

      // //总条数
      if (that.dataCount < that.pageSize) {
        that.products = that.preShowData
      } else {
        that.products = that.preShowData.slice(0, that.pageSize)

        //  this.changepage(1)
        //   that.currentIndex=1
        this.$refs['pages'].currentPage = 1
      }
    },

    queryfName() {
      let that = this

      if (that.pName != '') {
        var items2 = new Array()

        for (let i = 0; i < that.ajaxHistoryData.length; i++) {
          if (that.ajaxHistoryData[i].fName.indexOf(that.pName) >= 0) {
            items2.push(that.ajaxHistoryData[i])
          }
        }

        that.fNameData = items2
      } else {
        that.fNameData = that.ajaxHistoryData
      }
    },
    // queryfDescription() {
    //   let that = this

    //   if (that.pDescription != '') {
    //     var items2 = new Array()

    //     for (let i = 0; i < that.fNameData.length; i++) {
    //       if (that.fNameData[i].fDescription.indexOf(that.pDescription) >= 0) {
    //         items2.push(that.fNameData[i])
    //       }
    //     }

    //     that.fDescriptionData = items2
    //   } else {
    //     that.fDescriptionData = that.fNameData
    //   }
    // },
    queryfPrice() {
      let that = this
      if (that.pPriceMin != '' && that.pPriceMax != '') {
        var items2 = new Array()

        for (let i = 0; i < that.fNameData.length; i++) {
          if (
            parseFloat(that.fNameData[i].fPrice) >=
              parseFloat(that.pPriceMin) &&
            parseFloat(that.fNameData[i].fPrice) <= parseFloat(that.pPriceMax)
          ) {
            items2.push(that.fNameData[i])
          }
        }
        that.fPriceData = items2
      } else {
        that.fPriceData = that.fNameData
      }
    },
    queryfClass() {
      let that = this

      if (that.pClass != '000') {
        var items2 = new Array()

        for (let i = 0; i < that.fPriceData.length; i++) {
          if (that.fPriceData[i].fClass === that.pClass) {
            items2.push(that.fPriceData[i])
          }
        }

        that.fClassData = items2
      } else {
        that.fClassData = that.fPriceData
      }
    },
    queryfHuojia() {
      let that = this

      if (that.pHuojia != 0) {
        var items2 = new Array()

        for (let i = 0; i < that.fClassData.length; i++) {
          console.log('+++++', that.fClassData[i])
          if (that.fClassData[i].flsShow === that.pHuojia) {
            items2.push(that.fClassData[i])
          }
        }

        that.flsShowData = items2
      } else {
        that.flsShowData = that.fClassData
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
            'https://www.myyd.xyz/baas/takeoutAdmin/cuisine/queryTakeout_food',
            // 'http://localhost:8080/baas/takeoutAdmin/cuisine/queryTakeout_food',
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
                this.classes = res.data.rows

                // var myclassitems = new Array()
                // for (let i = 0; i < res.data.rows.length; i++) {
                //   var object = new Object()
                //   object.value = res.data.rows[i].fID.value
                //   object.label = res.data.rows[i].fName.value
                //   myclassitems[i] = object
                // }
                // this.classes = myclassitems
                // this.columns[5].filters = myclassitems
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

          that.queryDesc(this.sortKey)
          // console.log('====', that.ajaxHistoryData)
          // that.dataCount = that.ajaxHistoryData.length
          // //总条数
          // if (that.dataCount < that.pageSize) {
          //   that.products = that.ajaxHistoryData
          // } else {
          //   that.products = that.ajaxHistoryData.slice(0, that.pageSize)
          // }
        })
        .then(function() {
          // 取服务器数据-----classes
          this.$http
            .post(api.getclass_url(), {
              emulateJSON: true
            })
            .then(function(res) {
              // 无中生有-----增加一个对象（全部）
              var myclassitems = new Array()
              var object = new Object()
              object.value = '000'
              object.label = '全部'
              myclassitems[0] = object
              for (let i = 0; i < res.data.rows.length; i++) {
                var object = new Object()
                object.value = res.data.rows[i].fID.value
                object.label = res.data.rows[i].fName.value
                myclassitems[i + 1] = object
              }
              this.classes = myclassitems
            })
            .catch(function() {
              alert('error')
              console.log('服务器异常')
            })
        })
        .catch(function() {
          alert('error')
          console.log('服务器异常')
        })
    },
    changepage(index) {
      // this.currentIndex=index
      var that = this
      var _start = (index - 1) * that.pageSize
      var _end = index * this.pageSize
      this.products = this.preShowData.slice(_start, _end)
    }
  },
  created() {
    this.talbleH = window.innerHeight * 0.865 * 0.84
    // this.handleListApproveHistory()
    // this.pClass='000'
    this.getdata()
    // this.queryDesc()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .ivu-table .demo-table-info-row td{
        background-color: black;
        color: #fff;
        height: 200px;
    } */
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
.top-search {
  width: 100%;
  height: 8%;
}
.middle-mydata {
  width: 100%;
  height: 84%;
  background-color: greenyellow;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.foot-page {
  width: 100%;
  height: 8%;
  float: right;
}
/* top-search孩子 */
.row-1 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #666;
  box-sizing: border-box;
}

.col-1 {
  width: 23%;
  height: 100%;
  border-right: 1px solid #666;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.col-2 {
  width: 31%;
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
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 25px;
  border: 1px solid #666;
  box-sizing: border-box;
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

.color {
  width: 100%;
  padding: 0;
}
.z {
  width: 100%;
  margin: 0;
  color: white;
}
</style>
