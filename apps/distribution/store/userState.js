import store from './index'
import { defineStore } from "pinia"
import Cookies from 'js-cookie'

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
        Cookies.remove('Flylinking-Access-Token')
        localStorage.removeItem('userInfo')
        
        resolve()
      })
    },
    getUserInfo() {
      const info = getInfo()
      // 首次进入，尝试从localStorage获取用户信息
      this.userInfo = info;
      this.token = info?.token;
    }
  }
})


/**
 * 获取本地数据
 * 刷新页面时，数据清空，从 localStorage 还原
 */
 function getInfo() {
  let info;
  try {
    info = localStorage.getItem("userInfo");
  } catch (e) {
  }
  info = info ? JSON.parse(info) : {};

  return info;
}