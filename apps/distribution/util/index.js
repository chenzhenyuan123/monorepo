import { parseQuery } from '@/util/router.js'
import currency from 'currency.js'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import ClipboardJS from 'clipboard'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Warning, CircleCheck } from '@element-plus/icons-vue';
import { useSettingStore } from '@/store/settingState'
import { toLogout } from '@/util/auth.js'
import { useNuxtApp } from '#app'
import { useAccountDisableStore } from '@/store/accountDisableState'

const accountDisableStore = useAccountDisableStore()

/**
 * 是否是移动端
 * @returns {boolean}
 */
export function isMobile() {
  return useSettingStore().isMobile
}

//国际化转换
export function translateI18n(key) {
  const { $t } = useNuxtApp();
  return $t(key);
}

// 判断安卓
export function isAndroid() {
  var u = navigator.userAgent;
  if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
      if (window.ShowFitness !== undefined) return true;
  }
  return false;
}

// 判断设备为 ios
export function isIos() {
  var u = navigator.userAgent;
  if (u.indexOf("iPhone") > -1 || u.indexOf("iOS") > -1) {
      return true;
  }
  return false;
}

export function currencyFormat(num, precision = 2) {
  return currency(num, { pattern: '#', precision }).format()
}

// window.FingerprintJS = FingerprintJS


/**
 * 获取设备 id
 */
export function getDeviceId() {
  const fpPromise = FingerprintJS.load()
  return fpPromise.then(fp => fp.get())
  // .then(result => {
  //   // This is the visitor identifier:
  //   const visitorId = result.visitorId
  // })
}

/**
 * 复制到剪切板
 * @param str
 */
export function copyContent(str) {

  // 动态创建 input 元素
  var aux = document.createElement("input");

  // 获得需要复制的内容
  aux.setAttribute("value", str);

  // 添加到 DOM 元素中
  document.body.appendChild(aux);

  // 执行选中
  // 注意: 只有 input 和 textarea 可以执行 select() 方法.
  aux.select();

  // 获得选中的内容
  var content = window.getSelection().toString();

  // 执行复制命令
  document.execCommand("copy");

  // 将 input 元素移除
  document.body.removeChild(aux);

  successMessage('复制成功')
}

/**
 * 复制到剪切板
 * @param str
 */
export function copyToClipboard(str) {
  function fallbackCopy(text) {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '-9999px'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'
      textarea.style.fontSize = '16px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    } catch (e) {
      return false
    }
  }

  if (fallbackCopy(str)) {
    return true
  } else {
    errorMessage(translateI18n('common.browserNotSupportCopy'))
    return false
  }
}

/**
 * 读取剪切板
 */
export function readClipboard() {
  if (!navigator.clipboard) return Promise.reject()
  return navigator.clipboard.readText()
}

/**
 * 关闭当前页面
 */
export function windowClose() {
  window.opener = null
  window.close()
}

/**
 * 成功信息
 */
export function successMessage(message, duration) {
  ElMessage({
    message,
    type: 'success',
    customClass: 'success-message-box', // 使用自定义的类名
    duration: duration || 3000,
    icon: CircleCheck,
    showClose: true,
    grouping: true
  })
}

/**
 * 失败信息
 */
export function errorMessage(message, duration) {
  ElMessage({
    message,
    type: 'error',
    customClass: 'error-message-box', // 使用自定义的类名
    duration: duration === undefined ? 5000 : duration,
    icon: Warning,
    showClose: true,
    grouping: true
  })
}

// ElMessageBox弹窗-账号禁用时展示${t('products.productsJoin')}
export function messageBox(type) {
  const { $t: t } = useNuxtApp()
  return ElMessageBox.alert(
    `<div class="header">
      <div class="circle-box">
        <div class="circle-box1">
          <div class="circle-box2">
            <div class="circle-box3">
              <div class="circle-box4"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="key-icon">
        <el-icon class="icon-Warning" />
      </div>
    </div>
    <h3 class="title">${t('login.accountDeactivated')}</h3>
    <p class="text">${t('login.accountBeenDeactivated')}</p>
    <p class="text margin-top20">${t('login.accountDeactivatedHelp')}</p>`,
    '',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: `${t('login.accountDeactivatedOk')}`,
      'show-close': false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      customClass: 'message-box', // 使用自定义的类名
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          toLogout()
          done()
          accountDisableStore.setIsAccountDisable(false)
        }
      }
    }
  )
}

