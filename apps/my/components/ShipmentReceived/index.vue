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
            <svg t="1748330598267" class="icon-package" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10321" width="24" height="24"><path d="M495.874 50.35a85.333 85.333 0 0 1 32.252 0l1.064 0.212 1.339 0.289c13.782 3.129 25.963 10.394 35.345 15.606l315.733 175.409 3.987 2.2c9.635 5.316 21.38 11.996 30.491 21.882l0.766 0.842a85.327 85.327 0 0 1 17.143 29.136l0.364 1.078 0.223 0.685c4.582 14.389 4.086 29.649 4.086 41.149v346.33c0 11.501 0.496 26.76-4.086 41.15l-0.223 0.684a85.339 85.339 0 0 1-17.507 30.215l-0.766 0.842c-9.111 9.886-20.856 16.565-30.491 21.882l-3.987 2.201-315.733 175.407c-9.382 5.213-21.563 12.478-35.345 15.607l-1.339 0.289a85.353 85.353 0 0 1-33.316 0.212l-1.064-0.212c-12.54-2.579-23.806-8.696-32.914-13.789l-3.77-2.107-315.733-175.407c-10.054-5.585-23.633-12.563-33.987-23.557l-0.491-0.526a85.335 85.335 0 0 1-17.91-29.978l-0.363-1.079c-4.82-14.588-4.309-30.151-4.309-41.834v-346.33c0-11.683-0.511-27.245 4.309-41.834l0.364-1.078a85.335 85.335 0 0 1 17.909-29.978l0.491-0.527c10.354-10.993 23.933-17.97 33.987-23.555L298.5 155.138c0.451-0.262 0.908-0.514 1.368-0.76l158.258-87.92 3.77-2.107c9.108-5.093 20.374-11.21 32.914-13.789l1.064-0.212z m229.374 391.987c-0.342 0.196-0.686 0.388-1.033 0.575l-169.55 94.195 0.001 329.051 285.5-158.611 4.528-2.522c3.974-2.223 6.392-3.615 8.225-4.783l0.205-0.134c0.005-0.078 0.013-0.159 0.018-0.243 0.174-2.894 0.191-6.89 0.191-14.697V371.18l-128.085 71.157zM170.667 685.168c0 7.807 0.017 11.803 0.191 14.697l0.017 0.243 0.206 0.134c2.445 1.557 5.929 3.514 12.753 7.305l285.498 158.61v-329.05L170.667 371.181v313.987z m45.19-386.499l296.141 164.524 104.147-57.861-296.141-164.521-104.147 57.858z m295.939-164.212c-1.847 0.891-4.165 2.135-7.937 4.216l-95.997 53.329L704 356.524l104.142-57.856-283.709-157.616c-6.466-3.592-9.767-5.407-12.229-6.595l-0.204-0.096-0.204 0.096z" fill="#344054" p-id="10322"></path></svg>
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