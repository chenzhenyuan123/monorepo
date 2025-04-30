import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc";

dayjs.locale('zh-cn')
dayjs.extend(utc);

export const startEndTime = arr => {
  return (arr || [])
    .filter(v => !!v)
    .map((t, i) => dayjs(t)[i === 0 ? 'startOf' : 'endOf']('day').valueOf())
}

export const formatTime = timeString => {
  return dayjs(timeString).valueOf()
}

// 获取日期格式
export const formatDate = (date, type = 6) => {
  if (!date) return ''
  const DateFormat = {
    1: 'DD MMM YYYY',
    2: 'DD MMM YYYY HH:mm',
    3: 'DD MMM YYYY HH:mm:ss',
    4: 'YYYY-MM-DD',
    5: 'YYYY-MM-DD HH:mm',
    6: 'YYYY-MM-DD HH:mm:ss',
    7: 'YYYYMMDDHHmmss',
    8: 'YYYY年M月D日',
    9: 'YYYY年MM月DD日 HH:mm:ss'
  }
  return dayjs(date).format(DateFormat[type])
}
// 获取日期的毫秒数
export const getDateLong = date => {
  if (!date) return ''
  return dayjs(date).valueOf()
}

export function isDuring(beginDateStr, endDateStr) {
  const curDate = new Date()
  const beginDate = new Date(beginDateStr)
  const endDate = new Date(endDateStr)
  if (curDate >= beginDate && curDate <= endDate) {
    return true
  }
  return false
}

/**
 * 时间差
 * @param {*} dateArr 时间戳数组[时间1,时间2]
 * @param {*} type day, month, year
 * @returns  number
 */
export const getDateDiff = (dateArr = [], type = 'day') => {
  if (!dateArr.length === 0) return ''
  return Math.abs(dayjs(dateArr[0]).diff(dateArr[1], type))
}

export const splitDateRange = (val, form, start, end) => {
  const arr = startEndTime(val)
  form[start] = arr[0]
  form[end] = arr[1]
}

export function isDuringHour(beginHourStr, endHourStr) {
  const curHour = dayjs().hour()
  if (curHour >= beginHourStr && curHour < endHourStr) {
    return true
  }
  return false
}
