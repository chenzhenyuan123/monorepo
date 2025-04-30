<script setup>
import { CloseBold, Check } from '@element-plus/icons-vue';
import { checkResponseData, copyToClipboard, readClipboard, arrToDict, errorMessage, currencyFormat } from "@/util/index.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter()
const isMobile = useIsMobile()
const attrs = useAttrs()
const emit = defineEmits(["submit"])

// const jumpToWallet = () => {
//     router.push({
//         path: '/account/wallet'
//     })
// }

const submit = () => {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
    emit('submit')
}

const cancel = () => {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
    // jumpToWallet()
}

</script>

<template>
  <div>
    <el-dialog
    v-bind="$attrs"
    width="526px"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :class="{ 'm': isMobile }"
    >
        <!-- <template #header="{ close }"> -->
            <!-- <el-icon class="close-container" @click="close"><CloseBold /></el-icon> -->
            <template #header="">
            <span class="icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5" stroke="#F04438" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <h1>
                {{ $t('withdraw.deleteAccountDialogTitle') }}
            </h1>
        </template>

        <p class="dialog-p">
            {{ $t('withdraw.deleteAccountDialogP1') }}
            <br>
            {{ $t('withdraw.deleteAccountDialogP2_1') }}
            <span class="red">{{ $t('withdraw.deleteAccountDialogP2_2') }}</span>
            {{ $t('withdraw.deleteAccountDialogP2_3') }}
        </p>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" class="button-default dialog-adaptive" @click="cancel">{{ $t('withdraw.deleteAccountDialogButtonCancel') }}</el-button>
                <el-button type="text" class="button-default dialog-adaptive" @click="submit">{{ $t('withdraw.deleteAccountDialogButtonSubmit') }}</el-button>
            </div>
        </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
:deep(.el-dialog) {
    max-width: calc(100% - 16px);
    padding: 0;
    border-radius: 12px;
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03);
    background-color: #FFF;
    background-image: url('@/assets/imgs/bg-oblique-square-right.svg');
    background-position: right 32px;
    background-repeat: no-repeat;
    &.m {
        .el-dialog__footer {
            padding: 24px 16px 16px;
        }
    }
    .el-dialog__header {
        // padding: 32px 32px 16px 32px;
        padding: 32px 40px 16px 40px;
        text-align: center;
        .icon-container {
            display: inline-block;
            padding: 11px;
            border-radius: 10px;
            border: 1px solid #E4E7EC;
            background: #FFF;
            box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
            margin-bottom: 24px;
        }
        h1 {
            color: #101828;
            font-size: 30px;
            font-weight: 600;
            line-height: 38px; /* 155.556% */
        }
    }
    .el-dialog__body {
        padding: 0 32px;
    }
    .el-dialog__footer {
        padding: 32px 24px;
    }
    .dialog-p {
        color: #475467;
        /*text-align: left;*/
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
        .red {
            color: #D92D20;
        }
    }
    .dialog-footer {
    }
}
</style>
