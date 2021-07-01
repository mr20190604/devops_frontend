import request from '@/utils/request'

/**
 * 获取各等级报警数
 */
export function getAlarmLevelCount() {
  return request({
    url: '/gas/screen/getAlarmLevelCount',
    method: 'get'
  })
}

/**
 * 获取报警列表
 */
export function queryAlarmList() {
  return request({
    url: '/gas/screen/queryAlarmList',
    method: 'get'
  })
}

/**
 * 获取报警详情
 * @param alarmId 报警编号
 */
export function queryAlarmInfo(alarmId) {
  return request({
    url: '/gas/screen/queryAlarmInfo',
    method: 'get',
    params: {
      alarmId
    }
  })
}

/**
 * 获取大屏报警统计曲线
 * @param type 类型 day month year
 */
export function queryAlarmStatistical(type) {
  return request({
    url: '/gas/screen/queryAlarmStatistical',
    method: 'get',
    params: {
      type
    }
  })
}

/**
 * 获取燃气大屏今日、累计报警数据
 */
export function queryAlarmCount() {
  return request({
    url: '/gas/screen/queryAlarmCount',
    method: 'get'
  })
}

