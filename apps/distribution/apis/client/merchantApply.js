// 分销员更多商家申请信息查询
export const getDistributorApply = () => {
    return useHttp.get('/member/user/distributor/profile/query', {}, { server: false })
}

// 分销员更多商家申请信息创建
export const createDistributorApply = (params) => {
    return useHttp.post('/member/user/distributor/profile/create', params, { server: false })
}
// 分销员更多商家申请信息保存/更新
export const saveOrUpdateDistributorApply = (params) => {
    return useHttp.post('/member/user/distributor/profile/update', params, { server: false })
}
// 分销员更多商家-菜单hot是否展示
export const getSwitchStatusDistributorApply = () => {
    return useHttp.get('/member/user/distributor/profile/getSwitchStatus', {}, { server: false })
}
