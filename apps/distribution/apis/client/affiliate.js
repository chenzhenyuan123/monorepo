// 分销员可以加入的店铺列表查询
export const listStoreCanJoin = (params) => {
    return useHttp.post('/distribution/client/affiliate/listStoreCanJoin', params, { server: true })
}
export const listGoodsByStoreId = (storeId) => {
    return useHttp.get(`/distribution/client/affiliate/listGoodsByStoreId/${storeId}`, {}, { server: true })
}
