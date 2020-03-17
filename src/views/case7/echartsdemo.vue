<template>
  <div>
    <el-row>
      <el-row type="flex" class="row-bg" justify="end">
        <el-button type="text" style="font-size: 30px;padding: 0px;" icon="el-icon-sort" @click="switch_chart(currentView)" />
      </el-row>
      <el-col :span="12">
        <component :is="currentView" :datas="barData" style="height: 400px" />   <!--挂载子组件,chartdata为传入的数据-->
      </el-col>
      <el-col :span="12">
        <EditTable
          :itable-data="baseData"
          :icolumns="columnData"
          :table-loading="listLoading"
          @add="addData($event)"
          @edit="editData($event)"
          @del="delData($event)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChart from '@/components/Echarts/BarChart'
import BasicLineChart from '@/components/Echarts/BasicLineChart'
import EditTable from '@/components/EditTable/EditTable'
import moment from 'moment'
// 访问数据接口
import { getList, add, edit, del } from '@/api/case7/case7'
export default {
  name: 'Echartsdemo',
  components: { BarChart, BasicLineChart, EditTable },
  data() {
    return {
      currentView: 'BasicLineChart',
      listLoading: true,
      baseData: [],
      barData: {
        title: null,
        divid: 'mybarcharts',
        datalab: [],
        valueData: {
          high: [],
          low: []
        }
      },
      columnData:
        [
          { field: 'lab', title: '日期', type: 'date', width: 150 },
          { field: 'high', title: '最高温度', type: 'number' },
          { field: 'low', title: '最低温度', type: 'number' }
        ]
    }
  },
  // 监听getdata,如果变化更新图表数据
  watch: {
    baseData: {
      handler(newvalue, oldvalue) {
        this.createLineData()
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    switch_chart(cv) {
      switch (cv) {
        case 'BarChart':
          this.currentView = 'BasicLineChart'
          break
        case 'BasicLineChart':
          this.currentView = 'BarChart'
          break
      }
    },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        // 因为data是数组数据,所以更新要用$set更新数据,这样子控件才能触发数据变化的监控
        for (var i in response.data) {
          response.data[i].lab = this.dateFormat(response.data[i].lab)
          this.$set(this.baseData, i, response.data[i])
        }
        this.listLoading = false
        // 更新图标数据
        this.createLineData()
      })
    },
    addData(row) {
      add(row).then(
        response => {
          this.fetchData()
        }
      )
    },
    editData(row) {
      edit(row).then(
        response => {
          this.fetchData()
        }
      )
    },
    delData(id) {
      del(id).then(
        response => {
          this.fetchData()
        }
      )
    },
    createLineData() {
      this.barData.datalab = []
      this.barData.valueData.high = []
      this.barData.valueData.low = []
      var cd = 0
      for (var i in this.baseData) {
        this.barData.datalab.push(this.baseData[i].lab)
        this.barData.valueData.high.push(this.baseData[i].high)
        this.barData.valueData.low.push(this.baseData[i].low)
        cd = cd + 1
      }
      this.barData.title = '最近' + cd + '气温统计'
    },
    dateFormat(fdate) {
      return moment(fdate).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>

</style>
