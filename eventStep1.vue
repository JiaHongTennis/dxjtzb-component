<template>
  <div class="eventStep1-wrap">
    <div class="eventStep1-form-box">
      <el-form :model="formParams" :rules="rules" label-width="90px" class="createEventForm" ref="formBox">
        <el-form-item label="保障主题" prop="situationName">
          <el-input
            class="wp-100"
            v-model="formParams.situationName"
            placeholder="请输入保障主题"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isShowAreaInput" label="保障区域" prop="areaName">
          <div class="el-form-item-box">
            <el-input
              class="wp-100"
              :value="areaName"
              clearable
              @clear="clearAreaData"
              placeholder="请选择保障区域"
            >
              <el-button @click="selectCityArea" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button @click="linkCreateAreaView" class="form-item-button" type="primary">创建区域</el-button>
            <el-tooltip class="item" effect="dark" content="保障区域为本次事件的保障范围，若区域已经创建则直接在输入框中选择；若区域未创建则点击右侧【创建区域】按钮创建区域；若不确定区域是否存在可以先在输入框中查询，确认不存在后再创建。" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                style="width: 100%;"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                v-model="formParams.startTime"
                :clearable="false"
                :picker-options="startDateTimePickerOptions"
                type="datetime"
                :disabled="isStartDateTimeDisabled"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                style="width: 100%;"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                v-model="formParams.endTime"
                :clearable="false"
                :picker-options="endDateTimePickerOptions"
                type="datetime"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保障类型" prop="eventTypeObj">
              <el-input
                class="wp-100"
                :value="formParams.eventTypeObj.eventTypeName"
                placeholder="请选择保障类型"
              >
                <el-button v-if="!isEventTypeObjDisabled" @click="selectEventType" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监控方式" prop="situationFormatFlag">
              <div class="el-form-item-box">
                <el-select style="width: 100%;" placeholder="请选择监控方式" v-model="formParams.situationFormatFlag">
                  <el-option label="非正式事件监控" value="0"></el-option>
                  <el-option label="正式事件监控" value="1"></el-option>
                </el-select>
                <el-tooltip class="item" effect="dark" content="选择正式事件监控，数据会上报集团，选择非正式监控，数据不会上报集团。" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="事件原因" prop="sIndexKey">
              <el-select clearable style="width: 100%;" placeholder="请选择事件级别" v-model="formParams.eventCause">
                <el-option :key="item.val" v-for="item in $store.state.enum.data.I_EVENT_CAUSE" :label="item.label" :value="item.val"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件级别" prop="eventLevel">
              <div class="el-form-item-box">
                <el-select clearable style="width: 100%;" placeholder="请选择事件级别" v-model="formParams.eventLevel">
                  <el-option :key="item.val" v-for="item in $store.state.enum.data.I_EVENT_LEVEL" :label="item.label" :value="item.val"></el-option>
                </el-select>
                <i @click="showEventPdfFile" style="cursor: pointer;" class="el-icon-question"></i>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="isShowGroupFaultInput" label="事件标识" prop="groupFault">
          <el-select clearable style="width: 100%;" placeholder="请选择事件标识" v-model="formParams.groupFault">
            <el-option :key="item.val" v-for="item in $store.state.enum.data.I_GROUP_FAULT" :label="item.label" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人" prop="staffName">
              <el-input
                class="wp-100"
                disabled
                v-model="formParams.staffName"
                placeholder="请选择申请人"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核人" prop="sIndexKey">
              <el-input
                class="wp-100"
                :value="formParams.verifyUser.sStaffName"
                :disabled="isVerifyUserDisabled"
                clearable
                @clear="clearVerifyUser"
                placeholder="请选择审核人"
              >
                <el-button v-if="!isVerifyUserDisabled" @click="selectVerifyUser" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注说明" prop="remark">
          <el-input
            class="wp-100"
            v-model="formParams.remark"
            :rows="3"
            type="textarea"
            placeholder="请输入备注说明"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件简介" prop="sdesc">
          <el-input
            class="wp-100"
            v-model="formParams.sdesc"
            :rows="3"
            type="textarea"
            placeholder="请输入事件简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片上传" prop="photoName">
          <AvatarUploader
            :fibelUrl="formParams.photoName"
            @changeFibel="upLoadUrlIcon"
            :showButtons="['zoom', 'update', 'delete']"
            width="80px"
            height="80px"></AvatarUploader>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-submit-box">
      <el-button type="primary" :loading="submitLoading" @click="saveEventInfo">保存</el-button>
      <el-button type="primary" :loading="submitLoading" v-if="['', '1'].includes(eventStatus)" @click="submitEventInfo">提交申请</el-button>
    </div>
  </div>
