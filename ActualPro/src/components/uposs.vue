<template>
  <div class="vue-uploader">
    <div class="file-list">
      <section v-for="(file, index) of files" class="file-item draggable-item" :key="file.name">
        <img :src="file.src" alt ondragstart="return false;">
        <span class="file-remove" @click="remove(index)">+</span>
      </section>
      <section v-if="status == 'ready'" class="file-item">
        <div @click="add" class="add"></div>
      </section>
      <section v-if="files.length != 0" class="file-item">
        <div>
          <Button type="primary" v-if="status == 'ready'" @click="submit">上传</Button>
        </div>
      </section>
    </div>

    <input
      type="file"
      :credentials="false"
      @change="fileChanged"
      ref="file"
      multiple="multiple"
      accept="image/jpg, image/jpeg, image/png, image/bmp"
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      status: 'ready',
      files: [],
      point: {},
      uploading: false,
      percent: 0
    }
  },
  methods: {
    // 添加文件
    add() {
      this.$refs.file.click()
    },
    // 上传按钮----
    submit() {
      this.uploading = true
      if (this.files.length === 0) {
        console.warn('no file!')
        return
      }
      var that = this
      //  这里是OSS
      const client = new OSS.Wrapper({
        accessKeyId: 'op1M6ugVPpw7pFpx',
        accessKeySecret: 'tkNCF43cnLQblDIazzATub5o6WcfNE',
        bucket: 'wxwaimai',
        endpoint: 'https://' + 'oss-cn-huhehaote.aliyuncs.com'
      })
      const fNum = this.files
      for (var i = 0; i < fNum.length; i++) {
        var f = fNum[i].file
        const Name = f.name
        //文件后缀名称
        const suffix = Name.substr(Name.indexOf('.'))
        // 文件目录
        const ownerID = this.timestamp()
        // 文件名称
        const storeFileName = this.timestamp()
        // 用户电话tel
        const tel = 'kyq/'
        const storeAs = tel + ownerID + '/' + storeFileName + suffix
        this.$emit('myImgFunc', {
          ownerID: ownerID,
          storeFileName: storeFileName + suffix,
          imgURL: this.files
        })
        // 断点上传
        client
          .multipartUpload(storeAs, f, {
            percent: function(p) {
              //获取进度条的值
              console.log(p)
              that.percent = p * 100
            }
          })
          .then(function(result) {
            console.log(result.res.requestUrls)
          })
      }
      this.status = 'finished'
    },
    //  时间戳，年月日时分秒----字符串
    timestamp: function() {
      const time = new Date()
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      const h = time.getHours()
      const mm = time.getMinutes()
      const s = time.getSeconds()
      const ms = time.getMilliseconds()
      return (
        '' +
        y +
        this.Add0(m) +
        this.Add0(d) +
        this.Add0(h) +
        this.Add0(mm) +
        this.Add0(s) +
        this.Add0(ms)
      )
    },
    // 一位数字变更格式为：03两位类型
    Add0: function(m) {
      return m < 10 ? '0' + m : m
    },
    // 点击完成按钮，清空文件集合，切换“完成”为“上传”
    finished() {
      this.files = []
      this.status = 'ready'
      this.uploading = false
    },
    // 从文件集合files中删除选定的图片index
    remove(index) {
      this.files.splice(index, 1)
    },
    // 点击图片选择按钮，将转换后的图片添加到文件集合files
    fileChanged() {
      const list = this.$refs.file.files
      for (let i = 0; i < list.length; i++) {
        if (!this.isContain(list[i])) {
          const item = {
            name: list[i].name,
            size: list[i].size,
            file: list[i]
          }
          this.html5Reader(list[i], item)
          this.files.push(item)
        }
      }
      this.$refs.file.value = ''
    },
    // 将图片文件转成BASE64格式
    html5Reader(file, item) {
      const reader = new FileReader()
      reader.onload = e => {
        this.$set(item, 'src', e.target.result)
      }
      reader.readAsDataURL(file)
    },
    //判断文件是否已经选过
    isContain(file) {
      return this.files.find(
        item => item.name === file.name && item.size === file.size
      )
    }
  }
}
</script>
<style>
.vue-uploader {


  height: 40px;

  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.vue-uploader .file-list {
  /* padding: 5px; */
    display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.vue-uploader .file-list:after {
  content: '';
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
  font-size: 0;
}
.vue-uploader .file-list .file-item {
  float: left;
  margin-left: 10px;

  position: relative;
  width: 60px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.vue-uploader .file-list .file-item img {
  width: 30px;
  height: 30px;
  /* border: 1px solid #ececec; */
}
.vue-uploader .file-list .file-item .file-remove {
  position: absolute;
  right: 2px;
  display: none;
  top: -2px;
  width: 20px;
  height: 20px;
  font-size: 20px;
  text-align: center;
  color: white;
  cursor: pointer;
  line-height: 20px;
  border-radius: 100%;
  transform: rotate(45deg);
  background: rgba(0, 0, 0, 0.5);
}
.vue-uploader .file-list .file-item:hover .file-remove {
  display: inline;
}
.vue-uploader .file-list .file-item .file-name {
  margin: 0;
  height: 40px;
  word-break: break-all;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.vue-uploader .add {
  width: 40px;
  height: 40px;
  float: left;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  cursor: pointer;
  background: url(../assets/PZ.png) no-repeat;
  background-size: 100% 100%;
}
.vue-uploader .upload-func {
  display: flex;
  padding: 5px;
  margin: 0px;
  background: #f8f8f8;
  /* border-top: 1px solid #ececec; */
}
.vue-uploader .upload-func .progress-bar {
  flex-grow: 1;
}
.vue-uploader .upload-func .progress-bar section {
  margin-top: 5px;
  background: #00b4aa;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  transition: all 0.5s ease;
}
.vue-uploader .upload-func .operation-box {
  flex-grow: 0;
  padding-left: 5px;
}
.vue-uploader .upload-func .operation-box button {
  padding: 4px 0px;
  color: #fff;
  background: #007acc;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.vue-uploader > input[type='file'] {
  display: none;
}
</style>