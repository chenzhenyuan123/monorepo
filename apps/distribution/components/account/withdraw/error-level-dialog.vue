<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isMobile = useIsMobile()
const attrs = useAttrs()

const reload = () => {
    window.location.reload()
}

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
      :show-close="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :class="{ 'm': isMobile }"
    >
      <!-- <template #header="{ close }"> -->
      <!-- <el-icon class="close-container" @click="close"><CloseBold /></el-icon> -->
      <template #header="">
            <span class="icon-container">
                <img src="@/assets/imgs/alert-circle.svg" alt="">
            </span>
        <h1>
          {{ $t('withdraw.errorLevelDialogTitle') }}
        </h1>
      </template>

      <p class="dialog-p">
        {{ $t('withdraw.errorLevelDialogP1') }}
      </p>
      <br>
      <br>
      <p class="dialog-p">
        {{ $t('withdraw.errorLevelDialogP2Before') }} <el-link type="primary" href="mailto:distributor@flylinking.com" target="_blank">distributor@flylinking.com↗</el-link> {{ $t('withdraw.errorLevelDialogP2After') }}
      </p>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" class="button-default dialog-adaptive" @click="reload">
            <div class="flex-box">
              <div class="svg-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                  <path d="M17.5003 7.33333C17.5003 7.33333 15.8295 5.05685 14.4721 3.69854C13.1148 2.34022 11.239 1.5 9.16699 1.5C5.02486 1.5 1.66699 4.85786 1.66699 9C1.66699 13.1421 5.02486 16.5 9.16699 16.5C12.5862 16.5 15.4711 14.2119 16.3739 11.0833M17.5003 7.33333V2.33333M17.5003 7.33333H12.5003" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="flex-center-8"></div>
              <span>{{ $t('withdraw.errorLevelDialogbuttonRefresh') }}</span>
            </div>
          </el-button>
          <div class="dialog-footer-button-center"></div>
          <el-button type="" class="button-default dialog-adaptive" @click="cancel">{{ $t('withdraw.errorLevelDialogbuttonClose') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  @import url("@/assets/css/element-reset/button.scss");
  :deep(.el-dialog) {
    max-width: calc(100% - 16px);
    padding: 0;
    border-radius: 12px;
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03);
    background-color: #FFF;
    background-image: url('@/assets/imgs/bg-oblique-square.svg');
    background-position: center 0;
    background-repeat: no-repeat;
    &.m {
      .el-dialog__footer {
        padding: 24px 16px 16px;
      }
      .dialog-footer {
        display: block;
        .el-button {
          width: 100%;
        }
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
    }
    .dialog-footer {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      .el-button {
        flex: 1;
      }
      .dialog-footer-button-center {
        width: 12px;
        min-width: 12px;
        height: 12px;
        min-height: 12px;
      }
    }
  }
</style>
