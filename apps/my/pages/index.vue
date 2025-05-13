<template>
  <div class="main-box">
    <img src="~@/assets/imgs/Flylinking-logo.svg" alt="flylinking" />
  </div>
</template>
<script setup name="Index">
import { useUserStore } from '@/store/userState.js'
const userStore = useUserStore()
const router = useRouter();
definePageMeta({
  layout: 'noside'
});

onMounted(() => {
  userStore.getUserInfo()
  // 是否已登录
  // if(userStore.isLogin) {
  //   navigateTo({
  //     path: '/home'
  //   })
  // } else {
  //   navigateTo({
  //     path: '/login'
  //   })
  // }
  navigateTo({
    path: '/login'
  })
})
</script>

<style lang="scss" scoped>
.main-box{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>