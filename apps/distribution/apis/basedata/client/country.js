// 根据ip获取国家信息
export const getCountryInfoByIp = (params) => {
    return useHttp.get(`/flylinking-basedata/client/country/getCountryInfoByIp`, params, { server: true })
}

// 国家列表
export const getAllCountry = () => {
    return useHttp.get(`/flylinking-basedata/client/country/listAllCountry`, {}, { server: true })
}

// 获取省信息
export const getProvinceByCountry = (countryId, key = '') => {
    return useHttp.get(`/flylinking-basedata/client/country/listProvinceByCountryId/${countryId}`, {}, { server: true, key })
}

// 获取PayPal支持的国家列表
export const listPaypalCountry = () => {
    return useHttp.get(`/flylinking-basedata/client/country/listPaypalCountry`, {}, { server: true })
}
