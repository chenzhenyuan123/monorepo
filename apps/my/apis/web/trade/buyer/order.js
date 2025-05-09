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
    return useHttp.post(`/trade/buyer/order/confirmReceipt`, data, { server: true })
}
