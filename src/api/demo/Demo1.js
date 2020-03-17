import request from '@/utils/request'
// import Qs from 'qs'

/**
 * @Description: demo
 * @Author chenyue
 * @Date 2020/3/5 15:00
 */
export default class Demo5Api {

  static getAllInfo(queryParam) {

    return request({
      url: '/px-demo/userController/getAllInfo',
      method: 'post',
      data: queryParam
    })
  }

  static deleteInfo(ids) {
    return request({
      url: '/px-demo/userController/deleteInfo',
      method: 'post',
      data: ids
    })
  }
  //npm install qs --save-dev
  static addInfo(userItem) {
    return request({
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      // },
      // transformRequest: [function(data) {      //在请求之前对data传参进行格式转换
      //   data = Qs.stringify(data)
      //   return data
      // }],
      url: '/px-demo/userController/addInfo',
      method: 'post',
      data: userItem
    })
  }
  static updateInfo(userItem) {
    return request({
      url: '/px-demo/userController/updateInfo',
      method: 'post',
      data: userItem
    })
  }
}
