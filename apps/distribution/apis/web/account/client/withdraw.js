// 查询结算中&已结算佣金
export const qrySettlementAmount = () => {
    return useHttp.post(`/flylinking-account/client/withdraw/qrySettlementAmount`, {}, { server: true })
}
// 查询提现记录列表
export const listPage = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/listPage`, data, { server: true })
}
// 查询可用余额列表
export const qryBalance = () => {
    return useHttp.post(`/flylinking-account/client/withdraw/qryBalance`, {}, { server: true })
}
// 查询可用佣金
export const qryBalanceList = () => {
    return useHttp.post(`/flylinking-account/client/withdraw/qryBalanceList`, {}, { server: true })
}
// 查询币种最小可提现金额
export const qryMinWithdrawalAmount = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/prepare/qryMinWithdrawalAmount`, data, { server: true })
}
// 查询提现到账时间说明列表
export const qrySettleConfigList = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/prepare/qrySettleConfigList`, data, { server: true })
}
// 查询到账币种列表
export const qryCreditedCurrencyList = () => {
    return useHttp.get(`/flylinking-account/client/withdraw/prepare/qryCreditedCurrencyList`, {}, { server: true })
}
// 查询国家列表
// export const qryCountryList = () => {
//     return useHttp.post(`/flylinking-account/client/withdraw/qryCountryList`, {}, { server: true })
// }
// 风控校验
export const risk_control_check = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/risk/control/check`, data, { server: true })
}
// 查询手续费
export const qryWithdrawFee = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/qryWithdrawFee`, data, { server: true })
}
// 查询默认等级手续费
// export const qryDefaultWithdrawFee = (data) => {
//     return useHttp.post(`/flylinking-account/client/withdraw/qryDefaultWithdrawFee`, data, { server: true })
// }
// 提现申请
export const apply = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/apply`, data, { server: true })
}
// 提现确认/取消
export const confirm = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/confirm`, data, { server: true })
}
// 查询提现详情
export const detail = (id) => {
    return useHttp.get(`/flylinking-account/client/withdraw/detail/${id}`, {}, { server: true })
}
// 查询提现成功卡列表
export const success_bankcard_listPage = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/success/bankcard/listPage`, data, { server: true })
}
// 删除提现成功卡记录
export const success_bankcard_delete = (id) => {
    return useHttp.delete(`/flylinking-account/client/withdraw/success/bankcard/${id}`, {}, { server: true })
}
// 查询提现成功卡记录
export const success_bankcard_get = (id) => {
    return useHttp.get(`/flylinking-account/client/withdraw/success/bankcard/${id}`, {}, { server: true })
}
// 验证码创建
export const verification_code_create = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/verification/code/create`, data, { server: true })
}
// 校验验证码是否正确
export const verification_code_verify = (code) => {
    return useHttp.get(`/flylinking-account/client/withdraw/verification/code/verify/${code}`, {}, { server: true })
}
// 查询提现锁状态
export const lockStatus = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/lockStatus`, data, { server: true })
}
// 查询权益卡列表
export const listMembershipCardPage = (data) => {
    return useHttp.post(`/flylinking-account/client/withdraw/listMembershipCardPage`, data, { server: true })
}
