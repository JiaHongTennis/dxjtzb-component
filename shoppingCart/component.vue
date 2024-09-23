<template>
  <div ref="diaboxcontent" :class="['bodyCss', `bodyCss_${tableClassId}`]">
    <!-- main -->
    <div class="shoppingCart-main">
      <!-- leftMain -->
      <div :class="['leftMain', `leftMain_${tableClassId}`]">
        <component
          :is="searchComponent"
          :isInitSearch="isInitSearch"
          :multipleTableHeight="`${height}px`"
          :shoppingCart="{ data: shoppingCartList, dataIdKey: shoppingCarIdKey }"
          :headerRightComponent="headerRightComponent"
          @selectHandel="selectHandel"
          @selectRadioHandel="selectRadioHandel"
          :isShowCheckBox="true"
          :selectType="selectType"
          :tableClassId="tableClassId"
          :ajaxType="ajaxType"
          :option="tableOption"></component>
      </div>
      <!-- rightMain -->
      <div :class="['rightMain', `rightMain_${tableClassId}`]">
        <el-table
          :class="$getkttableclass(tableClassId)"
          size="mini"
          :height="`${height}px`"
          ref="searchTable"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
          :data="shoppingCartList"
        >
          <el-table-column fixed="left" label="序号" width="50px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            :key="index"
            v-for="(column, index) in rightTableOption"
            show-overflow-tooltip
            :prop="column.key"
            :label="column.label"
          >
            <template slot-scope="scope">
              <template v-if="column.component">
                <component :scope="scope" :is="column.component"></component>
              </template>
              <template v-else>
                {{ scope.row[column.key] }}
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 尾部 -->
    <div :class="['footer', `footer_${tableClassId}`]">
      <el-button type="primary" size="mini" @click="saveHandel">保存</el-button>
      <el-button size="mini" @click="closeHandel">取消</el-button>
    </div>
  </div>
</template>

<script>
// 购物车
import Publictable from '../ref-list-dialog/component'
import PublicTreeDataList from '../PublicTreeDataList/component'

export default {
  name: 'shoppingCart',
  props: {
    // 作为搜索的主体组件
    searchComponent: {
      type: String,
      default: 'Publictable'
    },
    ajaxType: {
      type: String,
      require: 'post'
    },
    height: {
      type: Number,
      default: 600
    },
    selectType: {
      type: String,
      default: 'checkbox'
    },
    close: {
      type: Function,
      require: true
    },
    savedata: {
      type: Function,
      require: true
    },
    tableOption: {
      type: Object,
      require: true
    },
    rightTableOption: {
      type: Array,
      require: true
    },
    shoppingCarIdKey: {
      type: String,
      require: true
    },
    isInitSearch: {
      type: Boolean,
      default: true
    },
    tableClassId: {
      type: String,
      default: '0'
    },
    // 默认右侧购物车数据，一般用于回显
    defaultShoppingCartList: {
      type: Array,
      default () {
        return []
      }
    },
    // 头部右侧内容
    headerRightComponent: {
      type: Object,
      default () {
        return null
      }
    }
  },
  created () {
    // 赋值默认的值
    this.shoppingCartList = this.defaultShoppingCartList
  },
  components: {
    Publictable,
    PublicTreeDataList
  },
  data () {
    return {
      // 购物车数据
      shoppingCartList: []
    }
  },
  methods: {
    selectRadioHandel ({ selection }) {
      // 以shoppingCarIdKey作为key格式化为对象方便查找
      this.shoppingCartList = [selection]
    },
    selectHandel ({ totalData, selection }) {
      // 以shoppingCarIdKey作为key格式化为对象方便查找
      const shoppingCartObjData = {}
      const selectionObj = {}
      this.shoppingCartList.forEach(item => {
        shoppingCartObjData[item[this.shoppingCarIdKey]] = item
      })
      selection.forEach(item => {
        selectionObj[item[this.shoppingCarIdKey]] = item
      })
      // 根据数据筛选购物车，需要一个唯一id来做号映射关系
      totalData.forEach(dataItem => {
        // 获取id
        const shoppingCarId = dataItem[this.shoppingCarIdKey]
        // 判断id是否是选中状态
        if (selectionObj[shoppingCarId]) {
          // 如果是选中状态则，判断是否在购物车中
          if (!shoppingCartObjData[shoppingCarId]) {
            // 如果不在购物车中则添加
            this.shoppingCartList.push(dataItem)
          }
        } else {
          // 如果不是选中状态，判断是否在购物车中
          if (shoppingCartObjData[shoppingCarId]) {
            // 如果在购物车中则根据id删除
            let shoppingCarIdForIndex = -1
            for (let i = 0; i < this.shoppingCartList.length; i++) {
              const shoppingItem = this.shoppingCartList[i]
              if (shoppingItem[this.shoppingCarIdKey] === shoppingCarId) {
                shoppingCarIdForIndex = i
              }
            }
            if (shoppingCarIdForIndex > -1) {
              // 删除
              this.shoppingCartList.splice(shoppingCarIdForIndex, 1)
            }
          }
        }
      })
    },
    saveHandel () {
      if (this.shoppingCartList.length === 0) {
        this.$message.warning('请最少选中一条数据')
        return
      }
      if (this.savedata) {
        // 有可能不在弹窗中
        if (this.selectType === 'radio') {
          this.savedata(this.shoppingCartList[0])
        }
        if (this.selectType === 'checkbox') {
          this.savedata(this.shoppingCartList)
        }
      }
      if (this.selectType === 'radio') {
        this.$emit('selectShoppingCart', this.shoppingCartList[0])
      }
      if (this.selectType === 'checkbox') {
        this.$emit('selectShoppingCart', this.shoppingCartList)
      }
    },
    // 关闭弹窗
    closeHandel () {
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.bodyCss {
  transform: none;
  overflow: hidden;
  &.bodyCss_0{
    background-color: #fff;
  }
  .shoppingCart-main {
    display: flex;
    .leftMain {
      width: calc(100% - 200px);
      height: 100%;
      border-right: none;
      .search{
        width: 100%;
        .search-top{
          padding: 10px;
          padding-bottom: 0;
          display: flex;
          .search-top-left {
            flex: 1;
          }
        }
      }
      &.leftMain_0 {
        border: 1px solid #99bbe8;
      }
      &.leftMain_1 {
        border: 1px solid #66b1ff;
      }
    }
    .rightMain {
      width: 200px;
      flex: 1;
      &.rightMain_0{
        border: 1px solid #99bbe8;
      }
      &.rightMain_1{
        border: 1px solid #66b1ff;
      }
    }
  }
  .footer {
    border-collapse: collapse;
    height: 46px;
    word-wrap: break-word;
    word-break: break-all;
    text-align: center;
    align-items: center;
    line-height: 42px;
    border: 1px solid #66b1ff;
    border-top: 0px;
    &.footer_0 {
      background: #e3f1fc;
    }
    &.footer_1 {
      background: #0075b9;
    }
  }
}
</style>
