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
