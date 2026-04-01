import store from './index'
import { defineStore } from "pinia"
import Cookies from 'js-cookie'
import { parseJwt } from "@flylinking/core/utils/urlUtil";

export const useUserStore = defineStore('user', {
  state: () => {
    return Object.assign({
      token: undefined,
      userInfo: getInfo()
    }, getInfo());
  },
  getters: {
    isLogin: state => {
      let retn = false
      if (state.userInfo?.token) {
        retn = true
      }
      return retn
    }
  },
  actions: {
    setToken(userData) {
      this.token = userData.token
      this.userInfo = userData
      Cookies.set('Flylinking-Access-Token', this.token, { domain: '.flylinking.com' })
      localStorage.setItem("userInfo", JSON.stringify(userData))
    },
    logout() {
      return new Promise(resolve => {
        this.token = undefined
        this.userInfo = {}
        Cookies.remove('Flylinking-Access-Token', { domain: '.flylinking.com' })
        localStorage.removeItem('userInfo')
        
        resolve()
      })
    },
    getUserInfo() {
      const info = getInfo()
      // 首次进入，尝试从localStorage获取用户信息
      this.userInfo = info;
      // 如果获取到的信息与当前不同，则更新
      if (info?.token && info.token !== this.token) {
        this.setToken(info)
      } else if (info?.token) {
        this.token = info.token
      }
    }
  }
})


/**
 * 获取本地数据
 * 刷新页面时，数据清空，从 localStorage 还原
 */
function getInfo() {
  let info = {};
  try {
    const userInfoStr = localStorage.getItem("userInfo")
    info = userInfoStr ? JSON.parse(userInfoStr) : {}
  } catch (e) {
    info = {}
  }
  // 从Cookie获取token（优先使用Cookie中的token，因为它是一级域名共享的）
  const token = Cookies.get('Flylinking-Access-Token')  
  // 如果Cookie中有token，使用Cookie中的token
  if (token && token !== info?.token) {
    // token不一致，需要更新localStorage中的信息
    info.token = token
    const parseJwtToken = parseJwt(token)
    if (parseJwtToken && parseJwtToken?.sub) {
      info.loginAccount = parseJwtToken.sub
      info.userName = parseJwtToken?.userName
    }
    localStorage.setItem("userInfo", JSON.stringify(info))
  } else {
    // token一致，确保info.token存在
    info.token = token
  }

  return info;
}