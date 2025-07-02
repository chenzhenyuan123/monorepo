// 买家中心-订单

// 订单分页列表
export const listPage = (data) => {
    return useHttp.post(`/trade/buyer/order/listPage`, data, { server: true })
}
// 订单详情
export const orderDetail = (data) => {
    return useHttp.post(`/trade/buyer/order/detail`, data, { server: false })
}
// 确认收货
export const confirmReceipt = (data) => {
    return useHttp.post(`/trade/buyer/order/confirmReceipt`, data, { server: false })
}
// 查询是否存在未关联旧订单
export const existHistoricalOrder = (data) => {
    return useHttp.post(`/trade/buyer/order/existHistoricalOrder`, data, { server: false })
}
// 导入关联旧订单
export const linkHistoricalOrders = (data) => {
    return useHttp.post(`/trade/buyer/order/linkHistoricalOrders`, data, { server: false })
}
