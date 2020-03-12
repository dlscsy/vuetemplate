/**
* @Description: 1、多条件表格查询（包括下拉框，文本框模糊查询，日期框，下拉树（待选））
* @Author 张雪
* @Date 2020/3/10
*/
<template>
  <el-row style="background-color: white; height: 87vh; padding: 20px 24px 8px">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="套餐时间">
        <el-date-picker v-model="queryParam.data.operatetime" type="date" placeholder="选择日期" style="width:160px;" />
      </el-form-item>
      <el-form-item label="套餐编码">
        <el-input v-model="queryParam.data.mealcode" placeholder="套餐编码" clearable style="width:160px;" />
      </el-form-item>
      <el-form-item label="套餐类型">
        <!--clearable - 可清空-->
        <!--filterable - 可搜索-->
        <el-select v-model="queryParam.data.mealtype" clearable filterable placeholder="请选择" @focus="loadMeal">
          <el-option
            v-for="item in mealoptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button style="min-width:98px" type="primary" @click="queryPage">查询</el-button>
      </el-form-item>

      <el-form-item label="套餐类型">
        <!--下拉树-->
        <tree-select
          :height="140"
          :data="selectTreeList"
          :default-props="defaultProps"
          :node-key="nodeKey"
          :checked-keys="defaultCheckedKeys"
          multiple
          clearable
          @popoverHide="popoverHide"
          @change="changeSelectedNodes"
        /> <!--multiple 控制是否可以多选-->
      </el-form-item>

    </el-form>
    <el-scrollbar style="height: 55vh">
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          prop="mealCode"
          label="套餐编码"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="mealName"
          :show-overflow-tooltip="true"
          label="套餐名称"
          align="center"
        />
        <el-table-column
          prop="effectiveDate"
          :show-overflow-tooltip="true"
          label="生效时间"
          align="center"
          :formatter="dateFormat"
        />
        <el-table-column
          prop="expiryDate"
          :show-overflow-tooltip="true"
          label="失效时间"
          align="center"
          :formatter="dateFormat"
        />
        <el-table-column
          prop="mealType"
          :show-overflow-tooltip="true"
          label="套餐类型"
          align="left"
        >
          <template slot-scope="scope">
            {{ scope.row.mealType | typeFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            {{ scope.row.status | statusFilter }}
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-footer>
      <el-pagination
        :current-page="queryParam.pageInfo.pageNum"
        :page-sizes="[10, 20,30,50]"
        :page-size="queryParam.pageInfo.pageSize"
        :total="queryParam.pageInfo.size"
        layout="total, sizes, prev ,pager, next, jumper"
        style="margin-top: 15px;text-align: center;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-row>

</template>
<script>
let that // 变量在filters使用
import api from '../../api/case1/case1'
import * as fecha from 'element-ui/lib/utils/date' // 日期转换引入fecha
// import下拉树组件
import TreeSelect from './components/tree-select.vue'
const reg = /[^\a-\z\A-\Z0-9_，,。、\u4E00-\u9FA5]/g // 正则
// 存储下拉树 选中数据
var selectTreeCheckIds

export default {
  components: { TreeSelect }, // 定义组件
  filters: {
    // 两种Filter 使用方法
    statusFilter: function(value) {
      // 套餐状态
      if (value === '1') {
        return '生效'
      } else if (value === '0') {
        return '失效'
      }
    },
    typeFilter: function(value) {
      // 套餐类型 编码 => 文字
      const index = that.mealoptions.findIndex(meal => meal.value === value)
      if (that.mealoptions[index]) {
        return that.mealoptions[index].name
      }
    }
  },
  data() {
    return {
      baMealItem: {
        id: '',
        mealCode: '',
        mealName: '',
        mealType: '',
        mealTypeTree: null,
        status: '',
        operatetime: ''
      },
      mealoptions: [], // select 套餐类型数据
      /* ---下拉树 begin--- */
      selectTreeList: [], // 存储下拉树数据
      defaultProps: { // 默认属性
        children: 'childrenList', // 子节点  可根据需求定义
        label: 'name' //  显示内容 可根据需求定义
      },
      nodeKey: 'id', // 节点 ，可根据需求定义
      defaultCheckedKeys: [], // 初始化默认值
      /* ---下拉树 end--- */
      tableData: [], // 表格展示的数据
      queryParam: {
        data: {
          operatetime: '',
          mealcode: '',
          mealtype: '',
          type: ''
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          size: 0,
          startRow: 0,
          endRow: 0,
          pages: 0,
          prePage: 0,
          nextPage: 0,
          isFirstPage: true,
          isLastPage: true,
          hasPreviousPage: false,
          navigatePages: 0,
          navigatepageNums: [],
          navigateFirstPage: 1,
          navigateLastPage: 1,
          total: 0
        }
      }
    }
  },
  mounted() { // 挂载 html加载完成后执行。执行顺序：子组件-父组件
    this.loadMeal() // 获取套餐类型数据
    this.defaultCheckedKeys = []
  },
  beforeCreate: function() { // 创建前
    that = this
  },
  created() { // html加载完成之前，执行。执行顺序：父组件-子组件
    this.queryPage()
  },
  methods: {
    // 点击select，加载套餐类型数据
    loadMeal() {
      if (this.mealoptions.length !== 0) {
        return
      }
      this.queryParam.type = 'TC' // 传输套餐类型type=‘TC’
      api.queryMeal(this.queryParam).then(data => {
        this.mealoptions = data.list

        /* 组织下拉树数据 */
        this.selectTreeList = []
        var obj = {}
        obj['id'] = ''
        obj['name'] = '套餐类型'
        obj['childrenList'] = []
        that.mealoptions.forEach(meal => {
          var objChildren = {}
          objChildren['id'] = meal.value
          objChildren['name'] = meal.name
          obj['childrenList'].push(objChildren)
        })
        this.selectTreeList.push(obj)
        console.log(this.selectTreeList)
      }).catch(err => {
        console.log(err)
      })
    },
    // 日期格式转换
    dateFormat(row, column, cellValue) {
      return cellValue ? fecha.format(new Date(cellValue), 'yyyy-MM-dd') : ''
    },
    /* --- 下拉树 begin --- */

    popoverHide(checkedIds, checkedData) {
      console.log(checkedIds)
      console.log(checkedData)
    },
    changeSelectedNodes(selectedData) {
      console.log(selectedData)
      selectTreeCheckIds = selectedData
    },
    /*  --- 下拉树 end --- */
    // 查询全部
    queryPage() { // 根据条件查询出所有的数据
      // 条件验证
      if (this.queryParam.data.mealcode !== null && this.queryParam.data.mealcode !== '') {
        if (reg.test(this.queryParam.data.mealcode)) {
          this.$message({
            message: '套餐编码不能输入特殊字符',
            type: 'warning',
            duration: 2000
          })
          return false
        }
        if (this.queryParam.data.mealcode.length > 6) {
          this.$message({
            message: '套餐编码长度不能超过6个字符',
            type: 'warning',
            duration: 2000
          })
          return false
        }
      }

      this.baMealItem.mealCode = this.queryParam.data.mealcode
      this.baMealItem.mealType = this.queryParam.data.mealtype
      this.baMealItem.operatetime = this.queryParam.data.operatetime
      this.baMealItem.mealTypeTree = selectTreeCheckIds
      debugger

      api.queryPage(this.baMealItem).then(data => {
        this.tableData = data.list
        this.queryParam.pageInfo.size = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 每页数据改变时
    handleSizeChange(val) {
      this.queryParam.pageInfo.pageSize = val
      this.queryPage(this.queryParam)
    },
    // 页数改变时
    handleCurrentChange(val) {
      this.queryParam.pageInfo.pageNum = val
      this.queryPage(this.queryParam)
    }
  }
}
</script>
<style scoped>
  .el-input--medium {
    width: 300px;
  }
  .el-select>.el-input {
    width: 300px;
  }
  .el-dialog__title {
    margin-left: 40% !important;
  }
</style>
