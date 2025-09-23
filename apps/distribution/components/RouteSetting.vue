<script setup>
import SideBar from './Sidebar'
import AccountMobile from './AccountMobile'
import Language from './Language.vue'

const emit = defineEmits(['hiddenSetting'])

const hidden = () => {
  emit('hiddenSetting')
}

</script>

<template>
  <SideBar @hiddenSetting="hidden"/>
  <AccountMobile @hiddenSetting="hidden" />
  <div class="lan">
    <Language width="320"/>
  </div>
  <div class="navbar-m-module">
    <!-- 联系我们-->
    <NavbarContactUs></NavbarContactUs>
  </div>
</template>

<style lang="scss" scoped>
.lan {
  padding: 24px;
}
.navbar-m-module {
  padding: 24px;
  border: 1px solid #E4E7EC;
}
</style>