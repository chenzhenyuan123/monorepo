<script setup>
  import { useI18n } from "vue-i18n";
  import {currencyFormat} from "@flylinking/core/utils/dataUtil";

  const props = defineProps({
    originalExchangeRate: {
      type: Number
    },
    rate: {
      type: Number
    },
    currency: {
      type: String
    },
    amount: {
      type: Number
    }
  })
  const { t } = useI18n();
  const isMobile = useIsMobile()
  const attrs = useAttrs()
  const emit = defineEmits(['submit', 'cancel'])


  const submit = () => {
    emit('submit')
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
  }
  const cancel = () => {
    emit('cancel')
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
  }

</script>

<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      width="526px"
      :title="$t('rateUpdateDialog.title')"
      :show-close="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :class="{ 'm': isMobile }"
    >

      <div class="tertiary-span f16 mb12">{{ $t('rateUpdateDialog.message') }}</div>
      <div class="tertiary-box txt-center">
        <div class="tertiary-span mb2">{{ $t('rateUpdateDialog.label1') }}</div>
        <div class="flex items-center justify-center gap8 mb24">
          <template v-if="rate > originalExchangeRate">
            <div class="green-span">{{ rate }}</div>
            <div class="lh0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5527_17885)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.24019 1.45864C7.53049 1.17986 7.99 1.17974 8.28023 1.45864L14.5195 7.45864C14.8179 7.74558 14.8276 8.22058 14.541 8.51919C14.254 8.81765 13.779 8.82742 13.4804 8.54067L8.50972 3.76138V13.9997C8.50972 14.4139 8.17394 14.7497 7.75972 14.7497C7.34563 14.7495 7.00972 14.4138 7.00972 13.9997V3.76235L2.51949 8.07876C2.2209 8.36569 1.74598 8.35678 1.45894 8.05825C1.17205 7.75966 1.18192 7.28473 1.48043 6.9977L7.24019 1.45864Z" fill="#079455"/>
                </g>
                <defs>
                  <clipPath id="clip0_5527_17885">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </template>
          <template v-else>
            <div class="red-span">{{ rate }}</div>
            <div class="lh0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5822_5357)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.24012 1.25C8.65417 1.25019 8.99012 1.5859 8.99012 2V12.2373L13.4804 7.9209C13.7789 7.63402 14.2539 7.6429 14.5409 7.94141C14.8279 8.23997 14.8179 8.71488 14.5194 9.00195L8.75965 14.541C8.46932 14.8199 8.00987 14.8201 7.71961 14.541L1.48035 8.54102C1.18189 8.25403 1.17212 7.77907 1.45887 7.48047C1.74586 7.18206 2.22084 7.17225 2.51942 7.45898L7.49012 12.2383V2C7.49012 1.58579 7.8259 1.25 8.24012 1.25Z" fill="#D92D20"/>
                </g>
                <defs>
                  <clipPath id="clip0_5822_5357">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </template>
        </div>
        <div class="tertiary-span mb2">{{ $t('rateUpdateDialog.label2') }}</div>
        <div class="tertiary-span f20 fw600">{{ currency }} {{ currencyFormat(amount) }}</div>
      </div>

      <template #footer>
        <div class="form-buttons">
          <el-button type="text" class="button-default m-adaptive" style="margin: 0" @click="cancel">{{ $t('rateUpdateDialog.buttonClose') }}</el-button>
          <el-button type="primary" round class="button-default m-adaptive" style="margin: 0" @click="submit">{{ $t('rateUpdateDialog.buttonSubmit') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  @import url("@/assets/css/element-reset/button.scss");
  * {
    box-sizing: border-box;
  }
  .black-span {
    color: #171717;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
  }
  .tertiary-span {
    color: #475467;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw600 {
      font-weight: 600;
    }
    &.fw700 {
      font-weight: 700;
    }
    &.f16 {
      font-size: 16px;
      line-height: 24px;
    }
    &.f20 {
      font-size: 20px;
      line-height: 30px;
    }
  }
  .green-span {
    color: #079455;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw500 {
      font-weight: 500;
    }
    &.f16 {
      font-size: 16px;
      line-height: 24px;
    }
  }
  .red-span {
    color: #D92D20;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw500 {
      font-weight: 500;
    }
    &.f16 {
      font-size: 16px;
      line-height: 24px;
    }
  }
  .tertiary-box {
    padding: 20px;
    border-radius: 12px;
    background: #F9FAFB;
  }
  :deep(.el-dialog) {
    max-width: calc(100% - 16px);
    padding: 0;
    border-radius: 24px;
    box-shadow: 0 20px 28px 0 rgba(0, 0, 0, 0.04), 0 10px 20px 0 rgba(0, 0, 0, 0.05);
    background-color: #FFF;
    * {
      box-sizing: border-box;
    }
    .el-dialog__headerbtn {
      top: 12px;
      margin: 0 4px;
      .el-dialog__close {
        color: #817F86;
      }
    }
    .el-dialog__header {
      min-height: 72px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    .el-dialog__footer {
      padding: 24px 24px 32px;
    }
  }
  .form-buttons {
    display: flex;
    justify-content: right;
    gap: 12px;
    .rtl & {
      justify-content: left;
    }
    .m & {
      flex-direction: column-reverse;
    }
  }
</style>
