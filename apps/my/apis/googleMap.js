// 发起googleMap搜索
export const place_list = (params) => {
    return useHttp.post(`/flylinking-basedata/paycenter/googleMap/place/list`, params, { server: true })
}

// 获取googleMap搜索详情
export const place_detail = (params) => {
    return useHttp.post(`/flylinking-basedata/paycenter/googleMap/place/detail`, params, { server: true })
}