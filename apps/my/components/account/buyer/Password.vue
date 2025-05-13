<script setup>
import { useI18n } from "vue-i18n";
import { useUserStore } from '@/store/userState.js'

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
// 已有密码-跳转密码重置
const jumpToSetPassword = () => {
    navigateTo({
        path: '/password'
    })
}
// 没有密码-直接跳转设置密码确认页
const jumpToResetPassword = () => {
    navigateTo({
        path: '/password-reset'
    })
}
</script>

<template>
    <div>
        <div class="profile-head">
            <div class="profile-head-content">
                <div class="profile-title">{{$t('profile.password')}}</div>
                <div class="profile-discribe">{{$t('profile.passwordTitleMessage')}}</div>
            </div>
        </div>
    
        <div class="nature-list">
            <div class="nature-item">
                <el-button v-if="userStore.userInfo.havePassword" id="account-btn-set-password" class="button-default" @click="jumpToSetPassword">{{$t('profile.restPassword')}}</el-button>
                <el-button v-else id="account-btn-set-password" class="button-default" @click="jumpToResetPassword">{{$t('profile.setPassword')}}</el-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
@import url("@/assets/css/element-reset/radio.scss");
// @import url("@/components/account/profile/form.scss");
@import url("./form.scss");
</style>
