// 获取用户账号关联信息
export const getUserAccountInfo = () => {
    return useHttp.get(`/member/user/getUserAccountInfo`, {}, { server: true })
}
// 获取所有国家列表
export const getAllCountry = () => {
    return useHttp.get(`/member/user/getAllCountry`, {}, { server: true })
}
// 根据国家id获取省市列表
export const getBaseProvinceByCountry = (countryId) => {
    return useHttp.get(`/member/user/getBaseProvinceByCountry/${countryId}`, {}, { server: true })
}
// 编辑用户基础信息
export const editUserBasicInfo = (data) => {
    return useHttp.post(`/member/user/editUserBasicInfo`, data, { server: true })
}
// 编辑用户联系方式信息
export const editUserContactInfo = (data) => {
    return useHttp.post(`/member/user/editUserContactInfo`, data, { server: true })
}
// 编辑用户公司信息
export const editUserCompanyInfo = (data) => {
    return useHttp.post(`/member/user/editUserCompanyInfo`, data, { server: true })
}
// 编辑用户收货信息
export const editUserShippingInfo = (data) => {
    return useHttp.post(`/member/user/editUserShippingInfo`, data, { server: true })
}
// 编辑用户收货信息
export const deleteUserShippingInfoById = (shippingId) => {
    return useHttp.get(`/member/user/deleteUserShippingInfoById/${shippingId}`, {}, { server: true })
}
