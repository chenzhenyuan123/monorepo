<script setup>
import SidebarItem from './SidebarItem.vue'
import { checkResponseData } from "@/util/index.js"
const { myCouponsApi } = useApi()
import routes from './route.js'

const router = useRouter()
const isCollapse = inject('isCollapse')
const emit = defineEmits(['hiddenSetting'])
const isMobile = useIsMobile()

const selectMenu = () => {
  emit('hiddenSetting')
}

const routesData = ref([])
// 设置未读状态的函数
const setUnreadStatus = (type) => {
  routesData.value = routesData.value.map(route => {
    if (!route.children) return route

    return {
      ...route,
      children: route.children.map(child => {
        if (child.name !== 'My-Coupons') return child

        return {
          ...child,
          meta: {
            ...child.meta,
            ...(type === 'hot' ? { hot: true } : {}),
            ...(type === 'unread' ? { unread: true } : {})
          }
        }
      })
    }
  })
}



const getCouponGetSwitchStatus = async () => {
  const result = await myCouponsApi.couponGetSwitchStatus()
  const res = checkResponseData(result)
  if(res && res==='OPEN') {
    setUnreadStatus('hot')
  }
}
const getCouponCountUnusedCard = async () => {
  const result = await myCouponsApi.couponCountUnusedCard()
  const res = checkResponseData(result)
  if(res && parseInt(res?.unusedCardCount)>0) {
    setUnreadStatus('unread')
  }
}

onMounted(()=>{
  routesData.value = Object.assign([], routes)
  // 获取Hot状态
  getCouponGetSwitchStatus()
  // 获取未读状态
  getCouponCountUnusedCard()

})

</script>

<template>
  <div class="sidebar">
    <el-scrollbar :class="{ 'border-none' : isMobile }">
      <el-menu
        :default-active="$route.fullPath"
        router
        :collapse="isCollapse"
        popper-class="popper-class"
        class="sidebar-container"
        :default-openeds="['/account']"
        @select="selectMenu"
      >
        <div class="logo-container" v-if="!isMobile">
          <img v-if="isCollapse" class="abb-logo" src="~@/assets/imgs/abb-logo.svg" alt="" @click="navigateTo('/home')">
          <img v-else src="~@/assets/imgs/Flylinking-logo.svg" alt="" @click="navigateTo('/home')">
        </div>
        <template v-for="item in routesData" :key="item.path">
          <sidebar-item :item-data="item" />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped  lang="scss">
.el-scrollbar {
  border-right: 1px solid #E4E7EC;
  .rtl & {
    border-left: 1px solid #E4E7EC;
    border-right: 0;
  }
}
.border-none {
  border-right: none;
}
.sidebar {
  :deep(.el-menu) {
    --el-menu-icon-width: 24px;
    --el-menu-base-level-padding: 12px;
    height: 100%;
    border-right: none;
    color: #344054;
    margin: 0 16px;
    padding: 0;
    &:not(.el-menu--collapse) {
      .el-sub-menu__title {
        .rtl & {
          padding-left: 36px;
          padding-right: calc(var(--el-menu-base-level-padding) + var(--el-menu-level)*var(--el-menu-level-padding));
        }
      }
    }
    .el-menu--inline {
      margin: 0;
    }
    .el-menu-item {
      margin-top: 0px;
      height: 40px;
      .rtl & {
        padding-left: 12px;
        padding-right: calc(var(--el-menu-base-level-padding) + var(--el-menu-level)*var(--el-menu-level-padding));
      }
      &:hover {
        background: #fff;
      }
    }
    .el-sub-menu__title {
      height: 40px;
      &:hover {
        background: #fff;
      }
    }
    .el-menu-item.is-active {
      background: #F2F4F7;
      border-radius: 6px;
      color: #344054;
    }
    .el-sub-menu.is-active {
      .el-sub-menu__title {
        background: #F2F4F7;
        border-radius: 6px;
        color: #344054;
      }
    }
    .el-sub-menu__icon-arrow {
      font-size: 16px;
      .rtl & {
        left: 12px;
        right: auto;
      }
    }

    &.sidebar-container {
      .el-menu-item {
        margin-bottom: 4px;
      }
    }
  }
}
.logo-container {
  margin: 32px 8px 20px;
  height: 30px;
  img {
    cursor: pointer;
  }
  .abb-logo {
    margin-left: 4px;
  }
}
</style>
