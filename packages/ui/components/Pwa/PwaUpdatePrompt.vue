<!--
 * @Description: PWA 新版本更新提示
 * 依赖 @vite-pwa/nuxt 注入的 $pwa（仅在客户端可用）。
 * 当 Service Worker 检测到有新版本时（needRefresh 为 true）弹出提示，
 * 用户点击「立即更新」后由 SW 接管并自动刷新页面。
-->
<script setup name="PwaUpdatePrompt">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const nuxtApp = useNuxtApp();

// $pwa 由 @vite-pwa/nuxt 的客户端插件注入，服务端渲染时为 undefined
const pwa = computed(() => nuxtApp.$pwa);

// 是否展示更新提示
const visible = computed(() => !!pwa.value?.needRefresh);

const updating = ref(false);

// 立即更新：updateServiceWorker(true) 会在新 SW 生效后自动刷新页面
const updateNow = async () => {
  if (updating.value || !pwa.value) return;
  updating.value = true;
  try {
    await pwa.value.updateServiceWorker(true);
  } finally {
    updating.value = false;
  }
};

// 稍后再说：关闭本次提示，页面重载后会重新检测
const later = () => {
  pwa.value?.cancelPrompt?.();
};
</script>

<template>
  <ClientOnly>
    <Transition name="pwa-fade">
      <div v-if="visible" class="pwa-update-prompt">
        <div class="pwa-update-prompt__main">
          <div class="pwa-update-prompt__title">{{ t('pwa.updateTitle') }}</div>
          <div class="pwa-update-prompt__desc">{{ t('pwa.updateDesc') }}</div>
        </div>
        <div class="pwa-update-prompt__actions">
          <el-button text @click="later">{{ t('pwa.later') }}</el-button>
          <el-button type="primary" :loading="updating" @click="updateNow">
            {{ t('pwa.updateNow') }}
          </el-button>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.pwa-update-prompt {
  position: fixed;
  top: 16px;
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

  &__main {
    margin-bottom: 12px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #171717;
  }

  &__desc {
    margin-top: 4px;
    font-size: 14px;
    line-height: 20px;
    color: #4b5563;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
