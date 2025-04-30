/**
 * 将query对象替换到url的query位置
 * @param {*} Q
 */
export function queryStringify(Q) {
  const Q2Str = Object.entries(Q).reduce((str, kv) => `${str}${str ? '&' : '?'}${kv[0]}=${kv[1]}`, '')
  history.pushState(
    null,
    document.title,
    `${window.location.href.split('?')[0]}${Q2Str}`
  )
}

/**
 * 将hash替换到url的hash位置
 * @param {*} Q
 */
export function changeHash(hash) {
  const url = `${window.location.href.split('#')[0]}${hash}${window.location.search}`
  history.pushState(
    null,
    document.title,
    url
  )
}

/**
 * 生成替换了部分query的url
 * @param {*} obj
 */
export function getHrefForQuery(obj) {
  const Q = parseQuery() || {}

  Object.assign(Q, obj)

  const Q2Str = Object.entries(Q).reduce((str, kv) => `${str}${str ? '&' : '?'}${kv[0]}=${kv[1]}`, '')

  return `${window.location.href.split('?')[0]}${Q2Str}`
}

export function parseQuery() {
  if (!window.location.search) return {}

  return queryStringToObject(window.location.search.substring(1))
}

function queryStringToObject(queryString) {
  let obj = {};
  let arr = queryString.split("&");
  for(let i = 0; i < arr.length; i++){
    let temp = arr[i].split("=");
    obj[temp[0]] = temp[1];
  }
  return obj;
}

export function scrollToAnchor(anchorName) {
    var anchorElement = document.getElementById(anchorName);
    if(anchorElement) {
      // 移动端滚动失效，加setTimeout
      const t1 = setTimeout(() => {
        anchorElement.scrollIntoView({ behavior: 'smooth' });
        clearTimeout(t1)
      })
      const t = setTimeout(() => {
        changeHash(`#${anchorName}`)
        clearTimeout(t)
      })
    }
}
