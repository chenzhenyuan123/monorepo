import { errorMessage } from "@/util/index.js";
import { useUserStore } from '@/store/userState.js'
import { toLogout } from '@/util/auth.js'
import { API } from '@flylinking/core'
const userStore = useUserStore()


export const useHttp = {
  get(url, params, option) {
    return API.fetch(url, { method: 'get', params, ...option }, userStore, errorMessage, toLogout)
  },

  post(url, body, option) {
    return API.fetch(url, { method: 'post', body, ...option }, userStore, errorMessage, toLogout)
  },

  put(url, body, option) {
    return API.fetch(url, { method: 'put', body, ...option }, userStore, errorMessage, toLogout)
  },

  delete(url, body, option) {
    return API.fetch(url, { method: 'delete', body, ...option }, userStore, errorMessage, toLogout)
  },
}