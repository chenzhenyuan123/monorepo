const baseFlylinkStoreMap = {
    DEV: 'https://store-dev.inflyway.com',
    TEST: 'https://store-test.flylinking.com',
    UAT: 'https://store-uat.flylinking.com',
    production: 'https://store.flylinking.com'
}

/**
 * 页面地址
 * @param {String} filePath
 * @returns 绝对路径地址
 */
export function previewFlylinkStoreUrl(filePath) {
    // 从useRuntimeConfig中取baseURL
    const { public: { VITE_HOST, VITE_NODE_ENV } } = useRuntimeConfig()
    const baseOrigin = baseFlylinkStoreMap[VITE_NODE_ENV] || baseFlylinkStoreMap.DEV

    if (!filePath) return

    let tarUrl = null
    if (/^(https|http):/.test(filePath)) {
        tarUrl = filePath
    } else {
        tarUrl = `${baseOrigin}/${filePath}`
    }
    return tarUrl
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