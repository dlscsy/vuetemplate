<template>
  <div :id="datas.divid" class="container" />
</template>

<script>
// 引入基本模板
import echarts from 'echarts/lib/echarts'
// 引入折线图组件
import 'echarts/lib/chart/line'
// 引入提示框和图例组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
// 引入主题
import 'echarts/theme/macarons'
// 引入uuid文件，如果由于divid重复报错，则将:id值替换成elid
// import uuidv1 from 'uuid/v1'
export default {
  name: 'BasicLineChart',
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
          text: indata.title,
          subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高气温', '最低气温']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: indata.datalab
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: '最高气温',
            type: 'line',
            data: indata.valueData.high,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '最低气温',
            type: 'line',
            data: indata.valueData.low,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' },
                [{
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max'
                }, {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: '最大值'
                  },
                  type: 'max',
                  name: '最高点'
                }]
              ]
            }
          }
        ]
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
