// 查询用户是否已加入分销
export const checkJoin = (data) => {
  return useHttp.get('/distribution/client/bind/checkJoin', data, { server: true })
}
// 分销员关联店铺的商品列表查询
export const getRecommendGoodsList = (data) => {
  return useHttp.post('/distribution/client/goods/recommendGoodsList', data, { server: true })
}
// 获取商品短链
export const generatorGoodsLink = (data) => {
  return useHttp.post('/distribution/client/goods/generatorGoodsLink', data, { server: true })
}