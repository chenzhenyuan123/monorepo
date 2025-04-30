// 根据storeId 获取店铺信息
export const getStoreDistributionSettings = (data) => {
  return useHttp.post('/distribution/client/store/getStoreDistributionSettings', data, { server: true })
}
// 加入分销邀请
export const joinStore = (data) => {
  return useHttp.post('/distribution/client/bind/create', data, { server: true })
}