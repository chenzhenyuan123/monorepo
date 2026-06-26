// 我的优惠券权益卡
// 查询权益卡状态列表（分页，返回三个状态的总数）-优惠券列表
export const couponListMembershipCardStatus = data => {
    return useHttp.post(`/flylinking-account/client/withdraw/coupon/listMembershipCardStatus`, data, { server: false })
}
// 查询统计优惠券使用情况-使用历史统计
export const couponStatCoupon = data => {
    return useHttp.post(`/flylinking-account/client/withdraw/coupon/statCoupon`, data, { server: false })
}
// 分页查询优惠券使用列表-使用历史
export const couponListUsageHistoryPage = data => {
    return useHttp.post(`/flylinking-account/client/withdraw/coupon/listUsageHistoryPage`, data, { server: false })
}
// 获取优惠券开关状态-菜单hot展示
export const couponGetSwitchStatus = () => {
    return useHttp.get(`/flylinking-account/client/withdraw/coupon/getSwitchStatus`, {}, { server: false })
}
// 查询未使用权益卡数量-菜单未读红点
export const couponCountUnusedCard = () => {
    return useHttp.get(`/flylinking-account/client/withdraw/coupon/countUnusedCard`, {}, { server: false })
}
// 刷新权益卡查询时间缓存-菜单未读红点-已读
export const couponRefreshCardQueryTime = () => {
    return useHttp.post(`/flylinking-account/client/withdraw/coupon/refreshCardQueryTime`, {}, { server: false })
}