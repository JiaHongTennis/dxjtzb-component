<template>
  <a-modal
    :width="width"
    :footer="null"
    :closable="false"
    :centered="true"
    :maskClosable="false"
    wrapClassName="techsun-modal-wrap"
    :visible="true">
    <component :is="dialogThem">
      <template slot="title">
        <div class="dialog-title-content">
          <div class="dialog-titke-left-content">
            <span class="dialog-title__text">{{ title }}</span>
            <el-tabs v-if="curcomponentuuid && componentlistuuid.length > 1" class="dialog-title-tabs" v-model="curcomponentuuid" @tab-click="handleClick">
              <el-tab-pane :key="item.uuid" v-for="(item) in componentlistuuid" :label="item.label" :name="item.uuid"></el-tab-pane>
            </el-tabs>
          </div>
          <a-icon @click="commclose" :style="{ fontSize: '15px', color: 'rgb(153, 153, 153)' }" type="close-circle" />
        </div>
      </template>
      <div ref="dialogslot" :style="{ height: height }" class="dialog-slot">
        <component
          v-if="curcomponentuuid && loadcomponent"
          :savedata="commsavedate"
          :close="commclose"
          :data="dialogdata"
          v-bind="getcomponentdata(curcomponentuuid)"
          :is="getCurComponentNameOrObj(curcomponentuuid)"></component>
      </div>
    </component>
  </a-modal>
</template>
<script>
import Default from './thems/Default'
function createGuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0
    var v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default {
  name: 'DialogBoxComponent',
  components: {
    default: Default
  },
  watch: {
    // 组件名称变化是调用方法
    curcomponentuuid (val) {
      this.getdialogdata(val)
    }
  },
  props: {
    width: {
      type: [String, Number],
      default: '800px'
    },
    dialogThem: {
      type: String,
      default: 'default'
    },
    reSetComponent: {
      type: Boolean,
      default: false
    },
    savedatefun: {
      type: Function,
      require: true
    },
    closefun: {
      type: Function,
      require: true
    },
    componentList: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: '75%'
    },
    height: {
      type: [String, Number],
      default: 'auto'
    }
  },
  computed: {
    componentlistuuid () {
      // 给componentlist添加上唯一id
      return this.componentList.map(item => {
        return { ...item, uuid: createGuid() }
      })
    }
  },
  data () {
    return {
      loadcomponent: true,
      dialogdata: {},
      show: true,
      componentlistname: null,
      curcomponentname: '',
      curcomponentuuid: ''
    }
  },
  created () {
    this.getCurComponentUuid()
  },
  mounted () {
  },
  methods: {
    // 根据指标key获取数据
    getdialogdata (curcomponentuuid) {
      // 通过uuid只找到key
      const item = this.getIndexItemByCuaName(curcomponentuuid)
      this.dialogdata = {}
      if (item && item.indexKey) {
        if (item.indexKey !== '') {
          this.http.postJson('/service-digit-zb-screen-monitor/app/monitor/screenMonitor/getIndexData', { domainType: '6', indexKey: item.indexKey }).then(res => {
            res = res?.data?.data
            try {
              res.indexData = JSON.parse(res.indexData)
            } catch (e) {
            }
            this.dialogdata = res
          })
        }
      } else {
        return null
      }
    },
    // 因为indexjs添加的方法不会在组件初始化的时候马上接收到，所以传递给组件内的方法需要在组件内先套一层
    commsavedate (data, state) {
      this.savedatefun(data, state)
    },
    commclose () {
      this.closefun()
    },
    handleClick (val) {
      if (!this.reSetComponent) {
        return
      }
      // 为了相同组件key能从新触发create方法
      this.loadcomponent = false
      setTimeout(() => {
        this.loadcomponent = true
      }, 10)
    },
    // 根据指标名称获取当前指标信息
    getIndexItemByCuaName (curcomponentuuid) {
      for (let i = 0; i < this.componentlistuuid.length; i++) {
        if (this.componentlistuuid[i].uuid === curcomponentuuid) {
          return this.componentlistuuid[i]
        }
      }
      return null
    },
    getcomponentdata (curcomponentuuid) {
      const item = this.getIndexItemByCuaName(curcomponentuuid)
      if (item) {
        return item.props
      }
    },
    getCurComponentUuid () {
      if (Array.isArray(this.componentlistuuid) && this.componentlistuuid.length > 0) {
        this.curcomponentuuid = this.componentlistuuid[0].uuid
      }
    },
    // 根据id返回组件名称或组件对象
    getCurComponentNameOrObj (uuid) {
      if (Array.isArray(this.componentlistuuid) && this.componentlistuuid.length > 0) {
        for (let i = 0; i < this.componentlistuuid.length; i++) {
          const item = this.componentlistuuid[i]
          if (item.uuid === uuid) {
            return item.component
          }
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less">
.dialog-title-tabs {
  position: absolute;
  top: -8px;
  left: 10px;
}
.techsun-modal-wrap {
  .ant-modal-body {
    padding: 0px!important;
    .dialog-title-content{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .dialog-titke-left-content{
        height: 100%;
        position: relative;
        flex: 1;
      }
      .dialog-title__text {
        font-size: 16px;
        color: #333;
      }
      .dialog-right-close{
        position: relative;
        z-index: 2;
        width: 18px;
        height: 18px;
        /*background-image: url("~@/assets/images/dialog-close.png");*/
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .dialog-slot {
    }
  }
}
</style>
