import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/service-sgboot/api/weather',
    method: 'get',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/service-sgboot/api/weather',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/service-sgboot/api/weather',
    method: 'put',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/service-sgboot/api/weather',
    method: 'delete',
    data: params
  })
}
