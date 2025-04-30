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
</template>

<style lang="scss" scoped>
.lan {
  padding: 24px;
}
</style>