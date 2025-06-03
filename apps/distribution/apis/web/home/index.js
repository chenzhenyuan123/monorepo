// 获取banner轮播图
export const getBanner = (data) => {
  return useHttp.get('/member/home/getBanner', data, { server: true })
}
export const msgCarouselMessageClick = (data) => {
  return useHttp.post('/member/home/pushBannerClick', data)
}

// 获取全屏弹窗消息
export const getPopMessage = (params) => {
  return useHttp.get(`/flylinking-basedata/client/popMessage/messages`, params, { server: true })
}
// 点击全屏弹窗消息
export const clickPopMessage = (data) => {
  return useHttp.post(`/flylinking-basedata/client/popMessage/click`, data, { server: true })
}