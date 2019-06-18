<template>
  <div class="shop">
    <Modal title="订单详情" width="800px" v-model="ShowState" :mask-closable="false">
      <div class="oderDetail">
        <div class="oderDetail-top">
          <div style="width:45%">订单编号：{{fOrderID}}</div>
          <div
            style="width:45%;margin-left:10%"
          >成交时间：{{fOrderTime | dateformat('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
        <div class="oderDetail-mid" v-if="ShowState">
          <Table :columns="columns1" :data="orderDetails" style="width:100%;"></Table>
          <!-- <ol style="width:100%;margin:0;padding:0;">
            <li class="itemDetail" style="font-weight:bold;margin-bottom:10px;">
              <div style="width:30%">商品名称</div>
              <div style="width:30%">商品数量</div>
              <div style="width:30%">商品单价</div>
            </li>
            <li v-for="item in orderDetails" class="itemDetail" :key="item.fFoodName">
              <div style="width:30%">{{ item.fFoodName}}</div>
              <div style="width:30%;margin-left:2%;">{{ item.fFoodCountOrder}}</div>
              <div style="width:30%">¥{{item.fFoodPrice}}</div>
            </li>
          </ol>-->
          <div class="price">总价：¥{{fOrderPrice}}</div>
        </div>
        <div class="oderDetail-bot">
          <div style="width:45%;">收货人：{{fUserName}}</div>
          <div style="width:45%">送货地址：{{fUserGetAddress}}</div>
          <div style="width:45%">电话号码：{{fUserGetTel}}</div>
        </div>
      </div>
    </Modal>

    <div class="right">
      <div class="top-search">
        <div class="row-1">
          <div class="col-1">
            <div>
              订单编号：
              <Input suffix="ios-search" style="width: 180px" v-model="pOID"/>
            </div>
          </div>
          <div class="col-1">
            收获人电话：
            <Input suffix="ios-search" style="width: 180px" v-model="pfUserGetTel"/>
          </div>
          <div class="col-1">
            发货状态：
            <Select v-model="pfOrderKuaiDi" style="width:150px">
              <Option
                :value="item.value"
                v-for="item in allkuaidis"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
          <div class="col-2">
            <i-button
              type="success"
              style="width:80px;margin-left:20px;"
              @click="queryDesc('fUserGetAddress')"
            >查询</i-button>

            <i-button type="info" style="width:80px;margin-left:20px;" @click="getdata()">刷新</i-button>
          </div>
        </div>
      </div>
      <div class="middle-mydata">
        <i-table
          :style
          :row-class-name="rowClassName"
          border
          :height="talbleH"
          :width="talbleW"
          :columns="columns"
          :data="orders"
          @on-sort-change="changeSort()"
          class="table"
          ref="table"
        >
          <template slot-scope="{ row, index }" slot="action">
            <div v-if="editIndex === index">
              <Button @click="handleSave(index)" type="success">保存</Button>
              <!-- <Button @click="handleDelete(index)">删除</Button> -->
              <Button @click="editIndex = -1">取消</Button>
            </div>
            <div v-else>
              <Button @click="handleEdit(row, index)">修改</Button>
              <Button type="primary" @click="handleShow(row, index)">查看</Button>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="fOrderID">
            <!-- <Input type="text" v-model="editfOrderID" v-if="editIndex === index"/> -->
            <span>{{ row.fOrderID }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fUserName">
            <!-- <Input type="text" v-model="editfUserName" v-if="editIndex === index"/> -->
            <span>{{ row.fUserName }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fUserGetName">
            <!-- <Input type="text" v-model="editfUserGetName" v-if="editIndex === index"/> -->
            <span>{{ row.fUserGetName }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fUserGetAddress">
            <!-- <Input type="text" v-model="editfUserGetAddress" v-if="editIndex === index"/> -->
            <span>{{ row.fUserGetAddress }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fUserGetTel">
            <!-- <Input type="text" v-model="editfUserGetTel" v-if="editIndex === index"/> -->
            <span>{{ row.fUserGetTel }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fOrderState">
            <!-- <Input type="text" v-model="editfOrderState" v-if="editIndex === index"/> -->
            <span>{{ row.fOrderState }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fOrderTime">
            <!-- <Input type="text" v-model="editfOrderTime" v-if="editIndex === index"/> -->
            <span>{{ row.fOrderTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fOrderPrice">
            <!-- <Input type="text" v-model="editfOrderPrice" v-if="editIndex === index"/> -->
            <span>{{ row.fOrderPrice }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="fOrderKuaiDi">
            <Input
              type="text"
              v-model="editfOrderKuaiDi"
              v-if="editIndex === index"
              class="kuaidi"
            />
            <span v-else>{{ row.fOrderKuaiDi }}</span>
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
import { setCookie, getCookie } from "../assets/js/cookie.js";
import {
  isInteger,
  validatetoFixedNew,
  iskong
} from "../assets/js/validator.js";
import api from "../assets/js/api.js";
import uposs from "@/components/uposs";

export default {
  data() {
    return {
      columns1: [
        {
          title: "商品名称",
          key: "fFoodName"
        },
        {
          title: "商品数量",
          key: "fFoodCountOrder"
        },
        {
          title: "商品单价",
          key: "fFoodPrice"
        }
      ],
      fOrderID: "",
      fUserName: "",
      fOrderTime: "",
      fOrderPrice: "",
      fUserGetAddress: "",
      fUserGetTel: "",
      // search参数变量
      pOID: "",
      pfOrderKuaiDi: "000",
      pfUserGetTel: "",
      allkuaidis: [
        {
          value: "000",
          label: "全部"
        },
        {
          value: "001",
          label: "已配送"
        },
        {
          value: "002",
          label: "未配送"
        }
      ],
      // 订单详情
      orderDetails: [],
      // 表格数据部分
      talbleH: "",
      talbleW: "",
      // 表头列定义
      columns: [
        {
          title: "订单编号",
          align: "left",
          slot: "fOrderID",
          width: 200,
          className: "demo-table-info-column"
        },
        {
          title: "发货单号",
          align: "left",
          slot: "fOrderKuaiDi",
          width: "100"
        },
        {
          title: "客户姓名",
          slot: "fUserName",
          align: "center",
          width: "90"
        },
        {
          title: "下单时间",
          align: "center",
          slot: "fOrderTime",
          width: "105",
          sortable: true,
          key: "fOrderTime"
          // sortMethod: function(a, b, type) {
          //   this.sortKey = this.key
          //   setCookie('orderkey', this.key)
          //  // console.log('sortMethod====', getCookie('key'))
          // }
        },
        {
          title: "总价",
          slot: "fOrderPrice",
          align: "center",
          sortable: true,
          width: "80",
          key: "fOrderPrice"
          // sortMethod: function(a, b, type) {
          //   this.sortKey = this.key
          //   setCookie('orderkey', this.key)
          // }
        },
        {
          title: "收货人电话",
          slot: "fUserGetTel",
          align: "center",
          width: "140"
        },
        {
          title: "收获姓名",
          slot: "fUserGetName",
          align: "center",
          width: "90"
        },
        {
          title: "收货人地址",
          slot: "fUserGetAddress",
          align: "center"
          // width: "300"
        },

        {
          title: "操作",
          align: "center",
          slot: "action",
          width: 200
        }
      ],
      // 表格数据集（不带value）
      orders: [],

      // 商品编辑状态变量
      editIndex1: -1,
      editIndex: -1, // 当前聚焦的输入框的行数
      editfOrderID: "", // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
      editfOrderTime: "", // 第二列输入框
      editfUserGetAddress: "", // 第三列输入框
      editAddfOrderTime: "",
      editfUserGetName: "",
      editfUserName: "",
      editAddress: "",
      editfOrderPrice: "",
      editfOrderState: "",
      editfOrderKuaiDi: "",

      //  默认排序的列名
      sortKey: "fOrderTime",
      // 名称==搜索后的商品集合-----1
      fOderIDData: [],
      // 价格==搜索后的商品集合-----2
      fUserGetTelData: [],
      // 类型==搜索后的商品集合-----3
      fOrderKuaiDiData: [],

      // 准备显示的数据集合
      preShowData: [],

      // 用户账号=？？？？？？

      name: "",
      // 商品添加----状态数据------默认不显示
      ShowState: false,

      // 表单数据对象
      formLeft: {
        fOrderID: "",
        fUserGetName: "",
        fUserName: "",
        fUserGetAddress: "",
        fClass: "",
        storeFileName: "",
        ownerID: ""
      },
      // 表单数据规则对象(格式固定)
      ruleClass: {},

      ownerID: "",
      storeFileName: "",
      tempImg: "",

      //  分页属性
      dataCount: 1,
      pageSize: 9,

      originOrderes: [],
      weiyiOrderes: []
    };
  },
  components: {
    uposs
  },

  computed: {
    unnes() {
      return this.talbleH % 58;
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("weiyiOrderes") || "[]").length == 0) {
      console.log("订单数据来源：", "取服务器数据");
      this.getdata();
    } else {
      console.log("订单数据来源：", "取缓存数据");
      this.getlocaldata();
    }
    if (JSON.parse(localStorage.getItem("originOrderes") || "[]").length == 0) {
      console.log("订单数据来源：", "取服务器数据");
      this.getdata();
    } else {
      console.log("订单数据来源：", "取缓存数据");
      this.getlocaldata();
    }
    this.queryDesc(getCookie("orderkey"));
  },
  watch: {},
  methods: {
    // 表外部排序
    rowClassName(row, index) {
      return "demo-table-info-row";
    },
    changeSort() {
      if (this.sort === "DESC") {
        this.sort = "ASC";

        this.queryDesc(getCookie("key"));
      } else {
        this.sort = "DESC";

        this.queryAsc(getCookie("key"));
      }
    },
    // 排序（内）
    sortByKey(array, key, sortType) {
      return array.sort(function(a, b) {
        var x = parseFloat(a[key]);

        var y = parseFloat(b[key]);
        if (sortType == "desc") return x > y ? -1 : x < y ? 1 : 0;
        else return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    // uposs（商品增加）-----图片上传触发函数
    getAddImgParams(data) {
      if (data.ownerID != "") {
        this.formLeft.ownerID = data.ownerID;
        this.formLeft.storeFileName = data.storeFileName;
        // 拼接图片地址 （输入框得到的地址  editfOrderTime  ）
        this.editAddfOrderTime =
          api.oss_url() + data.ownerID + "/" + data.storeFileName;
      }
    },

    // 表单提交
    handleSubmit() {
      // 表单验证
      this.ruleClass = {
        fOrderID: [
          { required: true, message: "请填写商品名称", trigger: "blur" }
        ],
        fUserGetName: [
          { required: true, message: "请填写商品简介", trigger: "blur" }
        ],
        fUserName: [
          { required: true, message: "请填写商品库存", trigger: "blur" },
          { validator: isInteger, trigger: "blur" }
        ],
        fUserGetAddress: [
          { required: true, message: "请填写商品价格", trigger: "blur" }
        ],
        fClass: [
          { required: true, message: "请选择商品类别", trigger: "change" }
        ],
        ownerID: [
          {
            required: true,
            message: "请填写商品主图",
            trigger: " change"
          }
        ]
      };
      // 表单验证通过后执行才添加动作
      if (
        this.formLeft.fOrderID != "" &&
        this.formLeft.ownerID != "" &&
        this.formLeft.fClass != ""
      ) {
        this.$refs.addForm.validate(res => {
          if (res) {
            // 调用API更新数据库
            this.$http
              .post(
                api.insertproduct_url(),
                JSON.stringify({
                  fOrderID: this.formLeft.fOrderID,
                  fUserGetAddress: this.formLeft.fUserGetAddress,
                  fUserGetName: this.formLeft.fUserGetName,
                  fUserName: this.formLeft.fUserName,
                  fClass: this.formLeft.fClass,
                  storeFileName: this.formLeft.storeFileName,
                  ownerID: this.formLeft.ownerID,
                  fPID: this.name
                }),
                { emulateJSON: true }
              )
              .then(function(res) {
                this.$Message.success("提交成功!");
                this.getdata();
                this.ShowState = false;
              })
              .catch(function() {
                console.log("服务器异常");
              });
          }
        });
      }
    },
    // 增加记录按钮-
    handleShow(row, index) {
      this.ShowState = true;
      this.fOrderID = row.fOrderID;
      this.fUserName = row.fUserName;
      this.fOrderTime = row.fOrderTime;
      this.fOrderPrice = row.fOrderPrice;
      this.fUserGetAddress = row.fUserGetAddress;
      this.fUserGetTel = row.fUserGetTel;
      let that = this;
      that.originOrderes = JSON.parse(localStorage.getItem("originOrderes"));
      var items2 = new Array();
      console.log("原始订单记录条数", that.originOrderes.length);
      for (let i = 0; i < that.originOrderes.length; i++) {
        console.log("原始数据", that.originOrderes[i].fOrderID);
        console.log("点击订单", row.fOrderID);
        if (that.originOrderes[i].fOrderID === row.fOrderID) {
          items2.push(that.originOrderes[i]);
        }
      }
      that.editIndex1 = index;
      that.orderDetails = items2;
      console.log("tag", that.orderDetails[0].fOrderPrice);

      //        this.editfOrderID = row.fOrderID
      // this.editfUserGetAddress = row.fUserGetAddress
      // this.editfOrderTime = row.fOrderTime
      // this.editfUserGetName = row.fUserGetName
      // this.editfUserName = row.fUserName
      // this.editfUserGetTel = row.fUserGetTel
      // this.editfOrderPrice = row.fOrderPrice
      // this.editfOrderState = row.fOrderState
      // this.editfOrderKuaiDi = row.fOrderKuaiDi

      // alert(row.fOrderID)

      // // 清空表单原有信息
      // this.formLeft = {
      //   fOrderID: '',
      //   fUserGetName: '',
      //   fUserName: '',
      //   fUserGetAddress: '',
      //   fClass: '',
      //   storeFileName: '',
      //   ownerID: ''
      // }
      // // 清除主图上传控件中上次的照片
      // this.$refs.zhutu.remove()

      // this.editAddfOrderTime = ''
      // this.ShowState = true
      // // 临时取消表单验证规则（提交表单时候，再启用验证规则）
      // this.ruleClass = {}
    },
    // uposs（表单编辑）-----图片上传触发函数
    getImgParams(e) {
      if (e.ownerID != "") {
        this.ownerID = e.ownerID;
        this.storeFileName = e.storeFileName;
        // 拼接图片地址 （输入框得到的地址  editfOrderTime  ）
        this.editfOrderTime = api.oss_url() + e.ownerID + "/" + e.storeFileName;
      }
    },
    // 工具---模糊查询和排序（内）
    queryMouhuSort(key, ascDesc) {
      let that = this;
      // 清空前一次表格中数据集
      that.orders = null;

      this.queryfOrderID();
      this.queryfUserGetTel();
      this.queryfOrderState();

      that.preShowData = that.fOrderKuaiDiData;
      // 下面不用修改，以preShowData为准
      that.dataCount = that.preShowData.length;

      that.preShowData = this.sortByKey(this.preShowData, key, ascDesc);

      //给表格数据集orders赋值
      if (that.dataCount < that.pageSize) {
        that.orders = that.preShowData;
      } else {
        that.orders = that.preShowData.slice(0, that.pageSize);
        // 分页码，指定当前页为第一页
        that.$refs["pages"].currentPage = 1;
      }
    },
    // 模糊查询（公开）
    queryAsc(key) {
      this.queryMouhuSort(key, "asc");
    },
    // 模糊查询（公开）
    queryDesc(key) {
      console.log("模糊查询（公开）", this.weiyiOrderes.length);
      this.queryMouhuSort(key, "desc");
    },
    // 模糊查询（内）
    queryfOrderID() {
      let that = this;

      if (that.pOID != "") {
        var items2 = new Array();

        for (let i = 0; i < that.weiyiOrderes.length; i++) {
          if (that.weiyiOrderes[i].fOrderID.indexOf(that.pOID) >= 0) {
            items2.push(that.weiyiOrderes[i]);
          }
        }

        that.fOderIDData = items2;
      } else {
        that.fOderIDData = that.weiyiOrderes;
      }

      console.log("模糊1查询", that.fOderIDData.length);
    },
    // 模糊查询（内）
    queryfUserGetTel() {
      let that = this;
      if (that.pfUserGetTel != "") {
        var items2 = new Array();

        for (let i = 0; i < that.fOderIDData.length; i++) {
          if (that.fOderIDData[i].fUserGetTel.indexOf(that.pfUserGetTel) >= 0) {
            items2.push(that.fOderIDData[i]);
          }
        }
        that.fUserGetTelData = items2;
      } else {
        that.fUserGetTelData = that.fOderIDData;
      }
      console.log("模糊2查询", that.fUserGetTelData.length);
    },
    // 模糊查询（内）
    queryfOrderState() {
      let that = this;

      if (that.pfOrderKuaiDi != "000") {
        if (that.pfOrderKuaiDi == "002") {
          var items2 = new Array();
          for (let i = 0; i < that.fUserGetTelData.length; i++) {
            if (that.fUserGetTelData[i].fOrderKuaiDi === "未配送") {
              items2.push(that.fUserGetTelData[i]);
            }
          }
          that.fOrderKuaiDiData = items2;
        } else {
          var items2 = new Array();
          for (let i = 0; i < that.fUserGetTelData.length; i++) {
            if (that.fUserGetTelData[i].fOrderKuaiDi != "未配送") {
              items2.push(that.fUserGetTelData[i]);
            }
          }
          that.fOrderKuaiDiData = items2;
        }
      } else {
        that.fOrderKuaiDiData = that.fUserGetTelData;
      }
    },

    handleSave(index) {
      console.log("保存订单==", index);
      // 编辑框的信息保存到静态数组orders
      this.orders[index].fOrderID = this.editfOrderID;
      this.orders[index].fOrderKuaiDi = this.editfOrderKuaiDi;

      this.$http
        .post(
          api.update_myorder_fOrderKuaiDi(),
          JSON.stringify({
            fOrderID: this.editfOrderID,
            fOrderKuaiDi: this.editfOrderKuaiDi
          }),
          { emulateJSON: true }
        )
        .then(
          function(res) {
            this.getdata();
            // document.write(res.state)
          },
          function(res) {
            //    console.log(res.state)
          }
        );

      this.editIndex = -1;
    },
    // 删除商品
    handleDelete(index) {
      this.$http
        .post(
          api.deleteproduct_url(),
          JSON.stringify({
            fID: this.orders[index].fID
          }),
          { emulateJSON: true }
        )
        .then(
          function(res) {
            if (res.data.state === "1") {
              this.getdata();
              this.$Message.success("记录删除成功!");
            } else {
              this.$Message.success("本目录下还有商品在售，暂不能删除!");
            }
          },
          function(res) {
            //    console.log(res.state)
          }
        );
      this.editIndex = -1;
    },
    // 操作---按钮
    handleEdit(row, index) {
      // 模拟数据==》编辑数据
      this.editfOrderID = row.fOrderID;
      this.editfUserGetAddress = row.fUserGetAddress;
      this.editfOrderTime = row.fOrderTime;
      this.editfUserGetName = row.fUserGetName;
      this.editfUserName = row.fUserName;
      this.editfUserGetTel = row.fUserGetTel;
      this.editfOrderPrice = row.fOrderPrice;
      this.editfOrderState = row.fOrderState;
      this.editfOrderKuaiDi = row.fOrderKuaiDi;

      this.editIndex = index;
    },
    getlocaldata: function() {
      let that = this;
      that.originProductes = JSON.parse(localStorage.getItem("originOrderes"));
      that.weiyiOrderes = JSON.parse(localStorage.getItem("weiyiOrderes"));

      //  that.queryDesc(this.sortKey)
      // this.classes = JSON.parse(localStorage.getItem("classes"));
      // this.addclasses = JSON.parse(localStorage.getItem("addclasses"));
    },
    // 获取服务器数据函数
    getdata: function() {
      var that = this;
      this.$http
        .post(api.getorder_url(), {
          emulateJSON: true
        })
        .then(function(res) {
          var items = new Array();
          var itemsWeiYi = new Array();
          //   // 去掉value 构造图片地址
          for (let i = 0; i < res.data.rows.length; i++) {
            var object = new Object();
            var objectWeiYi = new Object();
            object.fID = res.data.rows[i].fID.value;
            object.fOrderID = res.data.rows[i].fOrderID.value;
            object.fOrderTime = res.data.rows[i].fOrderTime.value;
            object.fOrderPrice = res.data.rows[i].fOrderPrice.value;
            object.fOrderState = res.data.rows[i].fOrderState.value;
            object.fFoodID = res.data.rows[i].fFoodID.value;
            object.fFoodName = res.data.rows[i].fFoodName.value;
            object.fFoodImg = res.data.rows[i].fFoodImg.value;
            object.fFoodPrice = res.data.rows[i].fFoodPrice.value;
            object.fFoodCountOrder = res.data.rows[i].fFoodCountOrder.value;
            object.fShopID = res.data.rows[i].fShopID.value;
            object.fShopTel = res.data.rows[i].fShopTel.value;
            object.fUserID = res.data.rows[i].fUserID.value;
            object.fUserName = res.data.rows[i].fUserName.value;
            object.fUserGetName = res.data.rows[i].fUserGetName.value;
            object.fUserGetAddress = res.data.rows[i].fUserGetAddress.value;
            object.fUserGetTel = res.data.rows[i].fUserGetTel.value;
            object.fOrderKuaiDi = res.data.rows[i].fOrderKuaiDi.value;

            objectWeiYi.fOrderID = res.data.rows[i].fOrderID.value;
            objectWeiYi.fOrderTime = res.data.rows[i].fOrderTime.value;
            objectWeiYi.fOrderPrice = res.data.rows[i].fOrderPrice.value;
            objectWeiYi.fOrderState = res.data.rows[i].fOrderState.value;
            objectWeiYi.fUserName = res.data.rows[i].fUserName.value;
            objectWeiYi.fUserGetName = res.data.rows[i].fUserGetName.value;
            objectWeiYi.fUserGetAddress =
              res.data.rows[i].fUserGetAddress.value;
            objectWeiYi.fUserGetTel = res.data.rows[i].fUserGetTel.value;
            objectWeiYi.fOrderKuaiDi = res.data.rows[i].fOrderKuaiDi.value;

            items[i] = object;
            itemsWeiYi[i] = objectWeiYi;
          }
          //原始订单

          localStorage.setItem("originOrderes", JSON.stringify(items));
          that.originOrderes = JSON.parse(
            localStorage.getItem("originOrderes")
          );
          console.info("初始化后订单条数", that.originOrderes.length);
          // 消除对象数组中重复的记录
          var obj = {};
          itemsWeiYi = itemsWeiYi.reduce(function(item, next) {
            obj[next.fOrderID]
              ? ""
              : (obj[next.fOrderID] = true && item.push(next));
            return item;
          }, []);

          localStorage.setItem("weiyiOrderes", JSON.stringify(itemsWeiYi));
          that.weiyiOrderes = JSON.parse(localStorage.getItem("weiyiOrderes"));
          that.queryDesc(this.sortKey);
        })
        .catch(function() {
          this.$Message.info("请确认网络通畅222！");
          console.log("服务器异常");
        });
    },
    changepage(index) {
      var that = this;
      var _start = (index - 1) * that.pageSize;
      var _end = index * this.pageSize;
      this.orders = this.preShowData.slice(_start, _end);
    }
  },

  created() {
    //  this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 80
    this.talbleH = window.innerHeight * 0.865 * 0.84;
    // this.talbleW = window.innerWidth * 0.9;
    // 初始化数据   originOrderes     classes     addclassess
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .ivu-table .demo-table-error-row td{
        background-color: #ff6600;
        color: #fff;
        width: 100%;
    } */
.table {
  width: 100%;
  height: 100%;
}
.price {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.oderDetail {
  width: 100%;
  height: 80%;
  /* background-color: red; */
  font-size: 11pt;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.oderDetail-top {
  width: 95%;
  font-weight: bold;
  height: 50px;
  /* background-color: gold; */
  display: flex;
  flex-direction: row;
  align-items: center;
}
.oderDetail-mid {
  width: 95%;
    font-weight: bold;
  /* background-color: blue; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.oderDetail-bot {
    font-weight: bold;
  width: 95%;
  height: 50px;
  /* background-color: gold; */
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.itemDetail {
  width: 100%;
  /* background-color: gold; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0;
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
.flex-box {
  display: flex;
  flex-direction: column;
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
.kuaidi {
  background: #f00;
  color: red;
}
</style>
