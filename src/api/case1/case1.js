import request from '@/utils/request'

/**
 * @Description: 1、多条件表格查询（包括下拉框，文本框模糊查询，日期框，下拉树（待选））
 * @Author 张雪
 * @Date 2020/3/10
 */
export default class TradeAnnexIssuedMainPageApi {
  static queryMeal(queryParam) {
    return request({
      url: '/testdemo/gencodeController/getBaseInfo',
      method: 'post',
      data: queryParam
    })
  }

  static queryPage(queryParam) {
    return request({
      url: '/testdemo/basetmealInfoController/getAllInfo',
      method: 'post',
      data: queryParam
    })
  }
}
