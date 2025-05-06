<script setup>
import SidebarItem from './SidebarItem.vue'
import { reactive, inject } from 'vue'
import routes from './route.js'
import myRoutes from './route-my.js'
import { useUserStore } from '@/store/userState.js'

const route = useRoute()
const isCollapse = inject('isCollapse')
const emit = defineEmits(['hiddenSetting'])
const isMobile = useIsMobile()
const userStore = useUserStore()
const routesData = ref([]) // 是否为买家中心的路由
onMounted(() => {
  routesData.value = userStore.isMy(window.location.href, ['my','my-test']) ? myRoutes : routes
})

const selectMenu = () => {
  emit('hiddenSetting')
}

const activeMenu = computed({
  get: () => {
    const { fullPath } = route
    const routePath = myRoutes.find(item => {
      if (item.meta?.matchPaths) {
        // 将动态路由参数转换为正则表达式模式
        const patterns = item.meta.matchPaths.map(path => {
          return new RegExp('^' + path.replace(/:[\w-]+/g, '[^/]+') + '$')
        })
        return patterns.some(pattern => pattern.test(fullPath))// 检查是否有匹配的模式
      }
    })
    return routePath ? routePath.path : fullPath
  }
})

</script>

<template>
  <div>
    <el-scrollbar :class="{ 'border-none' : isMobile }">
      <el-menu
        :default-active="activeMenu"
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
}
.border-none {
  border-right: none;
}
:deep(.el-menu) {
  --el-menu-icon-width: 24px;
  --el-menu-base-level-padding: 12px;
  height: 100%;
  border-right: none;
  color: #344054;
  margin: 0 16px;
  padding: 0;
  .el-menu--inline {
    margin: 0;
  }
  .el-menu-item {
    margin-top: 0px;
    height: 40px;
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
  }
  
  &.sidebar-container {
    .el-menu-item {
      margin-bottom: 4px;
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
