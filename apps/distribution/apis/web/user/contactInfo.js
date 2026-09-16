
export const query = (storeId) => {
    return useHttp.get(`/trade/web/user/contactInfo/query/${storeId}`, {}, { server: false })
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
// 发送登录验证邮件
export const sendLoginVerifyEmail = (data) => {
    return useHttp.post('/member/userLogin/sendLoginVerifyEmail', data, { server: false })
}
// 通过验证码登录
export const loginWithVerifyCode = (data) => {
    return useHttp.post('/member/userLogin/loginWithVerifyCode', data, { server: false })
}
// 设置密码
export const setPassword = (data) => {
    return useHttp.post('/member/user/setPassword', data, { server: false })
}
// 获取当前登录的用户信息
export const getEmailIfLoginIn = () => {
    return useHttp.get(`/member/user/getEmailIfLoginIn`, {}, { server: false })
}