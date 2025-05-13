<script setup>
import Language from './Language.vue'
import { checkResponseData } from "@/util/index.js";
const { contactInfoApi } = useApi();
import { useUserStore } from '@/store/userState.js'
const userStore = useUserStore()

const router = useRouter()
const isMobile = useIsMobile()

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

// 修改密码
const toPassword = () => {
  navigateTo('password')
}

</script>

<template>
  <div v-if="isMobile" class="navbar-wrap pdlr24">
    <img class="logo" src="~@/assets/imgs/Flylinking-logo.svg" alt="" @click="navigateTo('/orders')">
    <Language style="display: none" />
    <slot name="collapse"></slot>
  </div>
  <div v-else class="navbar-wrap">
    <!-- 菜单折叠按钮 -->
    <slot name="collapse"></slot>
    <div class="right-menu">
      <Language />
      <!-- 用户-->
      <el-dropdown class="avatar-container" trigger="click">
        <el-button>
          <img class="avatar" src="~@/assets/imgs/avatar.svg" alt="">
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <!-- <el-dropdown-item @click="toPassword()"
              >{{$t('home.resetPassword')}}</el-dropdown-item
            > -->
            <el-dropdown-item @click="toLogin()" 
              >{{$t('home.Logout')}}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar-wrap {
  height: 80px;
  overflow: hidden;
  position: relative;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  .right-menu {
    display: flex;
    align-items: center;
    .avatar-container {
      margin-left: 16px;
      .avatar-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
    .el-button {
      // width: 40px;
      // height: 40px;
      padding: 0;
      font-size: 12px;
      font-weight: 600;
      border-radius: 8px;
      color: #344054;
      background: #fff;
      border: none;
    }
    .avatar {
      width: 40px;
      height: 40px;
    }
  }
  .logo {
    cursor: pointer;
  }
}
.pdlr24 {
  padding: 0 24px;
}
</style>
<style lang="scss">
.el-popper .user-dropdown {
  .el-dropdown-menu__item {
    color: #101828;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
