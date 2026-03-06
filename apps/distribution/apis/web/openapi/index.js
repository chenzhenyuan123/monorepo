// 需要根据环境配置不同的openapi域名
const baseCDNMap = {
  DEV: 'https://openapi-dev.flylinking.com',
  TEST: 'https://openapi-test.flylinking.com',
  UAT: 'https://openapi-uat.flylinking.com',
  production: 'https://openapi.flylinking.com'
}

// 获取基础CDN地址的函数
const getBaseCDN = () => {
  const { public: { VITE_NODE_ENV } } = useRuntimeConfig()
  return baseCDNMap[VITE_NODE_ENV] || baseCDNMap.production
}

// 注册开发者账号
export const developerCreate = (data) => {
  const baseCDN = getBaseCDN()
  return useHttp.post(`${baseCDN}/flylinkingOpen/client/developer/create`, data, { server: false })
}
// 获取开发者账号-数据
export const developerQuery = (data) => {
  const baseCDN = getBaseCDN()
  return useHttp.get(`${baseCDN}/flylinkingOpen/client/developer/query`, data, { server: false })
}
// 开发者账号-重新生成应用OAuth 2.0 Keys
export const getAppRegenerateKey = (data) => {
  const baseCDN = getBaseCDN()
  return useHttp.post(`${baseCDN}/flylinkingOpen/client/app/regenerateKey`, data, { server: false })
}
// 开发者账号-更新应用信息
export const appUpdate = (data) => {
  const baseCDN = getBaseCDN()
  return useHttp.post(`${baseCDN}/flylinkingOpen/client/app/update`, data, { server: false })
}