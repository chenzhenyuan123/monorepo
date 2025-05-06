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
    },
    // 获取当前域名的二级域名
    getSecondLevelDomain(href) {
      const url = new URL(href); // 使用当前页面的URL创建URL对象
      const hostnameParts = url.hostname.split('.');
      if (hostnameParts.length >= 2) {
        return hostnameParts[hostnameParts.length - 2]; // 返回倒数第二个部分，即二级域名
      }
      return null; // 如果不是有效的二级域名格式，则返回null
    },
    // 根据当前域名，判断是买家中心or分销端
    isMy(href, array) {
      return !array.includes(this.getSecondLevelDomain(href));
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