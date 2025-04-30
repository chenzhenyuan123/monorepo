// 获取banner轮播图
export const getBanner = (data) => {
  return useHttp.get('/member/home/getBanner', data, { server: true })
}
export const msgCarouselMessageClick = (data) => {
  return useHttp.post('/member/home/pushBannerClick', data)
}