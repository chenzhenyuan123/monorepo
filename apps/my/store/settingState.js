import { parseQuery } from '@/util/router.js'
import store from './index'
import { defineStore } from "pinia"

export const useSettingStore = defineStore('setting', {
  state: () => {
    return {
      isMobile: false,
      isFormPage: false,
      // 设置内容占满一页
      isFullPage: false,
    }
  },
  actions: {
    /**
     * 是否是移动端
     * @returns {boolean}
     */
    setIsMobile() {
      const Q = parseQuery()
      if (Q.ismobile !== void 0) {
        this.isMobile = !!Q.ismobile
      } else {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
          this.isMobile =  true
        } else {
          this.isMobile =  false
        }
      }
    },
    setFormPage(isFormPage = true) {
      this.isFormPage = isFormPage
    },
    setFullPage(isFullPage = true) {
      this.isFullPage = isFullPage
    }
  }
})
