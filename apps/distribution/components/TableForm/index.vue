<script setup>
  const isMobile = useIsMobile()

  const props = defineProps({
    isEmpty: {
      type: Boolean,
      default: true
    }
  })
</script>

<template>
  <div :class="{ 'table-form-container':true, empty: isEmpty, m: isMobile }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .table-form-container {
    border-radius: 12px;
    border: 1px solid #E4E7EC;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    overflow: hidden;
    &.empty {
      border-radius: 0;
      border: 0;
      box-shadow: none;
      overflow: visible;
    }
    &.m {
      border-radius: 0;
      border: 0;
      box-shadow: none;
      overflow: visible;
    }
    :deep(.pro-table-wrapper) {
      border-radius: 0;
      border: 0;
      box-shadow: none;
    }
    :deep(.el-form) {
      padding: 20px;
      gap: 12px;
      .el-form-item {
        margin: 0;
        .el-form-item__label {
          min-height: 20px;
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
        &.button-container {
          .el-form-item__content {
            gap: 12px;
            .el-button {
              height: 44px;
              margin: 0;
            }
          }
        }
      }
    }
  }
</style>
