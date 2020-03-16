import Mock from 'mockjs'
const List = []
const count = 100
const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    platforms: ['a-platform']
  }))
}
export default [
  {
    url: '/vue-admin-template/case6/test',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  }
]
