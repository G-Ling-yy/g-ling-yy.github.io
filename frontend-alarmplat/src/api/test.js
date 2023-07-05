import request from '@/utils/request'
// 任务列表查询
export function getTaskPageList(data) {
  return request({
    url: `/task/page/list`,
    method: 'post',
    data
  })
}
// 新增任务
export function addTask(data) {
  return request({
    url: `/task/add`,
    method: 'post',
    data
  })
}
// 编辑任务
export function editTask(data) {
  return request({
    url: `/task/edit/id`,
    method: 'post',
    data
  })
}
export function getTaskById(id) {
  return request({
    url: `/task/get/${id}`,
    method: 'get'
  })
}
// 删除任务
export function delTaskById(id) {
  return request({
    url: `/task/del/${id}`,
    method: 'get'
  })
}
// 批量删除任务
export function delTaskByIds(ids) {
  return request({
    url: `/task/del/ids?ids=${ids}`,
    method: 'get'
  })
}

