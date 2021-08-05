import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dict/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/dict',
    method: 'post',
    params
  })
}

export function addDict(params) {
  return request({
    url: '/dict/addDict',
    method: 'post',
    params
  })
}

export function editDict(params) {
  return request({
    url: '/dict/editDict',
    method: 'post',
    params
  })
}
export function deleteDict(params) {
  return request({
    url: '/dict/deleteDict',
    method: 'get',
    params
  })
}

export function update(params) {
  return request({
    url: '/dict',
    method: 'put',
    params
  })
}

export function remove(id) {
  return request({
    url: '/dict',
    method: 'delete',
    params: {
      id: id
    }
  })
}

export function getDicts(dictName) {
  return request({
    url: '/dict/getDicts/' + dictName,
    method: 'get'
  })
}

export function listTreeDict() {
  return request({
    url: '/dict/listTreeDict',
    method: 'get'
  })
}

export function listParentTreeSelect() {
  return request({
    url: '/dict/listParentTreeSelect',
    method: 'get'
  })
}
