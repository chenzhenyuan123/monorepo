<script setup name="Profile">
  import { arrToDict } from "@/util/index.js"
  import { useI18n } from "vue-i18n";
  import { TermsOfUsage, TermsOfUsageForBuyer } from '@flylinking/ui';
  import {changeHash} from "@flylinking/core/utils/router";

  definePageMeta({
    layout: 'noside'
  });

  const { t, locale } = useI18n();
  const isMobile = useIsMobile()


  const anchorActive = ref()
  const anchorData = computed(() => {
    return [
      { value: 'Distributor', label: 'Distributor Terms' },
      { value: 'Buyer', label: 'Buyer Terms' },
    ]
  })
  const anchorDict = computed(() => {
    return arrToDict(anchorData.value)
  })
  const changeMenu = id => {
    anchorActive.value = id
    const t = setTimeout(() => {
      changeHash(`#${id}`)
      clearTimeout(t)
    })
  }


  console.log('profile')

  onMounted(() => {
    const firstAnchor = anchorData.value[0].value
    const hash = window.location.hash ? window.location.hash.substring(1) : ''
    if (!anchorDict.value[hash] || hash === firstAnchor) {
      //
      anchorActive.value = firstAnchor
      changeHash(`#${anchorActive.value}`)
    } else {
      changeMenu(hash)
    }
  })

  onBeforeUnmount(() => {
  });
</script>

