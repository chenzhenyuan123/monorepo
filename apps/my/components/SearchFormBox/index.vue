<script setup>
  const isMobile = useIsMobile()

  const props = defineProps({
    filterLabel: {
      type: String,
      default: 'Filter'
    }
  })
  const emit = defineEmits(['show','hide'])

  const isShowMobileLayer = ref(false)

  const showLayer = () => {
    isShowMobileLayer.value = true
    emit('show')
  }
  const hideLayer = () => {
    isShowMobileLayer.value = false
    emit('hide')
  }

  defineExpose({ showLayer, hideLayer })
</script>

<template>
  <div class="search-form">

    <template v-if="isMobile">
      <div class="search-form-label" @click="showLayer">
        <div class="flex-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path d="M2.82162 5.62669C2.19133 4.92225 1.87619 4.57004 1.86431 4.2707C1.85398 4.01066 1.96573 3.76073 2.1664 3.59504C2.39741 3.4043 2.87003 3.4043 3.81527 3.4043H16.1844C17.1296 3.4043 17.6023 3.4043 17.8333 3.59504C18.0339 3.76073 18.1457 4.01066 18.1354 4.2707C18.1235 4.57004 17.8083 4.92225 17.178 5.62669L12.4228 10.9413C12.2972 11.0817 12.2344 11.152 12.1896 11.2319C12.1499 11.3027 12.1207 11.379 12.1031 11.4583C12.0832 11.5477 12.0832 11.642 12.0832 11.8304V16.2863C12.0832 16.4492 12.0832 16.5307 12.0569 16.6012C12.0337 16.6634 11.9959 16.7192 11.9467 16.7639C11.8911 16.8145 11.8154 16.8447 11.6641 16.9053L8.83076 18.0386C8.52447 18.1611 8.37133 18.2224 8.24839 18.1968C8.14088 18.1745 8.04654 18.1106 7.98587 18.0191C7.9165 17.9144 7.9165 17.7495 7.9165 17.4196V11.8304C7.9165 11.642 7.9165 11.5477 7.8966 11.4583C7.87895 11.379 7.8498 11.3027 7.81007 11.2319C7.76528 11.152 7.70246 11.0817 7.57682 10.9413L2.82162 5.62669Z" stroke="#101828" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="flex-center-6"></div>
        <span>{{ filterLabel }}</span>
      </div>
      <!--  layer  -->
      <div v-if="isShowMobileLayer" class="search-form-layer">
        <div class="layer-header">
          <span>{{ filterLabel }}</span>
          <div class="layer-header-close" @click="hideLayer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
              <path d="M15 5.9043L5 15.9043M5 5.9043L15 15.9043" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <slot />
      </div>
    </template>

    <template v-else>
      <slot />
    </template>

  </div>
</template>

<style lang="scss" scoped>
  * {
    box-sizing: border-box;
  }
  .search-form {
    :deep(.el-form) {
      .el-form-item {
        padding: 0 6px 12px;
        margin: 0;
        .el-form-item__label {
          color: #344054;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 20px; /* 142.857% */
          margin-bottom: 6px;
        }
        .el-input__wrapper {
          height: 44px;
        }
        .el-select__wrapper {
          height: 44px;
        }
        .el-range-editor.el-input__wrapper {
          height: 44px;
        }
      }
      .search-form-buttons {
        display: none;
      }
    }
    .search-form-label {
      display: flex;
      align-items: center;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #D0D5DD;
      background: #FFF;
      box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      color: #344054;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 20px;
      cursor: pointer;
      .flex-icon {
        line-height: 0;
      }
      .flex-center-6 {
        width: 6px;
        min-width: 6px;
      }
    }
    .search-form-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      background-color: #ffffff;
      .layer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 22px 24px;
        color: #101828;
        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: 32px;
        .layer-header-close {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 36px;
          height: 36px;
          line-height: 0;
          cursor: pointer;
        }
      }
      :deep(.el-form) {
        .el-form-item {
          min-width: 100%;
        }
        .search-form-buttons {
          display: block;
          .el-button {
            width: 100%;
            margin: 0 0 16px;
          }
        }
      }
    }
  }
</style>
