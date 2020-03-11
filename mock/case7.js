import Mock from 'mockjs'

const data = Mock.mock({
  'tempData|10': [{
    id: '@id',
    'lab|1': ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    low: '@integer(-5, 10)',
    high: '@integer(10, 30)'
  }]
})

export default [
  {
    url: '/vue-admin-template/case7/baseData',
    type: 'get',
    response: config => {
      const items = data.tempData
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
