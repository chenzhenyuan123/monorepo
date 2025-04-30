<script setup>

defineProps(['itemData'])
const isMobile = useIsMobile()
</script>

<template>
  <el-sub-menu
    v-if="itemData.children"
    :index="itemData.path"
    class="sub"
  >
    <template v-if="isMobile" #title>
      <span class="title mgl-m">{{ $t(itemData.meta.title) }}</span>
    </template>
    <template v-else #title>
      <i v-if="itemData.meta.icon" class="Flylink" :class="itemData.meta.icon"></i>
      <span class="title">{{ $t(itemData.meta.title) }}</span>
    </template>
    <sidebar-item
      v-for="item in (itemData.children || [])"
      :key="item.path"
      :item-data="item"
    />
  </el-sub-menu>
  <el-menu-item v-else :index="itemData.path">
    <template v-if="isMobile">
      <span class="title mgl-m">{{ $t(itemData.meta.title) }}</span>
    </template>
    <template v-else>
      <i v-if="itemData.meta.icon" class="Flylink" :class="itemData.meta.icon"></i>
      <span class="title" :class="{ mgl: !itemData.meta.icon }">{{ $t(itemData.meta.title) }}</span>
    </template>
  </el-menu-item>
</template>

<style scoped lang="scss">
.title {
  margin-left: 12px;
  font-size: 16px;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
}
i {
  font-size: 24px;
}
.mgl {
  margin-left: 16px;
}
.mgl-m {
  margin-left: 0px;
  // padding-left: 0px;
}
.sub {
  :deep(.el-menu-item) {
    margin-top: 10px !important;
  }
}
</style>
