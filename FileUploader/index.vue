<template>
  <el-upload
    class="upload-demo"
    :action="upload.url"
    ref="updateRef"
    :headers="upload.headers"
    :on-preview="handlePreview"
    :on-success="handleSuccess"
    :accept="accept"
    :on-error="handleError"
    :before-upload="handleBeforeUpload"
    :before-remove="beforeRemove"
    :on-remove="handleRemove"
    :multiple="multiple"
    :limit="limit"
    :on-exceed="handleExceed"
    :file-list="defaultFileList">
    <el-button size="mini" ref="uploadButtonRef" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">{{ tip }}</div>
  </el-upload>
</template>

<script>
// 内部使用了element-ui的update
// 根据源码查看内部file-list参数接收之后做了watch监听组件内data定义了uploadFiles会遍历file-list赋值到uploadFiles,可以认为file-list就是一个默认初始化的值
// file-list内部会有一个uid，如果有传uid就会使用自己传入的uid值，没有内部会自动生成一个时间戳作为唯一id
// uploadFiles内部会有一个状态,success表示的是上传成功，上传时候有多个状态，若是一个个判断状态比较麻烦
// 取消上传，el-upload组件如果在上传的过程中点击删除会自动断开请求
// 如果是上传成功的情况下点击删除文件不会做任何操作,需要监听文件删除

