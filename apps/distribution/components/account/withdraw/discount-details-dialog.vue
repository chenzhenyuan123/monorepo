<script setup>
  import { useI18n } from "vue-i18n";
  import {formatDate} from "@flylinking/core/utils/dateUtil";

  const props = defineProps({
    membershipCardNo: {
      type: String,
      default: ''
    },
    membershipCardData: {
      type: Array,
      default: () => []
    }
  })
  const { t } = useI18n();
  const isMobile = useIsMobile()
  const attrs = useAttrs()
  const emit = defineEmits(['change'])


  const currentCard = ref(props.membershipCardNo)
  function isActive(cardNo) {
    return currentCard.value && cardNo === currentCard.value
  }
  function selectCard(cardNo) {
    currentCard.value = cardNo
  }


  const change = () => {
    emit('change', currentCard.value)
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
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
      width="600px"
      :title="$t('DiscountDetailsDialog.title')"
      :show-close="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :class="{ 'm': isMobile }"
    >
      <!-- 权益卡列表 -->
      <AccountMyCouponsList
        :membershipCardData="membershipCardData"
        :activeCardNo="currentCard"
        @selectCard="selectCard"
      />
      
      <template #footer>
        <div class="dialog-footer flex items-center justify-end">
          <el-button type="" round class="button-default" @click="cancel">{{ $t('DiscountDetailsDialog.buttonCancel') }}</el-button>
          <div class="flex-center-8"></div>
          <el-button type="primary" round class="button-default" :disabled="!(currentCard && currentCard !== membershipCardNo)" @click="change">
            {{ $t('DiscountDetailsDialog.buttonOk') }}
          </el-button>
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
      padding: 0 20px 20px;
    }
    .el-dialog__footer {
      padding: 24px;
    }
  }

  .dialog-header {
    min-height: 72px;
    padding: 20px;
  }
</style>
