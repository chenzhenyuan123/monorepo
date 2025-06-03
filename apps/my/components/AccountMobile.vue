<script setup>
import { checkResponseData } from "@/util/index.js";
const { contactInfoApi } = useApi();
import { useUserStore } from '@/store/userState.js'
const userStore = useUserStore()
userStore.getUserInfo()

const router = useRouter()
const emit = defineEmits(['hiddenSetting'])

onMounted(() => {
  if(userStore.userInfo.token && !userStore.userInfo.loginAccount) {
    getEmailIfLoginIn()
  }
})
// 获取登录邮箱姓名
const getEmailIfLoginIn = async() => {
  const result = await contactInfoApi.getEmailIfLoginIn()
  const res = checkResponseData(result)
  if(res) {
    userStore.setToken({
      token: userStore.userInfo.token,
      userName: res.userName,
      loginAccount: res.loginAccount
    })
  }
}

const goAccount = () => {
  navigateTo('/account')
  emit('hiddenSetting')
}
// 退出
const toLogin = async() => {
  const result = await contactInfoApi.userLogOut()
  const res = checkResponseData(result, 'NO_RETURN_DATA')
  if(res) {
    userStore.logout().then(() => {
      navigateTo('/login')
    })
  }
}
</script>

<template>
  <div class="container" @click="goAccount">
    <img class="avatar" src="~@/assets/imgs/avatar.svg">
    <div class="flex-center-12"></div>
    <div>
      <div v-if="userStore.userInfo.userName" class="name">{{ userStore.userInfo.userName }}</div>
      <div class="email">{{ userStore.userInfo.loginAccount }}</div>
    </div>
    <div class="flex-center"></div>
    <div class="logout">
      <i class="Flylink icon-log-out-01" @click="toLogin()"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  margin-top: 24px;
  padding: 24px;
  border: 1px solid #E4E7EC;
  display: flex;
  // flex-direction: row;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
  }
  .name {
    font-size: 16px;
    font-weight: 600;
    color: #101828;
    line-height: 24px;
  }
  .email {
    font-size: 16px;
    color: #475467;
    line-height: 24px;
  }
  .logout {
    cursor: pointer;
    align-self: flex-start;
    .icon-log-out-01 {
      font-size: 20px;
    }
  }
}
</style>