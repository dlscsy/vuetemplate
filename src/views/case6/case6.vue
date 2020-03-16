<template>
  <div class="app-container">
    <!-- stripe ：隔行变色（斑马色）；span-method : 单元格合并； cell-style : 单元格样式修改； -->
    <el-table
      v-loading="dataLoading"
      :data="tableData"
      :stripe="stripFunction"
      :span-method="cellSpanMethod"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :cell-style="cellStyleMethod"
      @row-click="rowClickMethod"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="150">
      </el-table-column>
      <el-table-column label="配送信息">
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column label="地址">
          <el-table-column
            prop="province"
            label="省份"
            width="120">
          </el-table-column>
          <el-table-column
            prop="city"
            label="市区"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
            width="300">
          </el-table-column>
          <!--<el-table-column
            prop="zip"
            label="邮编"
            width="120">
          </el-table-column>-->
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="translate"
        label="是否"
        width="150"
        :formatter="formatResultMethod" >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
// import { case6GetDataTest } from '@/api/case6'
export default {
  data() {
    return {
      tableTripe: true,
      dataLoading: false,
      stripFunction: true,
      translateMap: { 0: '否', 1: '是' },
      tableData: []
    }
  },
  created() {
    // case6GetDataTest()
    this.getData()
  },
  methods: {
    getData() {
      this.tableData = this.queryData()
      this.dataLoading = false
    },
    formatResultMethod(row, column, cellValue, index) {
      return this.translateMap[row.translate]
    },
    rowClickMethod(row, column, event) {
      alert(row.date)
    },
    queryData() {
      return [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        translate: 0
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        translate: 1
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        translate: 0
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        translate: 1
      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        translate: 0
      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        translate: 1
      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        translate: 0
      }]
    },
    cellSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          // 合并单元格，返回值为一个数组，数组的第一个值为rowspan，数组的第二个值为colspan
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    cellStyleMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 && columnIndex === 2) {
        // 注意，返回值为css的样式字符串，如果有多个样式，中间用“;”隔开
        // 类似于原来html中style的值得写法
        return 'text-align:right;background:blue'
      } else {
        return 'text-align:center'
      }
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
