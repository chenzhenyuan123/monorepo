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