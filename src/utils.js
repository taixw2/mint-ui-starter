import _ from 'lodash'

export const noop = () => {}

export function objIsEmpty(obj) {
  return !!Object.keys(obj).length
}

export function getQueryString(name, query) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const res = query ? query.match(reg) : location.search.substr(1).match(reg)
  return res ? decodeURIComponent(res[2]) : null
}

export function getHashString(name, hash) {
  let theHash = hash || location.hash
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  //eslint-disable-line
  theHash = theHash.match(/#([^?]*)(\?|$)/g)[1]
  const res = theHash ? theHash.match(reg) : location.search.substr(1).match(reg)
  return res ? decodeURIComponent(res[2]) : null
}

export function formatDate(date, fmt = 'yyyy/MM/dd hh:mm:ss') {
  let myDate = date
  let myFormat = fmt
  if (typeof date === 'number') myDate = new Date(date)
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
  }

  if (/(y+)/.test(fmt)) myFormat = fmt.replace(RegExp.$1, (String(myDate.getFullYear())).substr(4 - RegExp.$1.length))

  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(myFormat)) {
      myFormat = myFormat.replace(RegExp.$1, (RegExp.$1.length === 1) ?
          (o[k]) :
          ((`00${o[k]}`).substr(String(o[k]).length)))
    }
  })
  return myFormat
}

  /**
   * toDouble
   */
export function toDouble(num) {
  return num < 10 ? `0${num}` : num
}
  /**
   * 生成时间区间
   */
export function getTimeDaterange(timeStart, timeEnd) {
  return `${formatDate(timeStart, 'yyyy-MM-dd')}至${formatDate(timeEnd, 'yyyy-MM-dd')}`
}

/**
 * 生成时间所在月份的时间区间，
 * 设置最大的的天数，
 * 系统自动将超过的天数折合到下个月
 * 用最大的天数减去超出的填出得出这个月最大的天数
 * 避免了计算闰年平年二月的麻烦
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
export function getTimeDaterangeByMonth(date) {
  const dateStart = date
  const dateEnd = new Date(dateStart)
  const originalMonth = dateEnd.getMonth()
  let MaxDate = 31
  dateStart.setDate(1)
  dateEnd.setDate(MaxDate)
  const newMonth = dateEnd.getMonth()
  const dateEndDay = dateEnd.getDate()
  if (newMonth !== originalMonth) {
    MaxDate -= dateEndDay
    dateEnd.setMonth(originalMonth)
    dateEnd.setDate(MaxDate)
  }
  return getTimeDaterange(dateStart, dateEnd)
}

export function count(...arg) {
  let args = arg
  let thisCount = 0
  if (_.isArray(arg[0])) {
    args = arg[0]
  }
  args.forEach((v) => {
    thisCount += Number(v)
  })
  return thisCount
}

export function decodeHtml(domString) {
  if (!domString) return ''
  const decodeData = domString
  const REGX_HTML_DECODE = /&\w+;|&#(\d+);|<\w+>/g
  const HTML_DECODE = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&nbsp;': ' ',
    '&quot;': '"',
    '©': '',
    '<br>': '\n',   // 后端将\n转成了<br>
  }

  if (_.isPlainObject(decodeData)) {
    Object.keys(decodeData).forEach((v) => {
      if (typeof decodeData[v] === 'string') {
        decodeData[v] = decodeHtml(decodeData[v])
      }
    })
  } else {
    return String(decodeData).replace(REGX_HTML_DECODE,
      m => (HTML_DECODE[m] ? HTML_DECODE[m] : m))
  }

  return decodeData
}