// OSS CDN加速域名
const baseCDNMap = {
  DEV: 'https://flylink-cdn-oss-dev.inflyway.com',
  TEST: 'https://flylink-cdn-oss-test.inflyway.com',
  UAT: 'https://flylink-cdn-oss-uat.inflyway.com',
  production: 'https://flylink-cdn-oss-prod.inflyway.com'
}

/**
 * 图片预览地址
 * @param {String} filePath
 * @returns 绝对路径地址
 */
export function previewImg(filePath) {
  const { public: { VITE_NODE_ENV } } = useRuntimeConfig()
  const baseCDN = baseCDNMap[VITE_NODE_ENV]

  if (!filePath) return

  let tarUrl = null
  if (/^(https|http):/.test(filePath)) {
    tarUrl = filePath
  } else if (/^(flylink\/)/.test(filePath)) { // 需要OSS CDN加速
    tarUrl = `${baseCDN}/${filePath}`
  }
  return tarUrl
}


// OSS CDN加速域名
const baseOriginMap = {
  DEV: 'https://store-dev.inflyway.com',
  TEST: 'https://store-test.inflyway.com',
  UAT: 'https://store-uat.inflyway.com',
  production: 'https://store.inflyway.com'
}

/**
 * 页面地址
 * @param {String} filePath
 * @returns 绝对路径地址
 */
export function previewUrl(filePath) {
  const { public: { VITE_NODE_ENV } } = useRuntimeConfig()
  const baseOrigin = baseOriginMap[VITE_NODE_ENV]

  if (!filePath) return

  let tarUrl = null
  if (/^(https|http):/.test(filePath)) {
    tarUrl = filePath
  } else {
    tarUrl = `${baseOrigin}/${filePath}`
  }
  return tarUrl
}

let clipboard

export function initCopy() {
  // 复制
  clipboard = new ClipboardJS('.copy-btn', {
    text: function(trigger) {
      return trigger.getAttribute('data-copy')
    }
  })
  clipboard.on('success', (e) => {
    successMessage('复制成功')
    e.clearSelection()
  })
}

export function destroyCopy() {
  clipboard?.destroy?.()
  clipboard = undefined
}

/**
 * 删除标签的属性
 * @param str
 * @param attr
 */
export function getHTMLRemoveAttr(str = '', attr = 'href') {
  const reg = new RegExp(`${attr}\=\"[^\"]+\"`, 'g')
  return str.replace(reg, '')
}

/**
 * 删除a标签的链接
 * @param str
 */
export function getARemoveHref(str = '') {
  str = getHTMLRemoveAttr(str, 'href')
  str = getHTMLRemoveAttr(str, 'target')
  return str
}

/**
 * 相加（转整数，避免小数相加溢出）
 * @param arg1
 * @param arg2
 * @returns {number}
 */
export function accurate_add(arg1, arg2) {
  arg1 = Number(arg1)
  arg2 = Number(arg2)

  let r = 0
  let r1 = 0
  let r2 = 0

  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }

  r = Math.max(r1, r2)

  return accurate_toFixed(arg1 + arg2, r)
}

/**
 * 数字 num 保留 n 位小数
 * @param num
 * @param n
 * @returns {number}
 */
export function accurate_toFixed(num, n) {
  num = Number(num)
  let symbol = 1
  if (num < 0) {
    // 符号为负
    symbol = -1
    num *= -1
  }
  // 加一位不影响四舍五入的小数，且避免溢出的影响
  // num = num + Math.pow(10, -(n + 2))
  num = num + Math.pow(10, -(n + 4))
  // 保留 n 位小数
  num = num * Math.pow(10, n)
  // n 位之后的小数，四舍五入
  num = Math.round(num)
  // 还原 n 位小数
  num = num / Math.pow(10, n)
  // 加一位不小数，避免溢出的影响
  num = num + Math.pow(10, -(n + 1))
  // 还原符号
  num = num * symbol
  // 舍去多于小数
  num = num.toFixed(n)
  // 转数字
  num = Number(num)

  return num
}

/**
 * @desc 是否是空值（undefined 和 nell 和 NaN）
 * @param {*} str 需要保障的值
 */
export function isEMpty(str) {
  return str === undefined || str === null || Number.isNaN(str)
}

