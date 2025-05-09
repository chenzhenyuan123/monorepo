<!--
 * @Author: czy
 * @Description: 确认已收货弹窗
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
// 提交
const submit = async() => {
  loading.value = true
  const result = await buyerOrderApi.confirmReceipt({orderId: props.data.id})
  const res = checkResponseData(result, 'NO_RETURN_DATA')
  if(res) {
    successMessage(t('orders.ordersMarkAsReceiptSuccess'))
    emit('save')
  }
  loading.value = false
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
          <div class="key-icon">
            <i class="Flylink icon-package" />
          </div>
        </div>
        <h3 class="title">{{$t('orders.ordersShipmenReceived')}}</h3>
        <div class="dialog-text-box">
          <p class="dialog-text">{{$t('orders.ordersShipmenReceivedTip1')}}</p>
          <p class="dialog-text">{{$t('orders.ordersShipmenReceivedTip2')}}</p>
          <p class="dialog-text">{{$t('orders.ordersShipmenReceivedTip3')}}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close()">{{$t('orders.ordersNotYet')}}</el-button>
          <el-button :loading="loading" type="primary" id="products-btn-confirm" @click="submit()">{{$t('orders.ordersMarkAsReceipt')}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import url('./style.scss')
</style>