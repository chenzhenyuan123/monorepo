<!--
 * @Author: czy
 * @Description: 分销员招募平台
-->
<script setup name="Affiliate">
definePageMeta({
  layout: 'noside'
})

</script>
<template>
  <div class="main-box" :class="{ m: isMobile }">
    <div>分销员招募平台</div>

    <div class="footer-main affiliate-footer">
      <Footer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.affiliate-footer {
  padding: 0 20px;
}

</style>