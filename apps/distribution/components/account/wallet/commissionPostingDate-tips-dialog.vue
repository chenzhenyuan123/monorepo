<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const isMobile = useIsMobile()
const attrs = useAttrs()
const props = defineProps({
  
})


const cancel = () => {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}

</script>

<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      width="650px"
      :show-close="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :class="{ 'm': isMobile }"
    >
      <template #header="">
        <h1>
          {{ $t('wallet.referralCommissionPostingDateTips') }}
        </h1>
      </template>

      <div>
        <div class="mb20 white-span fw600">1. {{ $t('wallet.referralTableLabelEstimatedCommissionPostingDate') }}</div>
        <div class="mb20 white-span">{{ $t('wallet.referralTableLabelTipEstimatedDateP1') }}</div>
        <div class="flex flex-li">
          <div>
            <span class="white-span">{{ $t('wallet.referralTableLabelTipEstimatedDateP2Part1') }}</span>
            <span class="warning-span fw600 ml6 mr6">{{ $t('wallet.referralTableLabelTipEstimatedDateP2Part2') }}</span>
            <span class="white-span">{{ $t('wallet.referralTableLabelTipEstimatedDateP2Part3') }}</span>
          </div>
        </div>
        <div class="flex flex-li">
          <div>
            <span class="white-span">{{ $t('wallet.referralTableLabelTipEstimatedDateP3Part1') }}</span>
            <span class="warning-span fw600 ml6 mr6">{{ $t('wallet.referralTableLabelTipEstimatedDateP3Part2') }}</span>
            <span class="white-span">{{ $t('wallet.referralTableLabelTipEstimatedDateP3Part3') }}</span>
          </div>
        </div>
        <div class="mb20 mt24 white-span fw600">2. {{ $t('wallet.referralTableLabelActualCommissionPostingDate') }}</div>
        <div class="white-span">{{ $t('wallet.referralTableLabelTipActualDateP') }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  :deep(.el-dialog) {
    max-width: calc(100% - 16px);
    padding: 0;
    border-radius: 12px;
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03);
    background-color: #FFF;
    background-position: center 0;
    background-repeat: no-repeat;
    .el-dialog__header {
      padding: 24px 24px 20px;
      .el-dialog__headerbtn {
        top: 16px;
        right: 16px;
        width: 44px;
        height: 44px;
        padding: 14px;
        line-height: 0;
        .el-dialog__close {
          color: #98A2B3;
        }
      }
      h1 {
        color: #101828;
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 28px; /* 155.556% */
      }
    }
    .el-dialog__body {
      padding: 0 32px 32px 32px;
      .warning-span {
        color: var(--Warning-color-warning, #F98C1F);
        font-family: var(--Font-family-font-family-body, Inter);
        font-size: var(--Font-size-text-md, 16px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--Line-height-text-md, 24px);
        &.fw500 {
          font-weight: 500;
        }
        &.fw600 {
          font-weight: 600;
        }
        &.f16 {
          font-size: 16px;
          line-height: 24px;
        }
      }
      .white-span {
        color: var(--colors-text-text-primary-900, #101828);
        font-family: var(--Font-family-font-family-body, Inter);
        font-size: var(--Font-size-text-md, 16px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--Line-height-text-md, 24px);
        &.fw500 {
          font-weight: 500;
        }
        &.fw600 {
          font-weight: 600;
        }
        &.f16 {
          font-size: 16px;
          line-height: 24px;
        }
      }
    }
    .el-dialog__footer {
      padding: 32px 24px 24px;
    }

  }
  
</style>
