<!--
 * @Author: czy
 * @Description: 买家中心/订单列表
-->
<template>
  <div class="orders">
    <CarouselImage system="101" />
    买家中心/订单列表
    <NuxtLink :to="`/orders/${order.id}`">
      {{ order.title }}
    </NuxtLink>
  </div>
</template>
<script name="Orders" setup>
import { checkResponseData } from "@/util/index.js"
const { walletApi } = useApi();

onMounted(async () => {
  getHomeWalletInfo()
})
// 获取用户账号关联信息
const getHomeWalletInfo = async() => {
  const result = await walletApi.getHomeWalletInfo()
  const res = checkResponseData(result)
  if (res) {
    console.log(res)
  }
}

const order = reactive({
  id: '1',
  title: '跳转订单详情页'
})
</script>
