<!--
 * @Author: czy
 * @Description: 导入关联订单
-->
<script setup>
import { checkResponseData, successMessage } from "@/util/index.js";
const { buyerOrderApi } = useApi();
const { $t: t } = useNuxtApp();

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

const attrs = useAttrs()
const emit = defineEmits(['save'])
const close = () => {
  const fn = attrs['onUpdate:modelValue']
  fn && fn(false)
}
const loading = ref(false)
const resultData = ref({})
// 提交
const submit = async() => {
  loading.value = true
  // const result = await buyerOrderApi.confirmReceipt({orderId: props.data.id})
  // const res = checkResponseData(result, 'NO_RETURN_DATA')
  // if(res) {
  //   successMessage(t('orders.ordersMarkAsReceiptSuccess'))
  //   emit('save')
  // }
  // loading.value = false
  setTimeout(() => {
    resultData.value = {
      type: 'Success',
      num: 19
    }
  }, 2000)
  // resultData.value = {
  //   type: 'Error'
  // }
}
</script>

<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      width="400px"
      class="dialog-box join-dialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="dialog-content">
        <div class="join-header">
          <div class="circle-box">
            <div class="circle-box1">
              <div class="circle-box2">
                <div class="circle-box3">
                  <div class="circle-box4"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="['Success', 'Error'].includes(resultData.type)" class="key-icon">
            <svg v-if="resultData.type==='Success'" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M8 12L11 15L17 9M22.5 12C22.5 17.5228 18.0228 22 12.5 22C6.97715 22 2.5 17.5228 2.5 12C2.5 6.47715 6.97715 2 12.5 2C18.0228 2 22.5 6.47715 22.5 12Z" stroke="#079455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M12.5 8V12M12.5 16H12.51M22.5 12C22.5 17.5228 18.0228 22 12.5 22C6.97715 22 2.5 17.5228 2.5 12C2.5 6.47715 6.97715 2 12.5 2C18.0228 2 22.5 6.47715 22.5 12Z" stroke="#F04438" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div v-else class="key-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M21 7.27771L12.5 11.9999M12.5 11.9999L3.99997 7.27771M12.5 11.9999L12.5 21.5M21.5 16.0585V7.94141C21.5 7.59876 21.5 7.42744 21.4495 7.27464C21.4049 7.13947 21.3318 7.01539 21.2354 6.9107C21.1263 6.79236 20.9766 6.70916 20.677 6.54276L13.277 2.43164C12.9934 2.27409 12.8516 2.19531 12.7015 2.16442C12.5685 2.13709 12.4315 2.13709 12.2986 2.16442C12.1484 2.19531 12.0066 2.27409 11.723 2.43165L4.32297 6.54276C4.02345 6.70916 3.87369 6.79236 3.76463 6.9107C3.66816 7.01539 3.59515 7.13947 3.55048 7.27465C3.5 7.42745 3.5 7.59877 3.5 7.94141V16.0585C3.5 16.4012 3.5 16.5725 3.55048 16.7253C3.59515 16.8605 3.66816 16.9845 3.76463 17.0892C3.87369 17.2076 4.02345 17.2908 4.32297 17.4572L11.723 21.5683C12.0066 21.7258 12.1484 21.8046 12.2986 21.8355C12.4315 21.8628 12.5685 21.8628 12.7015 21.8355C12.8516 21.8046 12.9934 21.7258 13.277 21.5683L20.677 17.4572C20.9766 17.2908 21.1263 17.2076 21.2354 17.0892C21.3318 16.9845 21.4049 16.8605 21.4495 16.7253C21.5 16.5725 21.5 16.4012 21.5 16.0585Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 9.5L8 4.5" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div v-if="['Success', 'Error'].includes(resultData.type)" class="dialog-content-box">
          <h3 class="title">{{ t(`orders.linkOrders${resultData.type}Title`) }}</h3>
          <div class="dialog-text-box margin-bottom-48">
            <p v-if="resultData.type==='Success'" class="dialog-text text-align-center"><b class="text-primary">{{resultData.num}}</b> {{ t(`orders.linkOrdersSuccessTip`) }}</p>
            <p class="dialog-text text-align-center">{{ t(`orders.linkOrders${resultData.type}Tip1`) }}</p>
            <p class="dialog-text text-align-center">
              {{ t(`orders.linkOrders${resultData.type}Tip2`) }}
              <a target="_blank" href="Mailto://service@flylinking.com" class="a_color">service@flylinking.com</a>
              {{ t(`orders.linkOrders${resultData.type}Tip3`) }}
            </p>
          </div>
        </div>
        <div v-else class="dialog-content-box">
          <h3 class="title">{{ t('orders.linkOrdersTitle') }}</h3>
          <div class="dialog-text-box">
            <p class="dialog-text">{{ t('orders.linkOrdersTip') }}</p>
            <ul class="dialog-text-list">
              <li>{{ t('orders.linkOrdersTip1') }}</li>
              <li>{{ t('orders.linkOrdersTip2') }}</li>
              <li>{{ t('orders.linkOrdersTip3') }}</li>
              <li>{{ t('orders.linkOrdersTip4') }}</li>
            </ul>
          </div>
        </div>
      </div>
      <template #footer>
        <span v-if="['Success', 'Error'].includes(resultData.type)" class="dialog-footer">
          <el-button type="primary" @click="close()">{{ t('login.accountDeactivatedOk') }}</el-button>
        </span>
        <span v-else class="dialog-footer">
          <el-button @click="close()">{{ t('orders.linkOrdersCancel') }}</el-button>
          <el-button :loading="loading" type="primary" id="products-btn-confirm" @click="submit()">{{ t('orders.linkOrdersSave') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import url('./style.scss');
</style>
<style lang="scss">
.m {
  .el-overlay-dialog .el-dialog.join-dialog {
    max-width: 100%;
    position: fixed;
    bottom: -50px;
    left: 0;
    right: 0;
    border-radius: 12px 12px 0 0;
  }
}
</style>