<template>
  <div :class="{ 'page': true, 'm': isMobile }">
    <div class="head">
      <svg xmlns="http://www.w3.org/2000/svg" width="84" height="27" viewBox="0 0 84 27" fill="none">
        <path d="M9.28871 7.55979H6.64684V5.30799C6.64684 4.36234 7.41649 3.59274 8.36377 3.59274H9.28696C10.2775 3.59274 11.0798 2.79036 11.0798 1.80162C11.0798 0.812867 10.2757 0.012207 9.28521 0.012207H8.3621C5.43896 0.012207 3.06111 2.3883 3.06111 5.30799V7.55979H1.79282C0.802393 7.55979 0 8.36043 0 9.34745C0 10.3345 0.802393 11.1352 1.79282 11.1352H3.06111V20.9812C3.06111 21.97 3.8635 22.7723 4.85401 22.7723C5.84445 22.7723 6.64684 21.97 6.64684 20.9812V11.1352H9.28871C10.2791 11.1352 11.0815 10.3345 11.0815 9.34745C11.0815 8.36043 10.2791 7.55979 9.28871 7.55979Z" fill="#222222"/>
        <path d="M15.4726 0.0032959C14.4821 0.0032959 13.6797 0.803956 13.6797 1.7927V20.9913C13.6797 21.9801 14.4821 22.7807 15.4726 22.7807C16.463 22.7807 17.2654 21.9801 17.2654 20.9913V1.7927C17.2654 0.803956 16.463 0.0032959 15.4726 0.0032959Z" fill="#222222"/>
        <path d="M36.6351 0C35.6463 0 34.8457 0.80066 34.8457 1.78941V20.988C34.8457 21.9767 35.6463 22.7774 36.6351 22.7774C37.6238 22.7774 38.4245 21.9767 38.4245 20.988V1.78941C38.4245 0.80066 37.6238 0 36.6351 0Z" fill="#222222"/>
        <path d="M31.0756 5.51507C30.1386 5.1734 29.0999 5.6497 28.7548 6.57631L26.0543 13.7667L23.3813 6.57973C23.0362 5.65312 21.9975 5.17856 21.0604 5.51857C20.1235 5.86023 19.6438 6.88691 19.9889 7.81527L24.1199 18.9192L21.9819 24.5946C21.6368 25.5212 22.1165 26.5497 23.0535 26.8896C23.2588 26.9638 23.471 27.0001 23.6782 27.0001C24.4132 27.0001 25.1051 26.5514 25.3743 25.8284L32.1489 7.8101C32.4941 6.88349 32.0143 5.85499 31.0773 5.51507H31.0756Z" fill="#222222"/>
        <path d="M42.808 5.40967C41.8193 5.40967 41.0186 6.20515 41.0186 7.187V20.9949C41.0186 21.9767 41.8193 22.7722 42.808 22.7722C43.7967 22.7722 44.5974 21.9767 44.5974 20.9949V7.187C44.5974 6.20515 43.7967 5.40967 42.808 5.40967Z" fill="#222222"/>
        <path d="M42.8075 3.58564C43.798 3.58564 44.6004 2.78498 44.6004 1.79795C44.6004 0.810938 43.7962 0.00854492 42.8075 0.00854492C41.8188 0.00854492 41.0146 0.809205 41.0146 1.79623C41.0146 2.78325 41.817 3.58391 42.8075 3.58391V3.58564Z" fill="#222222"/>
        <path d="M66.5602 5.40283C65.5714 5.40283 64.7708 6.20347 64.7708 7.19224V15.166C64.7708 17.4076 62.9469 19.2331 60.7036 19.2331C58.4604 19.2331 56.6364 17.4092 56.6364 15.166V13.0539C56.6364 12.0652 55.8358 11.2645 54.847 11.2645C53.8583 11.2645 53.0576 12.0652 53.0576 13.0539V15.166C53.0576 19.3816 56.4881 22.812 60.7053 22.812C64.9226 22.812 68.353 19.3816 68.353 15.166V7.19224C68.353 6.20347 67.5523 5.40283 66.5636 5.40283H66.5602Z" fill="url(#paint0_linear_4031_20784)"/>
        <path d="M58.9188 13.0488V15.1608C58.9188 16.1496 59.7194 16.9503 60.7082 16.9503C61.6969 16.9503 62.4976 16.1496 62.4976 15.1608V13.0488C62.4976 8.83319 59.0672 5.40283 54.8499 5.40283C50.6326 5.40283 47.2021 8.83319 47.2021 13.0488V21.0225C47.2021 22.0113 48.0029 22.812 48.9916 22.812C49.9803 22.812 50.781 22.0113 50.781 21.0225V13.0488C50.781 10.8073 52.605 8.98165 54.8482 8.98165C57.0914 8.98165 58.9153 10.8056 58.9153 13.0488H58.9188Z" fill="url(#paint1_linear_4031_20784)"/>
        <path d="M77.8468 13.7614L82.8339 8.40871C83.5071 7.68572 83.4671 6.55374 82.7439 5.87906C82.0216 5.20439 80.8894 5.2458 80.2145 5.96879L74.5134 12.0893V1.79465C74.5134 0.805909 73.7127 0.00524902 72.724 0.00524902C71.7352 0.00524902 70.9346 0.805909 70.9346 1.79465V21.0295C70.9346 22.0182 71.7352 22.8189 72.724 22.8189C73.7127 22.8189 74.5134 22.0182 74.5134 21.0295V17.3403L75.3848 16.4032L80.0746 22.1442C80.4286 22.5773 80.9427 22.8016 81.4626 22.8016C81.8608 22.8016 82.2607 22.6687 82.594 22.3978C83.3605 21.7732 83.4721 20.6446 82.8481 19.8802L77.8493 13.7597L77.8468 13.7614Z" fill="#222222"/>
        <defs>
          <linearGradient id="paint0_linear_4031_20784" x1="60.7019" y1="22.7844" x2="60.7019" y2="6.75043" gradientUnits="userSpaceOnUse">
            <stop offset="0.2" stop-color="#5248E2"/>
            <stop offset="0.58" stop-color="#9B52F1"/>
            <stop offset="0.86" stop-color="#CC59FB"/>
            <stop offset="1" stop-color="#DF5CFF"/>
          </linearGradient>
          <linearGradient id="paint1_linear_4031_20784" x1="54.8499" y1="22.7844" x2="54.8499" y2="6.75043" gradientUnits="userSpaceOnUse">
            <stop offset="0.2" stop-color="#5248E2"/>
            <stop offset="0.58" stop-color="#9B52F1"/>
            <stop offset="0.86" stop-color="#CC59FB"/>
            <stop offset="1" stop-color="#DF5CFF"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div :class="{ 'profile-box': true, 'm': isMobile }">
      <div class="profile-menu">
        <a
                v-for="item in anchorData"
                :key="item.value"
                :id="'profile-anchor-' + item.value"
                href="#"
                :class="{ 'profile-menu-item': true, 'active': item.value === anchorActive }"
                @click="changeMenu(item.value)"
        >
          {{ item.label }}
        </a>
      </div>
