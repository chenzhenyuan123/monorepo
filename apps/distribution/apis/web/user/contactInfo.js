
export const query = (storeId) => {
    return useHttp.get(`/flylink/web/user/contactInfo/query/${storeId}`, {}, { server: true })
}
// 邮箱注册
export const userRegister = (data) => {
    return useHttp.post('/member/user/register', data, { server: true })
}
// 重新发送邮件
export const againsendVerifyEmail = (data) => {
    return useHttp.post('/member/user/sendVerifyEmail', data, { server: true })
}
// 邮件注册-确认
export const checkVerifyCode = (data) => {
    return useHttp.post('/member/user/checkVerifyCode', data, { server: false })
}
// 登录
export const userLogin = (data) => {
    return useHttp.post('/member/userLogin/login', data, { server: true })
}
// 重置密码
export const resetPassword = (data) => {
    return useHttp.post('/member/user/resetPassword', data, { server: false })
}
// 退出登录
export const userLogOut = () => {
    return useHttp.get(`/member/userLogin/logOut`, {}, { server: true })
}