import store from './index'
import { defineStore } from "pinia"

export const useAccountDisableStore = defineStore('acountDisable', {
  state: () => ({
    isAccountDisable: false
  }),
  actions: {
    /**
     * 是否展示账号已禁用弹窗
     * @returns {boolean}
     */
    setIsAccountDisable(newValue) {
      this.isAccountDisable = newValue
      if(newValue) {
        sessionStorage.setItem('isAccountDisable', newValue)
      } else {
        sessionStorage.removeItem('isAccountDisable')
      }
      console.log('setIsAccountDisable===>', this.isAccountDisable)
    },
    getIsAccountDisable() {
      let info;
      try {
        info = sessionStorage.getItem('isAccountDisable')
      } catch (e) {
      }
      info = info ? JSON.parse(info) : false;

      this.isAccountDisable = info
    }
  }
})