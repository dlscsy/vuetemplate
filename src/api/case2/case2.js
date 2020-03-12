import request from '@/utils/request'

/**
 * @Description: 主页面表格，弹出form表单，表单中包括单选框，多选框，Switch 开关，并加表单验证
 * @Author 张雪
 * @Date 2020/3/11
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

  static deleteGroup(ids) {
    return request({
      url: '/testdemo/basetmealInfoController/deleteInfo',
      method: 'post',
      data: ids
    })
  }
  static addGroup(baMealItem) {
    return request({
      url: '/testdemo/basetmealInfoController/addInfo',
      method: 'post',
      data: baMealItem
    })
  }
  static updateGroup(baMealItem) {
    return request({
      url: '/testdemo/basetmealInfoController/updateInfo',
      method: 'post',
      data: baMealItem
    })
  }
}
