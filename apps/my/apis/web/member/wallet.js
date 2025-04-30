// 获取首页钱包信息
export const getHomeWalletInfo = () => {
    return useHttp.get(`/distribution/client/orders/getCommission`, {}, { server: true })
}