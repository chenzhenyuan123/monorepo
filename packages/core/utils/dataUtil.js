import currency from 'currency.js'


export function currencyFormat(num, precision = 2) {
    return currency(num, { pattern: '#', precision }).format({ symbol: '' })
}

export function formatCreditCardNumber(cardNumber, isEncryption = false) {
    // 去除空格和横线
    cardNumber = normalCreditCardNumber(cardNumber)

    var arr = [];
    var chunkSize = 4;

    // 不加密
    if (!isEncryption) {
        // 使用 for 循环将卡号码拆分成四个字符的块
        for (var i = 0; i < cardNumber.length; i += chunkSize) {
            var chunk = cardNumber.slice(i, i + chunkSize);
            arr.push(chunk)
        }

        return arr.join(' ');
    }

    if (cardNumber && cardNumber.length > 8) {
        // 中间部分
        const center = '*'.repeat(cardNumber.length - 8)
        return `${cardNumber.substring(0, 4)} ${center.replace(/(.{4})/g, `$1 `)}${cardNumber.length % 4 ? ' ' : ''}${cardNumber.slice(-4)}`
    } else if (cardNumber && cardNumber.length > 4) {
        // 中间部分
        const center = '*'.repeat(cardNumber.length - 4)
        return `${cardNumber.substring(0, 4)} ${center}`
    }
    return cardNumber

}

export function normalCreditCardNumber(cardNumber = '') {
    // 去除非数字
    // return cardNumber.replace(/[^\d]/g, '')
    // 去除空格和横线
    return (cardNumber || '').replace(/[\s\-]/g, '').toUpperCase()
}

export function formatSWIFTCode(str) {
    // 去除空格
    str = str.replace(/\s/g, '')
    str = str.toLocaleUpperCase()

    return str
}

export function removeSpace(str) {
    // 去除空格
    str = str.replace(/\s/g, '')

    return str
}

/**
 * 价格输入框保持纯数字
 */
export function getNumberByInput(e) {
    // 保留数字和点
    e = e.replace(/[^\d.]/g, '')
    // 去除小数位2位之后的数据
    e = e.replace(/^(\d*\.\d{0,2})\d*/g, '$1')
    // 去除多余的点 (12.34 -> 12.34.) (1234.56 -> 12.34.56.)
    e = e.replace(/^(\d*\.\d{0,2})\.\d*/g, '$1')

    return e
}
/**
 * 价格输入框保持整数
*/
export function getIntegerByInput(e) {
    // 保留数字
    e = e.replace(/[^\d]/g, '')

    return e
}

/**
 * 国家图标
 * @param val
 * @returns {string}
 */
export const flagUrl = (val = '') => {
    const id = (val).toLowerCase()
    return `https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/flag/${id}.png`
}

// 为全选置空，提供唯一常量
// export const theAll = Symbol('all')
export const theAll = 'Symbol-all'

/**
 * 是否是theAll
 * @param value
 * @returns {Boolean}
 */
export function isTheAll(value) {
    return value === theAll
}

/**
 * @desc 是否是空值（undefined 和 nell 和 NaN）
 * @param {*} str 需要保障的值
 */
export function isEMpty(str) {
    return str === undefined || str === null || Number.isNaN(str)
}

/**
 * @desc 是否是无用值
 * @param {*} str 需要保障的值
 */
export function isUseless(str) {
    return isEMpty(str) || str === ''
}

/**
 *
 * @param params
 */
export const getCleanFormData = (params) => {
    const obj = { ...params }
    for (let key in obj) {
        const item = obj[key]
        if (isUseless(item) || isTheAll(item)) {
            delete obj[key]
        }
    }

    return obj
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
 * 四舍五入
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
