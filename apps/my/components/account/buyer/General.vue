<script setup>
import { useUserStore } from '@/store/userState.js'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();

const jumpToSetPassword = () => {
    router.push('/password')
}
</script>

<template>
    <div class="profile-head">
        <div class="profile-head-content">
            <div class="profile-title">Email & Password</div>
        </div>
    </div>

    <div class="nature-list">
        <div class="nature-item nature-m-wrap-item">
            <div class="nature-item-label">
                <span>Email</span>
                <div class="nature-item-label-message">
                    Please keep your email address active, as it is required for logging in and receiving order and shipping updates.
                </div>
            </div>
            <div class="nature-item-value">{{ userStore.userInfo.loginAccount }}</div>
        </div>
        <div class="nature-item nature-m-wrap-item">
            <div class="nature-item-label">
                <span>Password</span>
                <div class="nature-item-label-message">
                    You can set a login password to simplify the login process, or continue using OTP verification to log in.
                </div>
            </div>
            <div class="nature-item-value">
                <el-button id="account-btn-set-password" class="button-default" @click="jumpToSetPassword">Set password</el-button>
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
