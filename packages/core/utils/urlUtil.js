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
    const { public: { VITE_NODE_ENV } } = useRuntimeConfig()
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

// 用atob方法解析Jwt的token令牌里包含的信息：email、姓名
export function parseJwt(token) {
    try {
        // 提取 payload 部分
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
            .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('JWT的token令牌解析失败:', e);
        return null;
    }
}