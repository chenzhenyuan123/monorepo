// 分销订单分页列表
export const orders_listPage = (data) => {
    return useHttp.post(`/distribution/client/orders/listPage`, data, { server: true })
}
// 分销订单-sku详情列表
export const qrySkuCommissionList = (data) => {
    return useHttp.post(`/distribution/client/orders/qrySkuCommissionList`, data, { server: false })
}
// 分销订单-分销员佣金详情列表
export const qryUserCommissionList = (data) => {
    return useHttp.post(`/distribution/client/orders/qryUserCommissionList`, data, { server: false })
}
// 历史邀请记录分页列表查询
export const invitation_listInvitation = (data) => {
    return useHttp.post(`/distribution/client/invitation/listInvitation`, data, { server: true })
}
// 邀请店铺下拉列表
export const bind_listStoresToInvite = (data) => {
    return useHttp.get(`/distribution/client/bind/listStoresToInvite`, data, { server: true })
}
