
import { parseQuery } from '@/util/router.js'
import { useUserStore } from '@/store/userState.js'
const userStore = useUserStore()

// 退出登录
export const toLogout = () => {
  const query = parseQuery()
  userStore.logout().then(() => {
    navigateTo({
      path: '/login',
      query: query
    })
  })
}