</template>

<script>
import { getSituationIdForUrl, updateSituationIdParameter } from '@/utils/situationId.js'
import { getEventConfigShoppingCartOption } from '@/assets/option/shoppingCartOptions.js'
import AvatarUploader from '@/components/common/AvatarUploader'
import { dateFormat } from '@/utils/common.js'
// 大型保障-通用/亚运保障/重要电路：(可能有其他未知的类型，默认也用这一个)
// 保障主题、保障区域、开始时间（默认当前时间）、结束时间（默认当前时间往后推7天）、保障类型、监控方式（默认非正式监控）、事件原因、事件级别、申请人、审核人、备注说明、事件简介、图片上传
// 光缆故障/其他故障
// 保障主题、保障区域、开始时间（默认当前时间）、结束时间（默认当前时间往后推7天）、保障类型、监控方式（默认非正式监控）、事件原因、事件级别、事件标识、申请人、审核人、备注说明、事件简介、图片上传
//
// 防汛防台/爆炸火灾/其他事件/房屋坍塌
// 保障主题、开始时间（默认当前时间）、结束时间（默认当前时间往后推7天）、保障类型、监控方式（默认非正式监控）、事件原因、事件级别、申请人、审核人、备注说明、事件简介、图片上传

export default {
  name: 'eventStep1',
  props: {
    // 事件申请状态 =''表示未申请 不为空表示状态
    eventStatus: {
      type: String,
      require: true
    },
    // 事件信息
    eventInfo: {
      type: Object,
      require: true
    }
  },
  data () {
    // 校验保障类型
    const eventTypeObjPass = (rule, value, callback) => {
      if (JSON.stringify(value) === '{}') {
        callback(new Error('请选择保障类型'))
      } else {
        callback()
      }
    }
    const startTimePass = (rule, value, callback) => {
      // 根据结束时间来决定
      const eventConfigId = this.formParams.eventTypeObj.id
      // 结束时间
      const endTime = new Date(this.formParams.endTime)
      // 防汛防台 时间区间14天
      if (eventConfigId === '9999') {
        if (endTime.getTime() - 14 * 24 * 60 * 60 * 1000 > new Date(value).getTime()) {
          callback(new Error('与结束时间之间大于14天'))
          return
        }
      }
      // 爆炸火灾/其他事件/房屋坍塌 时间区间21天
      if (['3404523707', '3404523708', '3404523709'].includes(eventConfigId)) {
        if (endTime.getTime() - 21 * 24 * 60 * 60 * 1000 > new Date(value).getTime()) {
          callback(new Error('与结束时间之间大于21天'))
          return
        }
      }
      if (new Date(endTime) <= new Date(value)) {
        callback(new Error('结束时间不能小于或等于开始时间'))
        return
      }
      callback()
    }
    const endTimePass = (rule, value, callback) => {
      // 根据结束时间来决定
      const eventConfigId = this.formParams.eventTypeObj.id
      // 结束时间
      const startTime = new Date(this.formParams.startTime)
      if (eventConfigId === '9999') {
        if (startTime.getTime() + 14 * 24 * 60 * 60 * 1000 < new Date(value).getTime()) {
          callback(new Error('与开始时间之间大于14天'))
          return
        }
      }
      // 爆炸火灾/其他事件/房屋坍塌 时间区间21天
      if (['3404523707', '3404523708', '3404523709'].includes(eventConfigId)) {
        if (startTime.getTime() + 21 * 24 * 60 * 60 * 1000 < new Date(value).getTime()) {
          callback(new Error('与开始时间之间大于21天'))
          return
        }
      }
      if (new Date(startTime) >= new Date(value)) {
        callback(new Error('结束时间不能小于或等于开始时间'))
        return
      }
      callback()
    }
    return {
      // 开始时间禁止选择配置
      startDateTimePickerOptions: {
        disabledDate: (time) => {
          // 根据结束时间来决定
          const eventConfigId = this.formParams.eventTypeObj.id
          // 结束时间
          const endTime = new Date(this.formParams.endTime)
          // 防汛防台 时间区间14天
          if (eventConfigId === '9999') {
            // 由于el选择器问题，我们实际上需要前后多出1天的事件，否则当天无法选择
            if (endTime.getTime() - 15 * 24 * 60 * 60 * 1000 <= time.getTime() && time.getTime() < endTime.getTime()) {
              return false
            } else {
              return true
            }
          }
          // 爆炸火灾/其他事件/房屋坍塌 时间区间21天
          if (['3404523707', '3404523708', '3404523709'].includes(eventConfigId)) {
            // 由于el选择器问题，我们实际上需要前后多出1天的事件，否则当天无法选择
            if (endTime.getTime() - 22 * 24 * 60 * 60 * 1000 <= time.getTime() && time.getTime() < endTime.getTime()) {
              return false
            } else {
              return true
            }
          }
          return false
        }
      },
      // 结束时间禁止选择配置
      endDateTimePickerOptions: {
        disabledDate: (time) => {
          // 根据结束时间来决定
          const eventConfigId = this.formParams.eventTypeObj.id
          // 结束时间
          const startTime = new Date(this.formParams.startTime)
          if (eventConfigId === '9999') {
            // 由于el选择器问题，我们实际上需要前后多出1天的事件，否则当天无法选择
            if (startTime.getTime() + 14 * 24 * 60 * 60 * 1000 >= time.getTime() && time.getTime() > startTime.getTime() - 1 * 24 * 60 * 60 * 1000) {
              return false
            } else {
              return true
            }
          }
          // 爆炸火灾/其他事件/房屋坍塌 时间区间21天
          if (['3404523707', '3404523708', '3404523709'].includes(eventConfigId)) {
            // 由于el选择器问题，我们实际上需要前后多出1天的事件，否则当天无法选择
            if (startTime.getTime() + 21 * 24 * 60 * 60 * 1000 >= time.getTime() && time.getTime() > startTime.getTime() - 1 * 24 * 60 * 60 * 1000) {
              return false
            } else {
              return true
            }
          }
          return false
        }
      },
      formParams: {
        // 保障主题
        situationName: '',
        // 保障区域数据，选中的数据数组
        areaData: [],
        // 事件开始时间
        startTime: '',
        // 事件结束时间
        endTime: '',
        // 保障类型(1为大型事件,这东西开发的时候说写死是1)
        protectionType: '1',
        // 保障类型对象（内部包含，id|eventConfigId保障类型ID（小类），situationType事件类型（大类）这两个需要传给后端的数据）
        eventTypeObj: {},
        // 监控方式
        situationFormatFlag: '0',
        // 事件原因
        eventCause: '',
        // 事件级别
        eventLevel: '',
        // 申请人名称
        staffName: '',
        // 审核人对象(从人员选择组件数据种来)
        verifyUser: {},
        // 备注说明
        remark: '',
        // 事件简介
        sdesc: '',
        // 事件图片路径
        photoName: '',
        // 事件标识
        groupFault: ''
      },
      rules: {
        situationName: { required: true, message: '请输入保障主题', trigger: 'change' },
        startTime: { required: true, validator: startTimePass, trigger: 'change' },
        endTime: { required: true, validator: endTimePass, trigger: 'change' },
        eventTypeObj: { required: true, validator: eventTypeObjPass, trigger: 'change' }
      },
      // 提交loading
      submitLoading: false
    }
  },
  components: {
    AvatarUploader
  },
  created () {
    // 初始化表单
    this.initFormParams()
  },
  computed: {
    // 选择区域的中文名称
    areaName () {
      return this.formParams.areaData.map((item) => {
        return item.name
      }).join(',')
    },
    // 开始时间是否禁用
    isStartDateTimeDisabled () {
      const eventConfigId = this.formParams.eventTypeObj.id
      if (getSituationIdForUrl() && this.eventStatus !== '') {
        // 防汛防台
        if (eventConfigId === '9999') {
          return true
        }
        // 爆炸火灾/其他事件/房屋坍塌 时间区间21天
        if (['3404523707', '3404523708', '3404523709'].includes(eventConfigId)) {
          return true
        }
      }
      return false
    },
    // 保障类型是否禁用
    isEventTypeObjDisabled () {
      const situationType = this.formParams.eventTypeObj.situationType
      // 如果事件创建了，那么只有通信重保才可以修改事件类型
      if (!getSituationIdForUrl()) {
        return false
      }
      if (situationType === '6') {
        return false
      }
      return true
    },
    // 审核人是否禁用
    isVerifyUserDisabled () {
      if (this.eventStatus === '1' || this.eventStatus === '') {
        return false
      }
      return true
    },
    // 是否显示保障区域表单
    isShowAreaInput () {
      const situationType = this.formParams.eventTypeObj.situationType
      switch (situationType) {
        // 通信重保
        case '6':
          return true
        // 重大故障
        case '12':
          return true
        // 突发事件
        case '18':
          return false
        default:
          return false
      }
    },
    // 是否显示事件标识表单
    isShowGroupFaultInput () {
      const situationType = this.formParams.eventTypeObj.situationType
      switch (situationType) {
        // 通信重保
        case '6':
          return false
        // 重大故障
        case '12':
          return true
        // 突发事件
        case '18':
          return false
        default:
          return false
      }
    }
  },
  methods: {
    // 清空保障区域
    clearAreaData () {
      this.formParams.areaData = []
    },
    // 选择保障区域
    selectCityArea () {
      const _this = this
      new this.$dialogbox({
        width: '1100px',
        dialogthem: 'titlebox-them-default',
        title: '选择区域',
        componentlist: [
          {
            name: 'shoppingCart',
            props: {
              searchComponent: 'PublicTreeDataList',
              // 这个是两边选择关联的id，是一个唯一id
              shoppingCarIdKey: 'id',
              tableClassId: '1',
              defaultShoppingCartList: this.formParams.areaData,
              rightTableOption: [
                // 这个是购物车右边显示的数据
                { key: 'name', label: '区域' },
                {
                  label: '类型',
                  w: '80px',
                  component: {
                    props: ['scope'],
                    render () {
                      let typeName = ''
                      if (this.scope.row.type === '1') {
                        typeName = '地市'
                      }
                      if (['2', '3'].includes(this.scope.row.type)) {
                        typeName = '场馆'
                      }
                      return <span>{typeName}</span>
                    }
                  }
                }
              ],
              ajaxType: 'post',
              tableOption: {
                // 这里面其实就是原本通用清单弹窗的配置，这个组件里面使用的就是通用清单
                url: '/service-zhwg-zb-zjmonitor/app/event/getCityAreaTree',
                searchbutton: true,
                border: true,
                params: {
                  domainId: { placeholder: '请选择', label: '地市', type: 'input', val: '' }
                },
                filter: {
                  placeholder: '请输入区域名称',
                  key: 'name'
                },
                treeProp: {
                  id: 'id',
                  label: 'name',
                  children: 'children'
                },
                path: 'data.data'
              },
              headerRightComponent: {
                render () {
                  return <el-button onClick={_this.linkCreateAreaView} type="primary">创建区域</el-button>
                },
                methods: {
                }
              }
            }
          }
        ]
      }).then(({ state, data }) => {
        if (state === 'save') {
          this.formParams.areaData = data
        }
      })
    },
    // 选择保障类型
    selectEventType () {
      const hoppingCartList = []
      if (JSON.stringify(this.formParams.eventTypeObj) !== '{}') {
        hoppingCartList.push(this.formParams.eventTypeObj)
      }
      // 弹窗事件类型参数
      let paramsSituationType = ''
      const situationType = this.formParams.eventTypeObj.situationType
      if (situationType === '6' && getSituationIdForUrl()) {
        paramsSituationType = '6'
      }
      const options = getEventConfigShoppingCartOption({ defaultShoppingCartList: hoppingCartList, situationType: paramsSituationType })
      new this.$dialogbox({
        width: '1200px',
        title: '选择保障类型',
        dialogthem: 'titlebox-them-default',
        componentlist: [
          {
            name: 'shoppingCart',
            props: options
          }
        ]
      }).then(({ state, data }) => {
        if (state === 'save') {
          console.log(data)
          this.$set(this.formParams, 'eventTypeObj', data)
          // this.formParams.eventConfigId = data.id
          // this.formParams.situationType = data.situationType
        }
      })
    },
    // 清除审核人
    clearVerifyUser () {
      this.formParams.verifyUser = {}
    },
    // 选择审核人
    selectVerifyUser () {
      new this.$dialogbox({
        width: '920px',
        dialogthem: 'titlebox-them-default',
        title: '选择系统人员',
        componentlist: [
          {
            name: 'zj-add-person',
            props: {
              them: 'white',
              checkbox: false
            }
          }
        ]
      }).then(({ state, data }) => {
        if (state === 'save') {
          if (data.length > 0) {
            this.formParams.verifyUser = data[0]
          }
        }
      })
    },
    linkCreateAreaView () {
      window.open('/web-zjdxzb-monitor/#/area/list')
    },
    // 图片上传回调
    upLoadUrlIcon ({ fileUrl }) {
      this.formParams.photoName = fileUrl
    },
    // 事件提交
    submitEventInfo () {
      this.$refs.formBox.validate((valid) => {
        if (valid) {
          this.editEvent({ eventCurrentStatus: '' })
        } else {
        }
      })
    },
    // 事件保存(从业务角度来说保存也是创建事件的)
    saveEventInfo () {
      this.$refs.formBox.validate((valid) => {
        if (valid) {
          this.editEvent({ eventCurrentStatus: '1' })
        } else {
        }
      })
    },
    /**
     * 创建事件|修改事件方法
     */
    editEvent ({ eventCurrentStatus }) {
      this.submitLoading = true
      // 拼接提交需要的参数
      const params = {
      }
      const affectIdArr = []
      const affectNameArr = []
      const venuesIdArr = []
      if (this.isShowAreaInput) {
        this.formParams.areaData.forEach(item => {
          if (item.type === '1') {
            affectIdArr.push(item.id)
            affectNameArr.push(item.name)
          }
          if (['2', '3'].includes(item.type)) {
            venuesIdArr.push(item.id)
          }
        })
        // 地市ID,多个用逗号分割
        params.affectId = affectIdArr.join(',')
        // 地市名称,多个用逗号分割
        params.affectName = affectNameArr.join(',')
        // 关联场馆编号,多个用逗号分割
        params.venuesId = venuesIdArr.join(',')
      }
      // 事件结束时间
      params.endTime = this.formParams.endTime + ':00'
      // 事件开始时间
      params.startTime = this.formParams.startTime + ':00'
      // 事件原因
      params.eventCause = this.formParams.eventCause
      // 保障类型ID
      params.eventConfigId = this.formParams.eventTypeObj.id
      // '事件提交状态  1=保存  ''=提交申请
      // 后端逻辑：如果传空则判断是否有审核人，如果存在审核人状态会更新到2，如果没有审核人状态更新到3
      // 如果传如状态则会根据事件id将当前的信息以及状态更新
      // 事件id为空的情况下会去新生成一个事件，但是eventCurrentStatus依旧会走以上的逻辑，因为存在一开始就点提交申请的情况
      params.eventCurrentStatus = eventCurrentStatus
      // 事件等级
      params.eventLevel = this.formParams.eventLevel
      // 事件标识
      if (this.isShowGroupFaultInput) {
        params.groupFault = this.formParams.groupFault
      }
      // 事件图片路径
      params.photoName = this.formParams.photoName
      // 保障类型(1为大型事件)
      params.protectionType = this.formParams.protectionType
      // 事件备注
      params.remark = this.formParams.remark
      // 事件描述
      params.sdesc = this.formParams.sdesc
      // 监控方式
      params.situationFormatFlag = this.formParams.situationFormatFlag
      // 事件id如果事件是存在的时候就必须传事件id，除了首次创建事件的时候eventStatus === ''
      if (this.eventStatus !== '' && getSituationIdForUrl()) {
        params.situationId = getSituationIdForUrl()
      }
      // 事件名称
      params.situationName = this.formParams.situationName
      // 事件类型id
      params.situationType = this.formParams.eventTypeObj.situationType
      // 事件审核人员ID
      params.verifyUserId = this.formParams.verifyUser.iStaffId || ''
      // 事件审核人员名称
      params.verifyUserName = this.formParams.verifyUser.sStaffName || ''
      this.http.postJson('/service-zhwg-zb-zjmonitor/app/event/createEvent', params).then(res => {
        const eventId = res.data?.data?.eventId || ''
        if (eventId) {
          this.$message.success('保存成功')
          let toStep = ''
          if (eventCurrentStatus === '') {
            // 点击的是提交申请，判断是否有审核人
            if (this.formParams.verifyUser.iStaffId) {
              // 填了审核人，跳转到保障审核界面
              toStep = '2'
            } else {
              // 没有填审核人，直接跳转到准备工作
              toStep = '3'
            }
          } else {
            // 点击的是保存
            toStep = '1'
          }
          // 将事件id置于url上
          window.history.replaceState(null, null, updateSituationIdParameter(window.location.href, eventId))
          // 通知父级，刷新整个事件流程
          this.$emit('refreshEventStep', { toStep })
        }
        this.submitLoading = false
      }).catch(() => {
        this.submitLoading = false
      })
    },
    // 打开事件pdf文件
    showEventPdfFile () {
      window.open('./pdf/event.pdf')
    },
    // 表单初始化
    initFormParams () {
      // 赋值申请人,不管事件是否申请过，申请人都必定是存在eventInfo
      this.formParams.staffName = this.eventInfo.staffName
      // 开始时间,从后端返回的数据会带上秒，我们需要将秒去除
      this.formParams.startTime = dateFormat('YY-mm-dd HH:MM', new Date(this.eventInfo.startTime))
      // 结束时间
      this.formParams.endTime = dateFormat('YY-mm-dd HH:MM', new Date(this.eventInfo.endTime))
      // 事件类型对象
      this.formParams.eventTypeObj = {
        id: this.eventInfo.eventConfigId,
        eventTypeName: this.eventInfo.eventTypeName,
        situationType: this.eventInfo.situationType,
        situationTypeName: this.eventInfo.situationTypeName
      }
      // 事件类型对象
      if (this.eventStatus !== '') {
        // 标识当前是存在事件
        // 保障主题
        this.formParams.situationName = this.eventInfo.situationName
        // 保障区域,场馆的type值有场馆群2跟子场馆3，因为这里业务没有需要因此没有保存起来，但是在代码的判断中需要根据type值来区分地市跟场馆
        // 可以暂时不管是场馆还是场馆群都写死2,只为了区分跟地市的区别,如果后期有要求区分场馆群跟场馆再跟后端沟通
        const areaData = []
        // 地市
        if (this.eventInfo.affectId) {
          const affectIdArr = this.eventInfo.affectId.split(',')
          const affectNameArr = this.eventInfo.affectName.split(',')
          affectIdArr.forEach((id, index) => {
            areaData.push({
              name: affectNameArr[index],
              id: id,
              type: '1'
            })
          })
        }
        // 场馆
        if (this.eventInfo.venuesIds) {
          const venuesIdsArr = this.eventInfo.venuesIds.split(',')
          const venuesNamesArr = this.eventInfo.venuesNames.split(',')
          venuesIdsArr.forEach((id, index) => {
            areaData.push({
              name: venuesNamesArr[index],
              id: id,
              type: '2'
            })
          })
        }
        this.formParams.areaData = areaData
        // 监控方式
        this.formParams.situationFormatFlag = this.eventInfo.situationFormatFlag
        // 事件原因
        this.formParams.eventCause = this.eventInfo.eventCause
        // 事件级别
        this.formParams.eventLevel = this.eventInfo.eventLevel
        // 审核人id不为null的时候证明存在审核人
        if (this.eventInfo.verifyUserId !== null) {
          this.formParams.verifyUser = {
            iStaffId: this.eventInfo.verifyUserId,
            sStaffName: this.eventInfo.verifyUserName
          }
        }
        // 备注说明
        this.formParams.remark = this.eventInfo.remark
        // 事件简介
        this.formParams.sdesc = this.eventInfo.sdesc
        // 事件图片路径
        this.formParams.photoName = this.eventInfo.photoName
        // 事件标识
        this.formParams.groupFault = this.eventInfo.groupFault
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.eventStep1-wrap {
  width: 100%;
  height: calc(100% - 10px);
  background-color: #fff;
  margin-top: 10px;
  overflow: auto;
  .eventStep1-form-box {
    display: flex;
    justify-content: center;
    .createEventForm {
      padding-top: 40px;
      width: 1000px;
      .el-form-item-box {
        display: flex;
        align-items: center;
        .form-item-button {
          margin-left: 10px;
        }
        .el-icon-question {
          margin-left: 10px;
          font-size: 20px;
          color: #02A7F0;
        }
      }
    }
  }
  .form-submit-box {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
