<script setup>
import { useSettingStore } from '@/store/settingState.js'
const settingStore = useSettingStore()

const showSetting = ref(false)
const isCollapse = ref(false)
provide('isCollapse', isCollapse)
const isMobile = useIsMobile()
const route = useRoute()

</script>

<template>
  <div v-if="isMobile" class="app-wrapper">
    <!-- 顶部 navbar -->
    <div class="main-container" :class="{ m: isMobile, 'form-page': settingStore.isFormPage }">
      <div class="fixed-header">
        <!-- 顶部 navbar -->
        <navbar>
          <template #collapse>
            <div class="collapse-btn-m" @click="showSetting = !showSetting">
              <img v-if="!showSetting" src="~@/assets/imgs/menu.svg" alt="">
              <i v-else class="Flylink icon-x-close"></i>
            </div>
          </template>
        </navbar>
      </div>
      <div class="m-wrap" :class="{ 'full-page': settingStore.isFullPage, ['main-wrap-' + route.name]: true }">
        <div>
          <slot />
        </div>

        <Footer />
      </div>
      <div v-if="showSetting" class="app-main" :class="{ pd0: isMobile }">
        <route-setting @hidden-setting="showSetting = false"/>
      </div>
    </div>
    <CookiesInfo />
  </div>
  <div v-else class="app-wrapper">
    <!-- 左侧menu -->
    <sidebar
      id="guide-sidebar"
      class="sidebar"
      :style="{ width: isCollapse ? '80px' : '280px' }"
    />
    <div class="main-container" :class="{ 'form-page': settingStore.isFormPage }">
      <div class="fixed-header">
        <!-- 顶部 navbar -->
        <navbar>
          <template #collapse>
            <div class="collapse-btn" @click="isCollapse = !isCollapse">
              <img class="nav-btn" src="~@/assets/imgs/nav-btn.svg" alt="">
            </div>
          </template>
        </navbar>
      </div>
      <!-- 内容区 -->
      <div class="main-wrap" :class="{ 'full-page': settingStore.isFullPage, ['main-wrap-' + route.name]: true }">
        <div>
          <slot />
        </div>

        <Footer />
      </div>
    </div>
    <CookiesInfo />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
}
.sidebar {
  position: relative;
  z-index: 2;
  background: #fff;
}
// .sidebar-container {
//   width: 280px;
// }
.main-container {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  &.form-page {
    &.m {
      .navbar-wrap {
        background-color: #FFFFFF;
      }
      .m-wrap {
        background-color: #F9FAFB;
      }
    }
    .navbar-wrap {
      background-color: #F9FAFB;
      :deep(.lang) {
        .switch-lang {
          background-color: #FFFFFF;
        }
      }
    }
    .main-wrap {
      background-color: #F9FAFB;
    }
  }
}
.collapse-btn {
  cursor: pointer;
}
.collapse-btn-m {
  cursor: pointer;
  padding: 8px;
  .icon-x-close {
    font-size: 20px;
  }
}
.nav-btn {
  width: 48px;
  height: 40px;
}

.main-wrap {
  height: 100%;
  overflow: hidden;
  background: #fff;
  padding: 4px 32px;
  overflow-y: auto;
  &.full-page {
    display: flex;
    flex-direction: column;
    > *:first-child {
      flex: 1;
    }
  }
}
.app-main {
  position: absolute;
  padding: 0 20px;
  top: 80px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow: hidden;
  background: #fff;
}
.pd0 {
  padding: 0;
  z-index: 11;
}
.m-wrap {
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;
  overflow-y: auto;
  &.full-page {
    display: flex;
    flex-direction: column;
    > *:first-child {
      flex: 1;
    }
  }
}
</style>

<style>
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-enter-active {
  transition: all 0.5s;
}
.fade-transform-leave-active {
  transition: all 0s;
}
</style>
