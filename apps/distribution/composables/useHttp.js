import { errorMessage, successMessage } from "@/util/index.js";
import { useUserStore } from '@/store/userState.js'
import { toLogout } from '@/util/auth.js'

// get方法传递数组形式参数useI18n.tc('login.serverError')
const paramsSerializer = (params) => {
  if (!params)
    return

  const query = JSON.parse(JSON.stringify(params))
  Object.entries(query).forEach(([key, val]) => {
    if (typeof val === 'object' && Array.isArray(val) && val !== null) {
      query[`${key}[]`] = toRaw(val).map((v) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}
// 提示信息
const statusTipMessage = {
  401: "No permission yet",
  403: "No Access",
  404: "Resource not found",
  413: "File too large",
  500: "Service exception",
  503: "Service exception"
};
// 需要退出登录的状态
const outDict = [401, 403, 302]

const langMap = {
  "en-US": "en-US",
  "en_US": "en-US"
}
const userStore = useUserStore()

const fetch = (url, option) => {
  return $fetch(url, {
    // 请求拦截器
    onRequest({ options }) {
      // get方法传递数组形式参数
      options.params = paramsSerializer(options.params)
      // 从useRuntimeConfig中取baseURL
      const { public: { VITE_HOST, VITE_NODE_ENV } } = useRuntimeConfig()
      // options.baseURL = 'https://da-test.flylinking.com'
      // 兼容自配置
      options.baseURL = option.baseUrl || VITE_HOST
      const language = localStorage.getItem("language") || 'en-US'
      // 设置头部国际化语言
      // 设置token
      options.headers = {
        "Accept-Language": language
      }
      userStore.getUserInfo()
      if(userStore?.token) {
        options.headers['Flylinking-Access-Token'] = userStore.token
      }
    },
    // 响应拦截
    onResponse({ response }) {
      // 移除“正在加载”
      // removeLoading(response?.config?.url)
      responsePropSet({
        res: response?._data,
        success: response._data?.code === 200 || response._data?.code === 0 || response._data?.code === '000000' || response._data?.code === 'SUCCESS',
        data: response._data?.data,
        message: response._data?.msg || response._data?.desc,
        status: response?.status
      })
      
      // 401登出
      const statusIndex = outDict.findIndex((item) => item === response.status)
      if(statusIndex>-1) toLogout()
      
      // 成功返回
      return response
    },
    // 错误处理
    onResponseError({ response }) {
      const message = statusTipMessage[response?.status];
      message && errorMessage(message);
      return response
    },
    // 合并参数
    ...option,
  }).catch(error => {
    return error.data
  })
}

export const useHttp = {
  get(url, params, option) {
    return fetch(url, { method: 'get', params, ...option })
  },

  post(url, body, option) {
    return fetch(url, { method: 'post', body, ...option })
  },

  put(url, body, option) {
    return fetch(url, { method: 'put', body, ...option })
  },

  delete(url, body, option) {
    return fetch(url, { method: 'delete', body, ...option })
  },
}

/**
 * 响应字段兼容
 * @param res
 * @param success
 * @param data
 * @param message
 */
const responsePropSet = ({ res = {}, success = false, data, message, status } = {}) => {
  // 特殊情况不处理
  if (typeof res !== 'object') return

  !res.success && (res.success = success)
  !res.message && (res.message = message)
  !res.data && (res.data = data)
  !res.status && (res.status = status)
}