<script setup>
import { CloseBold, Check } from '@element-plus/icons-vue';
import { checkResponseData, copyToClipboard, readClipboard, arrToDict, errorMessage, currencyFormat } from "@/util/index.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isMobile = useIsMobile()
const props = defineProps({
    lockTime: {
        type: Number,
        default: 1
    }
})
const attrs = useAttrs()
const emit = defineEmits(["submit"])

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
                  <path d="M13 7.49999L10 10.5L14 12.5L11 15.5M20 12C20 16.9084 14.646 20.4784 12.698 21.6149C12.4766 21.744 12.3659 21.8086 12.2097 21.8421C12.0884 21.8681 11.9116 21.8681 11.7903 21.8421C11.6341 21.8086 11.5234 21.744 11.302 21.6149C9.35396 20.4784 4 16.9084 4 12V7.21759C4 6.41808 4 6.01833 4.13076 5.6747C4.24627 5.37113 4.43398 5.10027 4.67766 4.88552C4.9535 4.64243 5.3278 4.50207 6.0764 4.22134L11.4382 2.21067C11.6461 2.13271 11.75 2.09373 11.857 2.07827C11.9518 2.06457 12.0482 2.06457 12.143 2.07827C12.25 2.09373 12.3539 2.13271 12.5618 2.21067L17.9236 4.22134C18.6722 4.50207 19.0465 4.64243 19.3223 4.88552C19.566 5.10027 19.7537 5.37113 19.8692 5.6747C20 6.01833 20 6.41808 20 7.21759V12Z" stroke="#F04438" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <h1>
                {{ $t('withdraw.temporarilySuspendedDialogTitle') }}
            </h1>
        </template>

        <p class="dialog-p">
            {{ $t('withdraw.temporarilySuspendedDialogP1') }}
        </p>
        <br>
        <p class="dialog-p">
            {{ $t('withdraw.temporarilySuspendedDialogP2_1') }}
            <span class="bold">{{ lockTime }} {{ $t('withdraw.temporarilySuspendedDialogP2_2') }}</span>
            {{ $t('withdraw.temporarilySuspendedDialogP2_3') }}
        </p>
        <br>
        <br>
        <p class="dialog-p">
            {{ $t('withdraw.temporarilySuspendedDialogP3_1') }}
            flylinking.com
            {{ $t('withdraw.temporarilySuspendedDialogP3_2') }}
            service@flylinking.com.
        </p>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" class="button-default dialog-adaptive" @click="cancel">{{ $t('withdraw.temporarilySuspendedDialogButtonSubmit') }}</el-button>
            </div>
        </template>
    </el-dialog>

      <AccountWithdrawVerifyCodeDialog
          v-if="isShowCodeGialog"
          v-model="isShowCodeGialog"
          @submit="submit"
      ></AccountWithdrawVerifyCodeDialog>
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
    background-image: url('@/assets/imgs/bg-circle-center.svg');
    background-position: center 0;
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
        .el-dialog__headerbtn {
            z-index: 11
        }

        .el-dialog__headerbtn .el-dialog__close {
            color: #98a2b3;
            font-size: 24px;
            margin: 12px 12px 0 0
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
        .bold {
            font-weight: 600;
        }
    }
    .dialog-footer {
    }
}
</style>