<!--      <el-select-->
<!--              v-model="anchorActive"-->
<!--              placeholder=""-->
<!--              class="profile-select-menu select-default"-->
<!--              @change="changeMenu"-->
<!--      >-->
<!--        <el-option-->
<!--                v-for="item in anchorData"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value"-->
<!--        />-->
<!--      </el-select>-->

      <div v-if="isMobile" class="profile-tip-menu-container">
        <el-dropdown trigger="click" placement="bottom-end" :teleported="false">
          <div class="profile-tip-menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 9.99996L7.5 9.99996M17.5 4.99996L7.5 4.99996M17.5 15L7.5 15M4.16667 9.99996C4.16667 10.4602 3.79357 10.8333 3.33333 10.8333C2.8731 10.8333 2.5 10.4602 2.5 9.99996C2.5 9.53972 2.8731 9.16663 3.33333 9.16663C3.79357 9.16663 4.16667 9.53972 4.16667 9.99996ZM4.16667 4.99996C4.16667 5.4602 3.79357 5.83329 3.33333 5.83329C2.8731 5.83329 2.5 5.4602 2.5 4.99996C2.5 4.53972 2.8731 4.16663 3.33333 4.16663C3.79357 4.16663 4.16667 4.53972 4.16667 4.99996ZM4.16667 15C4.16667 15.4602 3.79357 15.8333 3.33333 15.8333C2.8731 15.8333 2.5 15.4602 2.5 15C2.5 14.5397 2.8731 14.1666 3.33333 14.1666C3.79357 14.1666 4.16667 14.5397 4.16667 15Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                      v-for="item in anchorData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :class="{ active: item.value === anchorActive }"
                      @click="changeMenu(item.value)"
              >{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="profile-group">
        <div v-if="anchorActive === 'Distributor'" id="Distributor" class="profile">
          <TermsOfUsage />
        </div>
        <div v-else-if="anchorActive === 'Buyer'" id="Buyer" class="profile">
          <TermsOfUsageForBuyer />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/css/element-reset/select.scss" as *;
  * {
    box-sizing: border-box;
  }
  .head {
    height: 80px;
    padding: 0 32px;
    display: flex;
    align-items: center;
  }
  .profile-box {
    word-break: break-word;

    &.m {
      display: block;
      margin: 0;
      padding: 0;
      .profile-menu {
        display: none;
      }
      .profile-group {
        width: 100%;
        padding: 0 16px;
      }
    }
    .profile-menu {
      width: 280px;
      min-width: 280px;
      padding: 0 16px;
      float: left;
      position: sticky;
      top: 32px;
      .rtl & {
        float: right;
      }
      .profile-menu-item {
        display: inline-block;
        width: 100%;
        padding: 8px 12px;
        color: #344054;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px; /* 142.857% */
        text-decoration: auto;
        text-align: right;
        &.active {
          color: #182230;
          border-radius: 6px;
          background: #F2F4F7;
          cursor: default;
        }
        + .profile-menu-item {
          margin-top: 4px;
        }
      }
    }
    .profile-tip-menu-container {
      position: fixed;
      top: 96px;
      right: 16px;
      .profile-tip-menu {
        padding: 8px;
        border-radius: 8px;
        border: 1px solid #D0D5DD;
        background: #FFF;
        box-shadow: 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      }
      :deep(.el-dropdown-menu) {
        padding: 5px 6px;
        border-radius: 8px;
        border: 1px #E4E7EC;
        box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
      }
      :deep(.el-dropdown-menu__item) {
        padding: 10px 10px 10px 8px;
        color: #101828;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        &.active {
          border-radius: 6px;
          background: #F9FAFB;
        }
      }
    }
    .profile-group {
      display: inline-block;
      width: calc(100% - 280px);
    }
  }
  .profile {
    /*margin-bottom: 32px;*/
  }
</style>
