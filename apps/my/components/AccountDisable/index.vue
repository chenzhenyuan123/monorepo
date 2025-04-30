<!--
 * @Author: czy
 * @Description: 账号禁用弹窗
-->
<script setup>
import { toLogout } from '@/util/auth.js'
import { useAccountDisableStore } from '@/store/accountDisableState'
const accountDisableStore = useAccountDisableStore()

const isAccountDisable = ref(false)

onMounted(() => {
  if(process.client) {
    setTimeout(() => {
      accountDisableStore.getIsAccountDisable()
      isAccountDisable.value = accountDisableStore.isAccountDisable || false
    }, 1000)
  }
})


const close = () => {
  sessionStorage.removeItem('isAccountDisable')
  accountDisableStore.setIsAccountDisable(false)
  isAccountDisable.value = false
  toLogout()
}

</script>
<template>
  <div>
    <el-dialog
      v-model="isAccountDisable"
      width="400px"
      class="dialog-box join-dialog message-box"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="dialog-content">
        <div class="header">
          <div class="circle-box">
            <div class="circle-box1">
              <div class="circle-box2">
                <div class="circle-box3">
                  <div class="circle-box4"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="key-icon">
            <el-icon class="icon-Warning" />
          </div>
        </div>
        <h3 class="title">{{ $t('login.accountDeactivated') }}</h3>
        <p class="text">{{ $t('login.accountBeenDeactivated') }}</p>
        <p class="text margin-top20">{{ $t('login.accountDeactivatedHelp') }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close()">{{$t('login.accountDeactivatedOk')}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import url('./style.scss')
</style>