export default {
  name: 'FileUploader',
  props: {
    // 业务原因，用来作为文件显示与删除的既可以是fileUrl也可以是fileId
    typeKey: {
      type: String,
      default: 'fileUrl'
    },
    saveToDB: {
      type: Boolean,
      default: false
    },
    // 入库id
    iTablePKId: {
      type: String,
      default: ''
    },
    // 入库表
    sTableName: {
      type: String,
      default: ''
    },
    // 限制上传的类型
    accept: {
      type: String,
      default: ''
    },
    // 最大上传个数
    limit: {
      type: Number,
      default: 10
    },
    // 是否支持多文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 提示上传说明
    tip: {
      type: String,
      default: ''
    },
    // 默认文件列表，用来回显
    defaultFileList: {
      type: Array,
      default (data) {
        return []
      }
    }
  },
  data () {
    return {
      // 正在上传中的数量，靠这个来标记多文件上传完毕的生命周期
      uploadLoadingCount: 0,
      upload: {
        url: '/service-zb-fastdfs/service/fastdfs/uploadFile',
        headers: {
          enctype: 'multipart/form-data',
          Authorization: 'Bearer ' + this.$getvalue(this, '$store.state.user.access_token', '')
        }
      }
    }
  },
  methods: {
    // 准备开始上传
    handleBeforeUpload (file) {
      console.log('上传文件之前', file)
      this.uploadLoadingCount++
      this.$emit('handleBeforeUpload')
    },
    // 点击文件列表时候的回调
    handlePreview (file) {
      const link = document.createElement('a')
      let paramsStr = ''
      if (file.response) {
        // 图片有两种数据格式，第一种是具备response字段的，这个模式是当前组件直接上传的时候显示的数据success证明已经上传成功
        if (file.status === 'success') {
          // 如果是已经成功上传的文件,需要调用接口删除服务器内真正的文件
          // 拿到重保服务器返回的url
          if (this.typeKey === 'fileUrl') {
            paramsStr = `fileUrl=${file.response?.fileUrl}`
          }
          if (this.typeKey === 'fileId') {
            paramsStr = `fileId=${file.response?.fileId}`
          }
        }
      } else {
        // 如果不具备response字段,那么就是图片回显的时候传入的{ url, name }这种格式，这种证明图片肯定是存在于服务器的,跟前者success一样
        if (this.typeKey === 'fileUrl') {
          paramsStr = `fileUrl=${file.id}`
        }
        if (this.typeKey === 'fileId') {
          paramsStr = `fileId=${file.id}`
        }
      }
      link.href = `/service-zb-fastdfs/service/fastdfs/download?access_token=${this?.$store?.state?.user?.access_token}&${paramsStr}`
      document.body.appendChild(link)
      link.click() // 点击下载
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件`)
    },
    // 删除文件之前的确认步骤
    beforeRemove (file, fileList) {
      // element-ui官网原话:删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
      return new Promise((resolve, reject) => {
        this.$confirm(`确定移除 ${file.name}？`).then(res => {
          // 如果确认删除文件,判断当前删除文件的状态,如果上传中el-load会自动断开链接
          const deleteParams = {}
          if (file.response) {
            // 图片有两种数据格式，第一种是具备response字段的，这个模式是当前组件直接上传的时候显示的数据success证明已经上传成功
            if (file.status === 'success') {
              // 如果是已经成功上传的文件,需要调用接口删除服务器内真正的文件
              // 拿到重保服务器返回的url
              if (this.typeKey === 'fileUrl') {
                deleteParams.fileUrl = file.response?.fileUrl
              }
              if (this.typeKey === 'fileId') {
                deleteParams.fileId = file.response?.fileId
              }
            }
          } else {
            // 如果不具备response字段,那么就是图片回显的时候传入的{ url, name }这种格式，这种证明图片肯定是存在于服务器的,跟前者success一样
            if (this.typeKey === 'fileUrl') {
              deleteParams.fileUrl = file.url
            }
            if (this.typeKey === 'fileId') {
              deleteParams.fileId = file.id
            }
          }
          // 调用删除接口
          if ((this.typeKey === 'fileUrl' && deleteParams.fileUrl) || (this.typeKey === 'fileId' && deleteParams.fileId)) {
            this.http.post('/service-zb-fastdfs/service/fastdfs/deleteFile', deleteParams).then(res => {
              resolve()
            }).catch(() => {
              reject(new Error('删除失败'))
            })
          } else {
            // 没有对应的文件url,不给删除
            reject(new Error('没有对应的文件url'))
          }
        }).catch((err) => {
          // 选择了取消删除
          reject(err)
        })
      })
    },
    // 文件删除之后触发的回调
    handleRemove () {
      this.changeFibel()
    },
    // 上传成功
    handleSuccess () {
      // 触发改变状态通知,顺便拿到当前成功的列表数据
      const successFiberList = this.changeFibel()
      // 判断是否需要文件入库
      // 判断是否所有文件都上传完毕
      if (this.uploadLoadingCount === 0) {
        // 判断是否需要入库
        if (this.saveToDB) {
          const fileList = []
          successFiberList.forEach(fileItem => {
            // 如果是默认数据，则表示已经入库,不需要重复入库
            let isDefault = false
            for (let i = 0; i < this.defaultFileList.length; i++) {
              const defaultFileItem = this.defaultFileList[i]
              if (defaultFileItem.url === fileItem.url) {
                isDefault = true
                break
              }
            }
            if (!isDefault) {
              // 不是默认的
              fileList.push({ fileName: fileItem.name, fileUrl: fileItem.url })
            }
          })
          this.http.post('/service-zb-fastdfs/service/fastdfs/addUploadFiles', {
            fileList: JSON.stringify(fileList),
            iTablePKId: this.iTablePKId,
            sTableName: this.sTableName,
            saveToDB: true
          }).then(res => {
            this.$emit('handleSuccess', { fileData: successFiberList })
          })
        } else {
          this.$emit('handleSuccess', { fileData: successFiberList })
        }
      }
    },
    // 上传失败
    handleError (err, file, fileList) {
      // 向外推
      this.$emit('handleError', { fileData: { err, file, fileList } })
    },
    // 通知组件上层文件发生变化，文件上传成功，文件删除等会触发改方法
    changeFibel () {
      // 触发回调方法通知上层组件
      const allFiberList = this.$refs.updateRef.uploadFiles
      this.uploadLoadingCount--
      // 过滤掉只剩下上传成功的文件
      const successFiberList = []
      console.log(allFiberList)
      allFiberList.forEach(file => {
        // 图片有两种数据格式，第一种是具备response字段的，这个模式是当前组件直接上传的时候显示的数据success证明已经上传成功
        if (file.response) {
          if (file.status === 'success') {
            const data = file.response
            if (data) {
              successFiberList.push({
                name: data.fileName,
                url: data.fileUrl,
                id: data.fileId
              })
            }
          }
        } else {
          // 如果不具备response字段,那么就是图片回显的时候传入的{ url, name }这种格式，这种证明图片肯定是存在于服务器的,跟前者success一样
          successFiberList.push({
            name: file.name,
            url: file.url,
            id: file.id
          })
        }
      })
      // 判断是否是多文件上传
      this.$emit('changeFibel', { fileData: successFiberList })
      return successFiberList
    }
  }
}
</script>