export function scrollTo(options) {
  const defaults = {
      ele : '',
      toT : 0,    //滚动目标位置
      durTime : 240,  //过渡动画时间
      delay : 10,     //定时器时间
      callback:null   //回调函数
  };
  let opts = Object.assign(defaults,options),
      timer = null,
      curTop = opts.ele.scrollTop,//滚动条当前的位置
      subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
      index = 0,
      dur = Math.round(opts.durTime / opts.delay),
      smoothScroll = function(t){
          index++;
          const per = Math.round(subTop/dur);
          if(index >= dur){
              opts.ele.scrollTop = t;
              window.clearInterval(timer);
              if(opts.callback && typeof opts.callback == 'function'){
                  opts.callback();
              }
              return;
          }else{
              // opts.ele.scrollTop = curTop + index*per;
              // easeInOutSine
              opts.ele.scrollTop = curTop + easeInOutSine(index*opts.delay/opts.durTime)*subTop;
          }
      };
  timer = window.setInterval(function(){
      smoothScroll(opts.toT);
  }, opts.delay);
};

export function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

/**
 * 检测当前设备是否支持webp
 * @returns 
 */
export const isSupportWebp = () => {
  try {
    const img = document.createElement('canvas');
    const imgData = img.toDataURL('image/webp', 0.5)
    return imgData.indexOf('data:image/webp') === 0;
  } catch(err) {
    return false;
  }
}


/**
 * 更换图片后缀名
 * @param { String } imageUrl 原图片地址
 * @param { String } newExtension 想要转换的图片格式的后缀名
 * @returns { String } 更换后缀名后的图片路径
 */
export const changeImageExtension = (imageUrl, newExtension) => {
  const { public: { VITE_NODE_ENV } } = useRuntimeConfig()
  const baseCDN = baseCDNMap[VITE_NODE_ENV] + '/flylink/'
  // 使用正则表达式匹配文件名和扩展名
  const regex = /(.+\/)(.+?)(\.[^.]+)$/;
  const match = imageUrl.match(regex);
  // 不是cnd加速的照片直接展示图片
  if (match && match.includes(baseCDN)) {
    // 构建新的图片 URL
    const newImageUrl = `${match[1]}${match[2]}${newExtension}`;
    return newImageUrl;
  } else {
    // 如果无法匹配,返回原始 URL
    return imageUrl;
  }
}
/**
 *  API返回的key值转value
 * enumeration 枚举值
 * key 枚举值对应的key
 */
export const formatInTable = (enumeration, key, prop, propLabel) => {
  let tarValue = ''
  const props = prop || 'value'
  const labels = propLabel || 'label'

  enumeration.forEach(item => {
    item[props] === key ? (tarValue = item[labels]) : null
  })

  return tarValue
}

/**
 * @param { Object } res API返回的结果
 * @param { String } type 特殊类型：NO_RETURN_DATA- 没有返回值
 * @param { String } duration 提示信息显示时长
 * @returns false/res.data.data 失败返回false，成功返回res.data.data
 */

 export const checkResponseData = (res, type, duration = 3000) => {
  const { $t: t } = useNuxtApp();
  switch (res?.status) {
    case 200:
      if (res?.success === true || res?.code === 'SUCCESS') {
        if (type === 'RETURN_DATA') {
          return res?.data.value
        } else if (type === 'NO_RETURN_DATA') {
          return  true
        } else {
          return res?.data
        }
      } else {
        // 账号禁用
        if(res?.code === '000004') {
          if(!accountDisableStore.isAccountDisable) {
            accountDisableStore.setIsAccountDisable(true)
            messageBox()
          }
          return
        }
        errorMessage(t(`service.${res?.code}`) || res?.desc || res?.message)
        // 000401没有权限
        if(res?.code === '000401') {
          toLogout()
        }
      }
      break
    default:
      return false
  }
  return false
}
/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
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

/**
 * 下载文件
 * @param url
 * @param name
 * @param download
 */
 export function downloadByA({ url, name = 'temp', download = true }) {
  // 生成一个a元素
  const a = document.createElement('a')
  // 设置下载功能，和名称
  if (download && name) {
    a.download = name
  }
  // 设置文件URL
  a.href = url;
  // a.target = '_blank';
  // 将a元素添加到body中，以便可以触发点击事件
  document.body.appendChild(a);
  // 模拟点击事件
  a.click();
  // 移除a元素
  document.body.removeChild(a);
}