import FingerprintJS from '@fingerprintjs/fingerprintjs'

/**
 * 存储数据时记录当前时间戳和设定的失效时间
 * @param key
 * @param value
 * @param num 失效时间(分钟)
 */
function setNonExpiredData(key, value, num = 30) {
  // 存储数据时记录当前时间戳和设定的失效时间（例如10分钟后失效）
  const dataToStore = {
    // 当前时间加 num 分钟转换为时间戳
    expires: new Date().getTime() + num * 60 * 1000,
    value,
  };
  try {
    localStorage.setItem(key, JSON.stringify(dataToStore));
  } catch (error) {
    console.log('setNonExpiredData localStorage.setItem error')
    return false
  }
}

function getNonExpiredData(key) {
  let storedData
  try {
    storedData = localStorage.getItem(key);
  } catch (error) {
    console.log('getNonExpiredData localStorage.getItem error')
    return false
  }
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    if (new Date().getTime() < parsedData.expires) {
      return parsedData.value;
    } else {
      // 如果数据过期，可以删除它
      localStorage.removeItem(key);
      return null; // 或者抛出一个错误，根据具体需求而定
    }
  } else {
    return null;
  }
}

/**
 * 获取设备 id
 */
export async function getDeviceId() {
  let _visitorId = getNonExpiredData("visitorId");
  if (_visitorId === false) return false

  if (!_visitorId) {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    if (result?.visitorId) {
      setNonExpiredData("visitorId", result.visitorId, 24 * 60);

      return { visitorId: result.visitorId };
    }
  } else {
    return { visitorId: _visitorId };
  }
}

/**
 * 数组转字典
 * @param arr 数组，或类数组（含有 1、2、3、等等，和 length）
 * @param label
 * @param value
 */
export function arrToDict(arr, { label = 'label', value = 'value' } = {}) {
  const dict = {}
  for (let i = 0, l = arr.length; i < l; i++) {
    const item = arr[i]
    // 无数据时跳过
    if (item[value] === undefined) continue
    // 保留全部数据
    if (label === null) {
      dict[item[value]] = item
      continue
    }
    dict[item[value]] = item[label]
  }
  return dict
}