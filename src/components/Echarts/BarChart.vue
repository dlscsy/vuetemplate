<template>
  <div :id="datas.divid" class="container" />
</template>

<script>
// 引入基本模板
import echarts from 'echarts/lib/echarts'
// 引入柱状图组件
import 'echarts/lib/chart/bar'
// 引入提示框和图例组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
// 引入主题
import 'echarts/theme/macarons'
// 引入uuid文件，如果由于divid重复报错，则将:id值替换成elid
// import uuidv1 from 'uuid/v1'
export default {
  name: 'BarChart',
  props: {
    datas: {}
  },
  data() {
    return {
      myChart: null
    }
  },
  // 深度监听，父组件传来的datas，当改变时重新绘制图表
  watch: {
    datas: {
      handler(newvalue, oldvalue) {
        this.drawGraph(newvalue.divid, newvalue)
      },
      deep: true
    }
  },
  // created(){
  //     this.elId = uuidv1() //获取随机id
  // },
  mounted() {
    this.drawGraph(this.datas.divid, this.datas)
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.clear()
    }
  },
  methods: {
    drawGraph(id, indata) {
      const option = {
        title: {
          text: indata.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: indata.datalab,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'// ,max: 25
        },
        series: [{
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: indata.valueData.high,
          type: 'bar'
        }]
      }
      this.myChart = echarts.init(document.getElementById(id), 'macarons')
      this.myChart.setOption(option)
      window.onresize = this.myChart.resize()
    }
  }
}
</script>

<style scoped>
  /*必须定义div大小，否则无法显示图标
  也可以在调用处设置大小
  */
  .container {
    width: 100%;
    height: 100%;
  }
</style>
