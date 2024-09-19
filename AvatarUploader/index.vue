<template>
  <el-upload
    ref="upload"
    class="avatar-uploader"
    :style="{width: width, height: height}"
    :action="upload.url"
    :headers="upload.headers"
    :show-file-list="false"
    :on-success="handleSuccess"
    :on-progress="handleProgress"
    :on-error="handleError"
    :before-upload="beforeUpload">
    <template v-if="updateLoading">
      <i class="el-icon-loading"></i>
    </template>
    <template v-else-if="fibelUrl">
      <img :src="imageUrl" class="avatar">
      <span @click.stop="() => {}" class="upload-list__item-actions">
        <span
          v-if="showButtons.includes('zoom')"
          class="upload-list__item upload-list__item-zoom"
          @click.stop="handlePictureCardPreview"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="showButtons.includes('update')"
          class="upload-list__item upload-list__item-update"
          @click.stop="editFile"
        >
          <i class="el-icon-edit-outline"></i>
        </span>
        <span
          v-if="showButtons.includes('delete')"
          class="upload-list__item upload-list__item-delete"
          @click.stop="removeFile"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </template>
    <i v-else :style="{fontSize: iconSize}" class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
// 头像上传
export default {
  name: 'upload',
  props: {
    fibelUrl: {
      type: String,
      default: ''
    },
    fibelName: {
      type: String,
      default: ''
    },
    showButtons: {
      type: Array,
      default () {
        return ['update', 'delete']
      }
    },
    width: {
      type: String,
      default: '40px'
    },
    height: {
      type: String,
      default: '40px'
    },
    iconSize: {
      type: String,
      default: '14px'
    }
  },
  data () {
    return {
      updateLoading: false,
      upload: {
        url: '/service-zb-fastdfs/service/fastdfs/uploadMultiFiles',
        headers: {
          enctype: 'multipart/form-data',
          Authorization: 'Bearer ' + this.$getvalue(this, '$store.state.user.access_token', '')
        }
      }
    }
  },
  computed: {
    imageUrl () {
      return `/service-zb-fastdfs/service/fastdfs/download?access_token=${this?.$store?.state?.user?.access_token}&fileUrl=${this?.fibelUrl}`
    }
  },
  created () {
  },
  methods: {
    // 文件上传开始的回调
    handleProgress (event, file, fileList) {
      // 判断是否存在旧的文件，如果存在则删除
      if (this.fibelUrl) {
        this.deleteFileHandel(this.fibelUrl)
      }
      this.updateLoading = true
      this.$emit('changeProgress')
    },
    beforeUpload (file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      let fileLimit = false
      let type = file.name.substring(file.name.lastIndexOf('.') + 1)
      fileLimit = type == 'jpeg' || type == 'png' || type == 'jpg' || type == 'bmp'
      if (!fileLimit) {
        this.$message.error('只能上传格式为jpeg、jpg、png、bmp的图片!')
      }
      return isLt2M && fileLimit
    },
    // 上传成功后的回调
    handleSuccess (response, file, fileList) {
      // console.log('文件上传成功后续操作在此进行')
      const fileObj = file?.response?.data?.[0] || null
      if (file.status === 'success' && fileObj) {
        this.$notify({
          title: '成功',
          message: `${fileObj.fileName}上传成功!`,
          type: 'success',
          duration: 3000
        })
        // 将文件对象存储起来
        this.$emit('changeFibel', { fileUrl: fileObj.fileUrl, fileName: fileObj.fileName })
      } else {
        this.$notify({
          title: '失败',
          message: `${fileObj.name}上传失败!`,
          type: 'error',
          duration: 3000
        })
      }
      this.updateLoading = false
      this.$emit('changeSuccess')
    },
    // 上传失败后的回调
    handleError (e, file, fileList) {
      this.$notify({
        title: '失败',
        message: file.name + '上传失败!',
        type: 'error',
        duration: 3000
      })
      this.updateLoading = false
    },
    // 删除服务器上的文件
    deleteFileHandel (fileUrl) {
      return this.http.postJson('/service-zb-fastdfs/service/fastdfs/deleteFile', { fileUrl: fileUrl })
    },
    // 点击删除按钮
    removeFile (file, fileList) {
      this.updateLoading = true
      if (this.fibelUrl) {
        var fileUrl = this.fibelUrl
        // 文件名可以不一定需要从外面传进来，没有文件名的话直接为空也可以
        var fileName = this.fibelName
        this.deleteFileHandel(fileUrl).then(() => {
          this.$message.success(fileName + ' 文件删除成功')
          this.updateLoading = false
          this.$emit('changeFibel', { fileUrl: '', fileName: '' })
        }).catch(() => {
          this.updateLoading = false
          this.$message.error(fileName + ' 文件删除失败')
        })
      }
    },
    // 点击编辑按钮
    editFile () {
      // 找到调用文件上传的input控件
      const updateInput = this.$refs.upload.$el.querySelector('.el-upload__input')
      if (updateInput) {
        // 调用文件选择
        updateInput.click()
      }
    },
    // 点击放大图片
    handlePictureCardPreview () {
      const _this = this
      new this.$dialogbox({
        width: '700px',
        dialogthem: 'titlebox-them-none',
        title: '',
        componentlist: [
          {
            component: {
              props: ['close'],
              render () {
                return <div class="avatar-zomm-dialog">
                  <div onClick={this.closeHandel} class="dialog-close-button"></div>
                  <img style="max-width:100%; max-height:100%;" src={`/service-zb-fastdfs/service/fastdfs/download?access_token=${this?.$store?.state?.user?.access_token}&fileUrl=${_this.fibelUrl}`}/>
                </div>
              },
              methods: {
                closeHandel () {
                  this.close()
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">
.avatar-zomm-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  backage-color: #fff;
  .dialog-close-button {
    width: 18px;
    height: 18px;
    background-image: url('./images/dialog-close.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
.avatar-uploader::v-deep {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon {
    color: #8c939d;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-icon-loading{
    color: #8c939d;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
  .upload-list__item-actions{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    opacity: 0;
    &:hover {
      opacity: 1;
    }
    .upload-list__item{
      color: #fff;
      &:hover {
        color: #409EFF;
      }
    }
  }
}
</style>
