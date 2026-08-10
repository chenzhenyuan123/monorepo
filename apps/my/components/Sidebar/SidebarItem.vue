<script setup>
import OrdersIcon from "@/assets/imgs/router-icon/router-orders-icon.svg";
import AccountIcon from "@/assets/imgs/router-icon/router-account-icon.svg";

defineProps(['itemData', 'isCollapse'])
const isMobile = useIsMobile()

// 图标映射：将字符串映射到 Element Plus 图标组件
const iconMap = {
  'icon-file-02': OrdersIcon,
  'icon-user-01': AccountIcon
}

// 获取图标组件
const getIconComponent = (iconName) => {
  return iconMap[iconName] || null
}

</script>

<template>
  <el-sub-menu
    v-if="itemData.children"
    :index="itemData.path"
    class="sub"
  >
    <template #title>
      <div class="flex">
        <img v-if="itemData.meta.icon && !isMobile" class="Flylink" :src="getIconComponent(itemData.meta.icon)">
        <span v-if="!isCollapse" class="title" :class="{'mgl-m': isMobile}">{{ $t(itemData.meta.title) }}</span>
      </div>
    </template>
    <sidebar-item
      v-for="item in (itemData.children || [])"
      :key="item.path"
      :item-data="item"
    />
  </el-sub-menu>
  <el-menu-item v-else :index="itemData.path" @click="handleMenuClick(itemData)">
    <div class="flex justify-between items-center sub-item-box">
      <div class="sub-item-title flex">
        <img v-if="itemData.meta.icon && !isMobile" class="Flylink" :src="getIconComponent(itemData.meta.icon)">          
        <span v-if="!isCollapse" class="title" :class="{'mgl-m': isMobile}">{{ $t(itemData.meta.title) }}</span>
        <div v-if="itemData.meta.unread" class="badge" :class="{'mr4': isMobile}" />
      </div>
      <div v-if="itemData.meta.hot" class="hot ellipsis">{{ $t('MyCoupons.Hot') }}</div>
    </div>    
  </el-menu-item>
</template>

<style scoped lang="scss">
.title {
  margin-left: 12px;
  margin-right: 12px;
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
