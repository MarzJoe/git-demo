<template>
  <div class="hello">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
      <FormItem prop="fName">
        <Input type="text" v-model="formInline.fName" placeholder="名称"/>>
      </FormItem>
      <FormItem prop="fImg">
        <Input type="text" v-model="formInline.fImg" placeholder="图片"/>>
      </FormItem>
      <FormItem prop="fPrice">
        <Input type="text" v-model="formInline.fPrice" placeholder="价格"/>>
      </FormItem>
      <FormItem>
        <Button type="success" ghost @click="post()">点击插入数据</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: "InsertData",
  data() {
    return {
      formInline: {
        fName: "",
        fImg: "",
        fPrice:""
      },
      ruleInline: {
        fName: [
          {
            required: true,
            message: "Please fill in the name",
            trigger: "blur"
          }
        ],
        fImg: [
          {
            required: true,
            message: "Please fill in the img.",
            trigger: "blur"
          }
        ],
        fPrice: [
          {
            required: true,
            message: "Please fill in the fPrice.",
            trigger: "blur"
          }
        ]
      },
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    post: function() {
      this.$ajax
        .post(
          "http://localhost:8080/baas/Vuedb/vuedb/insertUser",
          JSON.stringify({ fTel: "4556", fMoney: 300 }),
          {
            emulateJSON: true
          }
        )
        .then(
          function(res) {
            document.write(res.state);
          },
          function(res) {
            console.log(res.state);
          }
        );
    }
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
