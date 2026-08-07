// 分销员更多商家申请信息查询
export const getDistributorApply = () => {
    return useHttp.get('/distribution/client/distributorApply/getDistributorApply', {}, { server: false })
}

// 分销员更多商家申请信息保存/更新
export const saveOrUpdateDistributorApply = (params) => {
    return useHttp.post('/distribution/client/distributorApply/saveOrUpdate', params, { server: false })
}
