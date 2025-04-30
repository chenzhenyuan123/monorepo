<script setup>
import { Back } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/settingState.js'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { userApi } = useApi()
const settingStore = useSettingStore()
const router = useRouter()
const route = useRoute()
const isMobile = useIsMobile()
const isSuccess = ref(route.query.success === '1')


const jumpToWallet = () => {
    router.push({
        path: '/account/wallet'
    })
}

onMounted(()=>{
    nextTick(() => {
        settingStore.setFormPage(true)
      settingStore.setFullPage(true)
    })
})

onUnmounted(()=>{
    settingStore.setFormPage(false)
  settingStore.setFullPage(false)
})
</script>

<template>
  <div :class="{ 'page': true, 'm': isMobile }">
    <div v-if="isSuccess" key="success" class="content">
        <span class="icon-container">
            <img src="@/assets/imgs/check-circle.svg" alt="">
        </span>
        <h1 class="h1">
            {{ $t('withdraw.resultSuccessTitle') }}
        </h1>
        <p class="p">
            {{ $t('withdraw.resultSuccessP') }}
        </p>
        <el-button type="" class="button button-default dialog-adaptive" @click="jumpToWallet">{{ $t('withdraw.resultButtonBack') }}</el-button>
    </div>
    <div v-else key="error" class="content">
        <span class="icon-container">
            <img src="@/assets/imgs/alert-circle.svg" alt="">
        </span>
        <h1 class="h1">
            {{ $t('withdraw.resultErrorTitle') }}
        </h1>
        <p class="p">
            {{ $t('withdraw.resultErrorP') }}
        </p>
        <el-button type="" class="button button-default dialog-adaptive" @click="jumpToWallet">{{ $t('withdraw.resultButtonBack') }}</el-button>
    </div>
    </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
* {
    box-sizing: border-box;
}
.page {
    padding: 32px 0;
    min-height: 50vh;
    &.m {
        padding: 16px;
        .h1 {
            font-size: 24px;
            line-height: 32px; /* 155.556% */
        }
    }
}
.content {
    width: 526px;
    max-width: 100%;
    margin: 0 auto;
    padding: 32px 24px;
    border-radius: 10px;
    background-color: #FFF;
    background-image: url('@/assets/imgs/bg-circle-center.svg');
    background-position: center 0;
    background-repeat: no-repeat;
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    text-align: center;
}
.icon-container {
    display: inline-block;
    padding: 11px;
    border-radius: 10px;
    border: 1px solid #E4E7EC;
    background: #FFF;
    box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    margin-bottom: 24px;
}
.h1 {
    color: #101828;
    font-size: 30px;
    font-weight: 600;
    line-height: 38px; /* 155.556% */
    margin-bottom: 16px;
}
.p {
    color: #475467;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    margin-bottom: 32px;
}
</style>
