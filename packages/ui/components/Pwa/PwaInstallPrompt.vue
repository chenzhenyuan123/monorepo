<!--
 * @Description: PWA 添加到主屏幕引导
 * 分两种场景：
 * 1. Android / Chromium：监听 beforeinstallprompt（由 @vite-pwa/nuxt 的 installPrompt 选项开启），
 *    展示自定义安装条，点击「立即安装」调用 $pwa.install()。
 * 2. iOS Safari：系统不提供 beforeinstallprompt，改为展示「分享 → 添加到主屏幕」图文引导。
 *    iOS 引导关闭后 7 天内不再重复打扰。
-->
<script setup name="PwaInstallPrompt">
import { Close } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const nuxtApp = useNuxtApp();

// iOS 安装引导的关闭时间，避免每次都弹
const IOS_GUIDE_DISMISS_KEY = 'pwa_ios_install_guide_dismissed_at';
// 关闭后重新展示的间隔：7 天
const IOS_GUIDE_RE_SHOW_INTERVAL = 7 * 24 * 60 * 60 * 1000;

// $pwa 由 @vite-pwa/nuxt 的客户端插件注入，服务端渲染时为 undefined
const pwa = computed(() => nuxtApp.$pwa);

const showIosGuide = ref(false);

// 是否 iOS 设备（iPadOS 13+ 的 Safari 以 Macintosh 上报，需要结合触点数量判断）
const isIosDevice = () => {
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
};

// 是否已处于「已安装」的独立窗口模式
const isStandaloneMode = () => {
  const displayMode = window.matchMedia ? window.matchMedia('(display-mode: standalone)') : null;
  return displayMode?.matches === true || window.navigator.standalone === true;
};

// Android / Chromium 的可安装状态
const showNativePrompt = computed(() => {
  if (pwa.value?.isPWAInstalled) return false;
  return !!pwa.value?.showInstallPrompt;
});

onMounted(() => {
  if (isStandaloneMode() || !isIosDevice()) return;
  const dismissedAt = Number(localStorage.getItem(IOS_GUIDE_DISMISS_KEY) || 0);
  if (Date.now() - dismissedAt < IOS_GUIDE_RE_SHOW_INTERVAL) return;
  showIosGuide.value = true;
});

// 触发浏览器安装流程
const install = async () => {
  await pwa.value?.install?.();
};

// 关闭 Android 安装条（由模块记录到 localStorage，不再重复展示）
const cancelInstall = () => {
  pwa.value?.cancelInstall?.();
};

// 关闭 iOS 引导
const dismissIosGuide = () => {
  localStorage.setItem(IOS_GUIDE_DISMISS_KEY, String(Date.now()));
  showIosGuide.value = false;
};
</script>

<template>
  <ClientOnly>
    <!-- Android / Chromium：自定义安装条 -->
    <Transition name="pwa-fade">
      <div v-if="showNativePrompt" class="pwa-install-bar">
        <img class="pwa-install-bar__icon" src="/pwa-192x192.png" alt="FlyLinking" />
        <div class="pwa-install-bar__main">
          <div class="pwa-install-bar__title">{{ t('pwa.installTitle') }}</div>
          <div class="pwa-install-bar__desc">{{ t('pwa.installDesc') }}</div>
        </div>
        <el-button type="primary" class="pwa-install-bar__btn" @click="install">
          {{ t('pwa.installNow') }}
        </el-button>
        <el-icon class="pwa-install-bar__close" @click="cancelInstall"><Close /></el-icon>
      </div>
    </Transition>

    <!-- iOS：图文引导 -->
    <Transition name="pwa-fade">
      <div v-if="showIosGuide" class="pwa-ios-guide">
        <div class="pwa-ios-guide__header">
          <span class="pwa-ios-guide__title">{{ t('pwa.iosGuideTitle') }}</span>
          <el-icon class="pwa-ios-guide__close" @click="dismissIosGuide"><Close /></el-icon>
        </div>
        <ol class="pwa-ios-guide__steps">
          <li>{{ t('pwa.iosGuideStep1') }}</li>
          <li>{{ t('pwa.iosGuideStep2') }}</li>
          <li>{{ t('pwa.iosGuideStep3') }}</li>
        </ol>
        <el-button type="primary" class="pwa-ios-guide__btn" @click="dismissIosGuide">
          {{ t('pwa.gotIt') }}
        </el-button>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.pwa-install-bar {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: calc(100% - 32px);
  max-width: 480px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px 0 #00000026;

  &__icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  &__main {
    flex: 1;
    min-width: 0;
    margin: 0 12px;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    line-height: 21px;
    color: #171717;
  }

  &__desc {
    margin-top: 2px;
    font-size: 13px;
    line-height: 18px;
    color: #4b5563;
  }

  &__btn {
    flex-shrink: 0;
  }

  &__close {
    flex-shrink: 0;
    margin-left: 8px;
    font-size: 14px;
    color: #8b8b8b;
    cursor: pointer;
  }
}

.pwa-ios-guide {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  box-sizing: border-box;
  width: calc(100% - 32px);
  max-width: 420px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px 0 #00000026;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #171717;
  }

  &__close {
    font-size: 14px;
    color: #8b8b8b;
    cursor: pointer;
  }

  &__steps {
    margin: 8px 0 16px;
    padding-left: 18px;
    font-size: 14px;
    line-height: 22px;
    color: #4b5563;

    li + li {
      margin-top: 4px;
    }
  }

  &__btn {
    width: 100%;
  }
}

.pwa-fade-enter-active,
.pwa-fade-leave-active {
  transition: opacity 0.2s ease;
}

.pwa-fade-enter-from,
.pwa-fade-leave-to {
  opacity: 0;
}
</style>
