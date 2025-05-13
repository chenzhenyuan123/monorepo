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