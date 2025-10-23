/**
 * 邮箱
 * @param {*} s
 */
 export function isEmail(s) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(s)
}
/**
 * email格式校验
 * 1. 邮箱名最长 64 个字符，域名部分不包含 @ 符号最长 254 字符
 * 2. 邮箱名除不能是 @ 外，支持所有UTF-8 字符集字符
 * @param {*} s
 */
 export function isInternationalEmail(s) {
  if (!s) return false
  const arr = s.split('@')
  if (arr.length !== 2 || !(arr[0].length > 0 && arr[0].length <= 64) || !(arr[1].length > 0 && arr[1].length <= 254)) {
    return false
  }
  return true
}
/**
 * 密码校验-一个数字、一个大小写字母、一个特殊字符组合的大于8位数
 * specialCharacterstr+单独的特殊字符
 * @param {*} s
 */
 export function isEmailPassword(s) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(s)
}
// 密码比较特例-所以但写一个字符串
export const specialCharacterstr = '~!#@$%^*&()_+{}[]|;:\'",<.>/?=-±×÷¥€£₹`¨^¸§¶©®™'
/**
 * 名称校验
 * @param {*} s
 */
export function isName(s) {
  return /^([a-zA-Z\-\'\s])*$/.test(s)
}
export function isCityName(s) {
  return /^([a-zA-Z\s])*$/.test(s)
}
export function isAccountName(s) {
  return /^([a-zA-Z\s])*$/.test(s)
}
export function isLetter(s) {
  return /^([a-zA-Z])*$/.test(s)
}
export function isLetterOrNumber(s) {
  return /^[a-zA-Z0-9]*$/.test(s)
}
export function hasChinese(s = '') {
  return s.match(/[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/)
}
export function hasEnglish(s = '') {
  return /[a-zA-Z]+/.test(s)
}

export const hasArabic = (s = '') => {
  // 正则表达式匹配阿拉伯语字符
  const regex = /[\u0600-\u06FF\u0750-\u077F]+/gu;

  return s.match(regex) !== null
}

/** 判断是否是有效的邮编 */
export const isValidZipcode = (s = '') => {
  return /^[a-zA-Z0-9 -]{2,16}$/g.test(s)
}
/**
 * SWIFT Code 校验
 * 1. 长度：8 或 11 个字符
 * 2. 前6位为字母，7~11位可以是 数字或字母
 * 3. 第五和第六位位银行所在国家/区域，字母组合为 2字国家码 「ISO 3166标准中的2字符国家码https://www.iban.com/country-codes」。手续费判断以此为准。
 * @param {*} s
 * @param {*} arr 2字国家码组合
 *
 * isSWIFTCode('qweras123', ['as'])
 */
export function isSWIFTCode(s, arr) {
  if (!(s.length === 8 || s.length === 11)) {
    console.log('长度：8 或 11 个字符', s)
    return false
  }
  const first6 = s.slice(0, 6)
  const last = s.slice(6)
  if (!(isLetter(first6) && isLetterOrNumber(last))) {
    console.log('前6位为字母，7~11位可以是 数字或字母', s)
    return false
  }
  const countryStr = s.slice(4, 6).toLowerCase()
  return arr.includes(countryStr) || countryStr === 'gb'
}

/**
 * 通用卡号
 * 长度大于等于 8 位的纯数字
 * @param {*} s
 */
export function isBaseCard(s) {
  return /^[0-9]{8,}$/.test(s)
}

// 卡号规则参考：https://mx6mxeu5rn.feishu.cn/sheets/SIYesB5FjhGxHFt9E8Rcsb4dn6f
/**
 * 是否是VisaCard
 * 长度13或16位
 * 卡号开头：4
 */
export const isVisaCard = (num='') => {
  if(!num) return false

  const len = num.length
  if (
    num.startsWith("4")
    && (len === 13 || len === 16)
    && !['401178','401179','431274','438935','451416','457393','457631','457632'].find(item => num.startsWith(item))
  ) {
    return true;
  } else {
    return false;
  }
}


/**
 * 是否是Master Card
 * 长度16位
 * 卡号开头：5、22、23、24、25、26、27
 */
export const isMasterCard = (cardNumber='') => {
  if(!cardNumber) return false

  if (cardNumber.length === 16 && ['5', '22', '23', '24', '25', '26', '27'].find(t => cardNumber.startsWith(t))) {
    return true;
  } else {
    return false;
  }
}

/**
 * 是否是DinerClub
 * 长度14-19位
 * 卡号开头：36、38、300-305
 */
export const isDinerClub = (cardNumber='') => {
  if(!cardNumber) return false

  const firstTwoDigits = parseInt(cardNumber.substring(0, 2));
  const firstThreeDigits = parseInt(cardNumber.substring(0, 3));
  const len = cardNumber.length;

  if (
    (len >= 14 && len <= 19) &&
    ([36, 38].includes(firstTwoDigits) ||
     (firstThreeDigits >= 300 && firstThreeDigits <= 305))
  ) {
    return true;
  }
  return false;
}


/**
 * 是否是Discover
 * 长度16-19位
 * 卡号开头：39、60、64、65
 */
export const isDiscover = (num='') => {
  if(!num) return false
  const len = num.length;

  if (
    (len >= 16 && len <= 19) && ['39', '60', '64', '65'].find(t => num.startsWith(t))
    && !['606282'].find(item => num.startsWith(item))
  ) {
    return true;
  }
  return false;
}

/**
 * 是否是amex
 * 长度15位
 * 卡号开头：34、37
 */
export const isAmex = (cardNumber = '') => {
  if(!cardNumber) return false
  if (
    cardNumber.length === 15 && ['34', '37'].find(t => cardNumber.startsWith(t))
  ) {
    return true;
  }
  return false;
}

/**
 * 是否是Hipercard
 * 长度14-17位
 * 卡号满足：^(606282|637095|637568|637599|637609|637612)
 */
export const isHipercard = (num = '') => {
  if(!num) return false
  const len = num.length
  if ((len >= 14 && len <= 17) && /^(606282|637095|637568|637599|637609|637612)/.test(num)) {
    return true
  }
  return false
}

/**
 * 是否是Elo
 * 长度13-19位，加正则
 */
export const isElo = (num = '') => {
  if(!num) return false
  const len = num.length
  if ((len >= 13 && len <= 19) && /^(?:401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|655000|655001|651652|651653|651654|650485|650486|650487|650488|506699|5067[0-6][0-9]|50677[0-8]|509\d{3})\d{10}$/.test(num)) {
    return true
  }
  return false
}

// 各国家 IBAN 账号长度
const countryLengthsForIBAN = {
  'AL': 28, 'AD': 24, 'AT': 20, 'AZ': 28, 'BH': 22, 'BY': 28, 'BE': 16, 'BA': 20,
  'BR': 29, 'BG': 22, 'CR': 22, 'HR': 21, 'CY': 28, 'CZ': 24, 'DK': 18, 'DO': 28,
  'EG': 29, 'SV': 28, 'EE': 20, 'FO': 18, 'FI': 18, 'FR': 27, 'GE': 22, 'DE': 22,
  'GI': 23, 'GR': 27, 'GL': 18, 'GT': 28, 'HU': 28, 'IS': 26, 'IQ': 23, 'IE': 22,
  'IL': 23, 'IT': 27, 'JO': 30, 'KZ': 20, 'XK': 20, 'KW': 30, 'LV': 21, 'LB': 28,
  'LI': 21, 'LT': 20, 'LU': 20, 'MK': 19, 'MT': 31, 'MR': 27, 'MU': 30, 'MD': 24,
  'MC': 27, 'ME': 22, 'NL': 18, 'NO': 15, 'PK': 24, 'PS': 29, 'PL': 28, 'PT': 25,
  'QA': 29, 'RO': 24, 'RU': 33, 'LC': 32, 'SM': 27, 'ST': 25, 'SA': 24, 'RS': 22,
  'SC': 31, 'SK': 24, 'SI': 19, 'ES': 24, 'SE': 24, 'CH': 21, 'TL': 23, 'TN': 24,
  'TR': 26, 'UA': 29, 'AE': 23, 'GB': 22, 'VA': 22, 'VG': 24
};

// IBAN 账号有效性校验
function validateIBAN(iban) {
  iban = iban.replace(/\s+/g, '').toUpperCase();

  // IBAN 长度检查
  if (iban.length < 15 || iban.length > 34) {
    return false;
  }

  // 提取校验码
  const checkDigits = iban.slice(2, 4);
  if (isNaN(checkDigits) || checkDigits.length !== 2) {
    return false;
  }

  // 重新排列 IBAN
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // 转换字母为数字
  const numericIBAN = rearranged.split('').map(char => {
    return isNaN(char) ? (char.charCodeAt(0) - 55).toString() : char;
  }).join('');

  // 计算 MOD 97
  let remainder = 0;
  for (let i = 0; i < numericIBAN.length; i++) {
    remainder = (remainder * 10 + parseInt(numericIBAN[i], 10)) % 97;
  }

  // 校验是否等于 1
  return remainder === 1;
}

// 测试案例
// console.log(validateIBAN("GB82 WEST 1234 5698 7654 32")); // true
// console.log(validateIBAN("DE44 5001 0517 5407 3249 31")); // true
// console.log(validateIBAN("GB00 WEST 1234 5698 7654 32")); // false（校验码错误）

/**
 * 是否含有 IBAN code
 */
export const hasCountryCodeForIBAN = (iban = '') => {
  if(!iban) return false

  iban = iban.replace(/\s+/g, '').toUpperCase();

  const code = iban.slice(0,2)

  return countryLengthsForIBAN[code]
}

/**
 * 是否是 IBAN 账号
 */
export const isIBAN = (iban = '') => {
  if(!iban) return false

  iban = iban.replace(/\s+/g, '').toUpperCase();

  const len = iban.length
  const code = iban.slice(0,2)

  // 长度不同
  if (countryLengthsForIBAN[code] !== len) return false

  return validateIBAN(iban)
}
