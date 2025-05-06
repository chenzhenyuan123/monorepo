<!--
 * @Author: czy
 * @Description: 买家中心/订单列表
-->
<template>
  <div class="orders">
    买家中心/订单列表
    <NuxtLink :to="`/orders/${order.id}`">
      {{ order.title }}
    </NuxtLink>
  </div>
</template>
<script name="Orders" setup>
const order = reactive({
  id: '1',
  title: '跳转订单详情页'
})
</script>
