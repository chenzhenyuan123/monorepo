<script setup>
import { useUserStore } from '@/store/userState.js'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();

const jumpToSetPassword = () => {
    navigateTo({
        path: '/password'
    })
}
</script>

<template>
    <div class="profile-head">
        <div class="profile-head-content">
            <div class="profile-title">Password</div>
            <div class="profile-discribe">You can set a login password to simplify the login process, or continue using OTP verification to log in.</div>
        </div>
    </div>

    <div class="nature-list">
        <div class="nature-item">
            <el-button id="account-btn-set-password" class="button-default" @click="jumpToSetPassword">Set password</el-button>
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
