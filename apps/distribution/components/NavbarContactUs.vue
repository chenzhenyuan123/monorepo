<script setup>
  import { copyToClipboard } from "@/util/index.js";


  const props = defineProps({
    miniOnMobile: {
      type: Boolean,
      default: false
    }
  })
  const isMobile = useIsMobile()


  // 复制邮箱
  const visibleForCopy = ref(false)
  let tForCopy
  const copyEmail = () => {
    visibleForCopy.value = copyToClipboard('distributor@flylinking.com')
    clearTimeoutFortCopy()
    tForCopy = setTimeout(() => {
      visibleForCopy.value = false
    }, 1000)
  }
  const clearTimeoutFortCopy = () => {
    clearTimeout(tForCopy)
  }


  onUnmounted(() => {
    clearTimeoutFortCopy()
  })
</script>
<template>
  <el-dropdown
    class="avatar-container"
    :class="{m: isMobile}"
    trigger="click"
    placement="bottom-end"
    popper-class="popper-1758192925090"
  >
    <el-button class="button">
      <div class="lh0">
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_4489_4007" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="18" height="12">
            <path d="M1.5 1.25H19V12.5H10.25H1.5V1.25Z" fill="black"/>
          </mask>
          <g mask="url(#mask0_4489_4007)">
            <path d="M10.25 2.0498C14.6407 2.0498 18.2002 5.60934 18.2002 10V14.2002H2.2998V10C2.2998 5.60934 5.85934 2.0498 10.25 2.0498Z" stroke="currentColor" stroke-width="1.6"/>
          </g>
          <rect x="1.5" y="9.32629" width="4.375" height="6.25" rx="2.1875" fill="currentColor"/>
          <rect x="14.625" y="9.32629" width="4.375" height="6.25" rx="2.1875" fill="currentColor"/>
          <path d="M13.5809 18.5583C14.8568 18.2164 15.9717 17.4364 16.7302 16.355C17.4887 15.2735 17.8424 13.9596 17.7294 12.6436" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <template v-if="!(miniOnMobile && isMobile)">
        <div class="flex-center-8"></div>
        <span>{{$t('orders.orderContactAs')}}</span>
      </template>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="info-dropdown">
        <el-dropdown-item>
          <span>distributor@flylinking.com</span>
          <div class="flex-center-12"></div>
          <el-tooltip
            :visible="visibleForCopy"
            effect="dark"
            :show-arrow="false"
            :content="$t('invitation.inviteDialogButtonCopied')"
            placement="top"
          >
            <div class="icon-button lh0" @click="copyEmail">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_4438_22425)">
                  <path d="M4.16675 12.5C3.39018 12.5 3.00189 12.5 2.69561 12.3731C2.28723 12.2039 1.96277 11.8795 1.79362 11.4711C1.66675 11.1648 1.66675 10.7765 1.66675 9.99996V4.33329C1.66675 3.39987 1.66675 2.93316 1.8484 2.57664C2.00819 2.26304 2.26316 2.00807 2.57676 1.84828C2.93328 1.66663 3.39999 1.66663 4.33341 1.66663H10.0001C10.7767 1.66663 11.1649 1.66663 11.4712 1.79349C11.8796 1.96265 12.2041 2.28711 12.3732 2.69549C12.5001 3.00177 12.5001 3.39006 12.5001 4.16663M10.1667 18.3333H15.6667C16.6002 18.3333 17.0669 18.3333 17.4234 18.1516C17.737 17.9918 17.992 17.7369 18.1518 17.4233C18.3334 17.0668 18.3334 16.6 18.3334 15.6666V10.1666C18.3334 9.23321 18.3334 8.7665 18.1518 8.40998C17.992 8.09637 17.737 7.8414 17.4234 7.68162C17.0669 7.49996 16.6002 7.49996 15.6667 7.49996H10.1667C9.23333 7.49996 8.76662 7.49996 8.4101 7.68162C8.09649 7.8414 7.84153 8.09637 7.68174 8.40998C7.50008 8.7665 7.50008 9.23321 7.50008 10.1666V15.6666C7.50008 16.6 7.50008 17.0668 7.68174 17.4233C7.84153 17.7369 8.09649 17.9918 8.4101 18.1516C8.76662 18.3333 9.23333 18.3333 10.1667 18.3333Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_4438_22425">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </el-tooltip>
          <div class="flex-center-12"></div>
          <a class="icon-button lh0" href="mailto:distributor@flylinking.com" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1.66675 5.83337L8.47085 10.5962C9.02182 10.9819 9.29731 11.1748 9.59697 11.2495C9.86166 11.3154 10.1385 11.3154 10.4032 11.2495C10.7029 11.1748 10.9783 10.9819 11.5293 10.5962L18.3334 5.83337M5.66675 16.6667H14.3334C15.7335 16.6667 16.4336 16.6667 16.9684 16.3942C17.4388 16.1545 17.8212 15.7721 18.0609 15.3017C18.3334 14.7669 18.3334 14.0668 18.3334 12.6667V7.33337C18.3334 5.93324 18.3334 5.23318 18.0609 4.6984C17.8212 4.22799 17.4388 3.84554 16.9684 3.60586C16.4336 3.33337 15.7335 3.33337 14.3334 3.33337H5.66675C4.26662 3.33337 3.56655 3.33337 3.03177 3.60586C2.56137 3.84554 2.17892 4.22799 1.93923 4.6984C1.66675 5.23318 1.66675 5.93324 1.66675 7.33337V12.6667C1.66675 14.0668 1.66675 14.7669 1.93923 15.3017C2.17892 15.7721 2.56137 16.1545 3.03177 16.3942C3.56655 16.6667 4.26662 16.6667 5.66675 16.6667Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss">
  .popper-1758192925090.el-popper {
    .el-dropdown-menu__item {
      min-width: 200px;
      padding: 11px 14px;
      color: #101828;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }
    .info-dropdown {
      cursor: default;
      .el-dropdown-menu__item {
        cursor: default;
      }
      .icon-button {
        display: inline-block;
        cursor: pointer;
      }
    }
    .user-dropdown {
    }
  }
</style>
<style scoped lang="scss">
  .button {
    height: 44px;
    border-radius: 8px;
    border: 1px solid #D0D5DD;
    background: #fff;
    /* box-shadow: 0 0 0 1px rgba(16, 24, 40, 0.18) inset, 0 -2px 0 0 rgba(16, 24, 40, 0.05) inset, 0 1px 2px 0 rgba(16, 24, 40, 0.05); */
    color: #344054;
    font-size: 16px;
    .m & {
      height: 40px;
      justify-content: left;
      .rtl & {
        justify-content: right;
      }
    }
  }
  .navbar-m-module {
    .avatar-container {
      width: 100%;
      .button {
        width: 100%;
      }
    }
  }
</style>