<script setup>
  import { useI18n } from "vue-i18n";

  const props = defineProps({
    useRule: {
      type: String,
      default: ''
    }
  })
  const { t } = useI18n();
  const isMobile = useIsMobile()
  const attrs = useAttrs()


  const cancel = () => {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
  }

</script>

<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      width="526px"
      title="Tips for how to select Account type："
      :show-close="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :class="{ 'm': isMobile }"
    >

      <div class="flex items-center tertiary-span f16 fw700 mb8">
        <div class="flex-center-10"></div>
        <div class="li-circle"></div>
        <div class="flex-center-10"></div>
        <span>Savings account</span>
      </div>
      <div class="tertiary-span f16 mb20">For accumulating funds, earns interest, with limits on frequent transactions.</div>
      <div class="flex items-center tertiary-span f16 fw700 mb8">
        <div class="flex-center-10"></div>
        <div class="li-circle"></div>
        <div class="flex-center-10"></div>
        <span>Checking account</span>
      </div>
      <div class="tertiary-span f16">For daily transactions, withdrawals, transfers, and checks; high liquidity, low interest.</div>

      <template #footer>
        <div class="dialog-footer">
<!--          <el-button type="" round class="button-default dialog-adaptive" @click="cancel">{{ $t('DiscountRuleDialog.buttonClose') }}</el-button>-->
          <el-button type="primary" round class="button-default dialog-adaptive" @click="cancel">Close</el-button>
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
      padding: 0 32px;
    }
    .el-dialog__footer {
      padding: 24px 24px 32px;
    }
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
    &.fw700 {
      font-weight: 700;
    }
    &.f16 {
      font-size: 16px;
      line-height: 24px;
    }
  }
</style>
