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
        <EditTable :itable-data="baseData" :icolumns="columnData" :tableLoading="listLoading"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChart from '@/components/Echarts/BarChart'
import BasicLineChart from '@/components/Echarts/BasicLineChart'
import EditTable from '@/components/EditTable/EditTable'

// 访问数据接口
import { getList } from '@/api/case7/case7'
export default {
  name: 'Echartsdemo',
  components: { BarChart, BasicLineChart, EditTable },
  data() {
    return {
      currentView: 'BasicLineChart',
      listLoading: true,
      baseData: [
        // { id: 0,
        //   lab: '周一',
        //   high: 15,
        //   low: 6 },
        // { id: 1,
        //   lab: '周二',
        //   high: 14,
        //   low: 5 },
        // { id: 2,
        //   lab: '周三',
        //   high: 13,
        //   low: 2 },
        // { id: 3,
        //   lab: '周四',
        //   high: 17,
        //   low: 8 },
        // { id: 4,
        //   lab: '周五',
        //   high: 20,
        //   low: 9 },
        // { id: 5,
        //   lab: '周六',
        //   high: 19,
        //   low: 7 },
        // { id: 6,
        //   lab: '周日',
        //   high: 18,
        //   low: 2 }
      ],
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
          { field: 'lab', title: '日期', width: 120 },
          { field: 'high', title: '最高温度' },
          { field: 'low', title: '最低温度' }
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
        this.baseData = response.data.items
        this.listLoading = false
        // 更新图标数据
        this.createLineData()
      })
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
    }
  }
}
</script>

<style scoped>

</style>
