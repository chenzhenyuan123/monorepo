// 查询分销订物流信息
export const getOrderShippingInfo = (data) => {
    return useHttp.post('/distribution/client/orders/getOrderShippingInfo', data, { hideError: true })
}
