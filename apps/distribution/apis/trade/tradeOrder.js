// 查询分销订物流信息
export const getOrderShippingInfo = (data) => {
    return useHttp.post('/trade/tradeOrder/getOrderShippingInfo', data, { hideError: true })
}
