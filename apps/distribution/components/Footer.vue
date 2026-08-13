<!--
 * @Author: czy
 * @Description: 公共底部
-->
<script setup name="Footer">
import { useUserStore } from '@/store/userState.js'
import { errorMessage, successMessage, checkResponseData } from "@/util/index.js"
const { openapiApi } = useApi()
const userStore = useUserStore()
userStore.getUserInfo()

const isMobile = useIsMobile()
const date = new Date();
const year = date.getFullYear();
const goDeveloper = async()=>{
  // 如果存在登录态-且接口返回为已注册用户，则跳转/openapi/home，否则跳转/openapi/register
  const result = await openapiApi.developerQuery()
  // const res = checkResponseData(result)
  if(result.success && result.data) {
    navigateTo('/openapi/home')
  } else {
    navigateTo('/openapi/register')
  }
}
</script>
<template>
  <div class="footer-box flex justify-between" :class="{ m: isMobile }">
    <div class="left-box">@ {{year}} {{$t('login.footeRightsReserved')}}</div>
    <div class="right-box flex">
      <div><a href="/legal/privacy-policy" target="_blank">{{$t('login.footerPrivacyPolice')}}</a></div>
      <div class="flex-center-16"></div>
      <div><a href="/legal/terms-of-usage" target="_blank">{{$t('login.footeTermOfUse')}}</a></div>
      <!-- 如果是登录态，显示开发者工具入口 -->
      <template v-if="userStore.userInfo && userStore.userInfo.loginAccount">
        <div class="flex-center-16"></div>
        <div><a @click="goDeveloper">Developer</a></div>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer-box {
  width: 100%;
  border-top: 1px solid #E4E7EC;
  padding-top: 26px;
  overflow: hidden;
  padding-bottom: 56px;
  a {
    display: block;
    text-decoration: none;
    cursor: pointer;
    color: #667085;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
  .left-box {
    color: #667085;
    font-size: 14px;
    direction: ltr;
  }
  .right-box {
    text-align: right;
  }
  &.m {
    border-top: 0;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 40px;
    font-size: 12px;
    line-height: 18px;
    padding-top: 0;
    &.flex, .flex {
      display: block;
      .right-box > div {
        margin-top: 16px;
      }
      
    }
  }
}
</style>