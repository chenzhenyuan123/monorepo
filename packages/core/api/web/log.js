export const pageViewLogAdd = (data) => {
    return useHttp.post('/trade/web/log/pageViewLogAdd', data, { hideError: true })
}
