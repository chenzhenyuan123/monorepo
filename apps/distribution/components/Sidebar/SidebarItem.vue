<script setup>
import HomeIcon from "@/assets/imgs/router-icon/router-home-icon.svg";
import ProductsIcon from "@/assets/imgs/router-icon/router-products-icon.svg";
import AccountIcon from "@/assets/imgs/router-icon/router-account-icon.svg";
import { checkResponseData } from "@/util/index.js"
const { myCouponsApi } = useApi()

const props = defineProps(['itemData'])
const isMobile = useIsMobile()

// 图标映射：将字符串映射到 Element Plus 图标组件
const iconMap = {
  'icon-home-line': HomeIcon,
  'icon-cube-01': ProductsIcon,
  'icon-user-01': AccountIcon
}

// 获取图标组件
const getIconComponent = (iconName) => {
  return iconMap[iconName] || null
}

// 处理菜单项点击
const handleMenuClick = async (item) => {  
  // 如果是 My Coupons 菜单，清除未读红点
  if (item.meta?.unread && item.name === 'My-Coupons') {
    const result = await myCouponsApi.couponRefreshCardQueryTime()
    const res = checkResponseData(result, 'NO_RETURN_DATA')
    if(res) {
      // 清除未读状态
      item.meta.unread = false
    }    
  }
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
        <span class="title ellipsis" :class="{'mgl-m': isMobile}">{{ $t(itemData.meta.title) }}</span>
      </div>
    </template>
    <sidebar-item
      v-for="item in (itemData.children || [])"
      :key="item.path"
      :item-data="item"
    />
  </el-sub-menu>
  <el-menu-item v-else :index="itemData.path" @click="handleMenuClick(itemData)">
    <template #title>
      <div class="flex justify-between items-center gap16 sub-item-box">
        <div class="sub-item-title items-center flex">
          <img v-if="itemData.meta.icon && !isMobile" class="Flylink" :src="getIconComponent(itemData.meta.icon)">          
          <span class="title ellipsis" :class="{'mgl-m': isMobile}">{{ $t(itemData.meta.title) }}</span>
          <div v-if="itemData.meta.unread" class="badge" :class="{'mr4': isMobile}" />
        </div>
        <div v-if="itemData.meta.hot" class="hot ellipsis">{{ $t('MyCoupons.Hot') }}</div>
      </div>
    </template>
    
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
.Flylink {
  width: 18px;
}
.sub-item-box * {
  vertical-align: middle;
}
.sub-item-box {
  height: 40px;
  width: 100%;
  .sub-item-title {
    height: 40px;
    line-height: 40px;
    flex: 1;
    max-width: calc(100% - 52px);
  }
  .hot {
    padding: 0px 6px;
    height: 20px;
    width: 24px;
    border-radius: 9999px;
    border: 1px solid #079455;
    background: #079455;
    color: #FFF;
    text-align: center;
    font-family: Inter;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
  }
  .badge {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #EA423B;
    margin: -12px -8px 0 -8px;
    &.mr4 {
      margin-right: 4px;
    }
  }
}
</style>
