<script setup name="AccountMyCouponsList">
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const isMobile = useIsMobile()

const props = defineProps({
  membershipCardData: { // 权益卡数据
    type: Array,
    default: () => []
  },
  activeCardNo: { // 选中的权益卡
    type: String,
    default: ''
  },
  isFlex: { // 列表需要折行布局时传true-一行2个
    type: Boolean,
    default: false
  },
  isDisabled: { // 是否置灰
    type: Boolean,
    default: false
  },
  loading: { // 是否加载中
    type: Boolean,
    default: true
  },
  count: { // 权益卡数量
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['selectCard'])

// 选择权益卡
const selectCard = cardNo => {
  emit('selectCard', cardNo)
}
// 是否选中权益卡
const isActive= cardNo => {
  return  props.activeCardNo === cardNo
}

const isShowDiscountRuleDialog = ref(false)
const membershipCardUseRule = ref('')
// 权益说明
const showDiscountRuleDialog = useRule => {
  membershipCardUseRule.value = useRule
  isShowDiscountRuleDialog.value = true
}
</script>
<template>
  <div :class="{ 'MyCoupons-list flex flex-wrap gap16': true, 'm': isMobile, 'width50': isFlex }">    
    <el-skeleton animated :loading="loading" :count="count" :throttle="0" class="flex flex-wrap gap16">
      <template #template>
        <div class="MyCoupons-li flex items-center">
          <div class="MyCoupons-li-content">
            <div class="flex items-end gap10 mb8">
              <el-skeleton-item variant="text" class="width45" />
              <el-skeleton-item variant="text" class="width80" />
            </div>
            <div class="mb8">
              <el-skeleton-item variant="text" class="width60-percentage" />
            </div>
            <div>
              <el-skeleton-item variant="text" class="width50-percentage mb4" />
              <el-skeleton-item variant="text" class="width70-percentage" />
            </div>
          </div>
        </div>
      </template>
      <template #default>
      </template>
    </el-skeleton>
    <div
      v-for="(membershipCardItem) in membershipCardData"
      :key="membershipCardItem.cardNo"
      class="MyCoupons-li flex items-center"
      :class="{ active: isActive(membershipCardItem.cardNo), 'cursor-pointer': !isFlex, 'disabled disabled-text': isDisabled }"
      @click="selectCard(membershipCardItem.cardNo)"
    >
      <div class="MyCoupons-li-content">
        <div class="flex items-baseline mb2">
            <span class="rad-span fw500">{{ membershipCardItem.discountNumber || membershipCardItem.ratio }}</span>
            <div class="flex-center-2"></div>
            <span class="rad-span f14 fw500">%</span>
            <div class="flex-center-10"></div>
            <span class="rad-span f12">{{$t('DiscountDetailsDialog.rateLabel')}}</span>
        </div>
        <div class="flex items-center mb4">
          <div class="tertiary-span2">{{ membershipCardItem.cardName }}</div>
          <div class="flex-center-4"></div>
          <div v-if="membershipCardItem.useRule" class="lh0 cursor-pointer" @click.stop="showDiscountRuleDialog(membershipCardItem.useRule)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_5254_2194)">
                <path d="M6 8V6M6 4H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="#98A2B3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_5254_2194">
                  <rect width="12" height="12" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div class="tertiary-span f12">{{$t('DiscountDetailsDialog.couponIdLabel')}} {{ membershipCardItem.cardNo }}</div>
        <div class="tertiary-span f12">{{ membershipCardItem.startDate }} ~ {{ membershipCardItem.endDate }} (UTC+8)</div>
      </div>
      <div class="MyCoupons-li-right flex items-center">
        <div class="half-circle-top"></div>
        <div class="half-circle-bottom"></div>
        <div v-if="isActive(membershipCardItem.cardNo)" class="tick-icon lh0 mirror-x-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_8650_7502)">
              <path d="M24 24L24 5.40001C24 2.41765 24 6.47376e-06 24 6.47376e-06L0 0L24 24Z" fill="#FF2477"/>
              <g clip-path="url(#clip1_8650_7502)">
                <path d="M21.1022 3.60211C21.3217 3.38261 21.6774 3.38284 21.8971 3.60211C22.1168 3.82177 22.1167 4.17736 21.8971 4.39703L15.8971 10.397C15.6774 10.6167 15.3218 10.6167 15.1022 10.397L12.1022 7.39703C11.8829 7.17733 11.8826 6.82165 12.1022 6.60211C12.3217 6.38261 12.6774 6.38284 12.8971 6.60211L15.4996 9.20465L21.1022 3.60211Z" fill="white"/>
              </g>
            </g>
            <defs>
              <clipPath id="clip0_8650_7502">
                <path d="M0 0H16C20.4183 0 24 3.58172 24 8V24H0V0Z" fill="white"/>
              </clipPath>
              <clipPath id="clip1_8650_7502">
                <rect width="12" height="12" fill="white" transform="translate(11 1)"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        <div class="right-icon lh0">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" class="mirror-x-icon">
            <mask id="mask0_6719_1395" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="2" y="4" width="36" height="32">
              <path d="M30.0892 8.52458C30.3202 8.92463 30.4356 9.12466 30.4684 9.28158C30.5094 9.47816 30.5092 9.50622 30.4658 9.70227C30.4311 9.85877 30.2285 10.1997 29.8235 10.8814C29.2121 11.9106 29.1596 13.2309 29.8008 14.3415C30.442 15.4521 31.6115 16.0666 32.8085 16.0516C33.6014 16.0416 33.9978 16.0366 34.1507 16.0848C34.3422 16.1452 34.3666 16.1591 34.5164 16.2929C34.6359 16.3997 34.7514 16.5998 34.9824 16.9999L36.868 20.2658C37.148 20.7508 37.288 20.9933 37.3006 21.2331C37.3116 21.444 37.2556 21.653 37.1406 21.8301C37.0099 22.0314 36.7674 22.1714 36.2823 22.4515L13.9821 35.3265C13.497 35.6066 13.2545 35.7466 13.0148 35.7591C12.8039 35.7702 12.5949 35.7142 12.4178 35.5992C12.2165 35.4684 12.0764 35.2259 11.7964 34.7409L9.833 31.3401C9.6995 31.1089 9.63275 30.9933 9.60594 30.9259C9.44417 30.5196 9.46074 30.3632 9.70408 29.9997C9.74441 29.9395 9.90699 29.7595 10.2321 29.3997C11.2005 28.3279 11.4164 26.7136 10.6553 25.3952C9.84636 23.9942 8.19612 23.3817 6.71113 23.8274C6.16337 23.9919 5.51504 23.8612 5.22909 23.3659L4.96411 22.907L3.13228 19.7342C2.85225 19.2491 2.71224 19.0066 2.69967 18.7669C2.68862 18.556 2.74461 18.347 2.85963 18.1699C2.99039 17.9686 3.2329 17.8285 3.71792 17.5485L21.4778 7.29482L23.9596 5.86196L26.0182 4.67343C26.5032 4.39341 26.7457 4.2534 26.9855 4.24083C27.1964 4.22978 27.4053 4.28577 27.5825 4.40079C27.7838 4.53155 27.9238 4.77406 28.2038 5.25908L30.0892 8.52458Z" fill="currentColor"/>
            </mask>
            <g mask="url(#mask0_6719_1395)">
              <path d="M30.0892 8.52458C30.3202 8.92463 30.4356 9.12466 30.4684 9.28158C30.5094 9.47816 30.5092 9.50622 30.4658 9.70227C30.4311 9.85877 30.2285 10.1997 29.8235 10.8814C29.2121 11.9106 29.1596 13.2309 29.8008 14.3415C30.442 15.4521 31.6115 16.0666 32.8085 16.0516C33.6014 16.0416 33.9978 16.0366 34.1507 16.0848C34.3422 16.1452 34.3666 16.1591 34.5164 16.2929C34.6359 16.3997 34.7514 16.5998 34.9824 16.9999L36.868 20.2658C37.148 20.7508 37.288 20.9933 37.3006 21.2331C37.3116 21.444 37.2556 21.653 37.1406 21.8301C37.0099 22.0314 36.7674 22.1714 36.2823 22.4515L13.9821 35.3265C13.497 35.6066 13.2545 35.7466 13.0148 35.7591C12.8039 35.7702 12.5949 35.7142 12.4178 35.5992C12.2165 35.4684 12.0764 35.2259 11.7964 34.7409L9.833 31.3401C9.6995 31.1089 9.63275 30.9933 9.60594 30.9259C9.44417 30.5196 9.46074 30.3632 9.70408 29.9997C9.74441 29.9395 9.90699 29.7595 10.2321 29.3997C11.2005 28.3279 11.4164 26.7136 10.6553 25.3952C9.84636 23.9942 8.19612 23.3817 6.71113 23.8274C6.16337 23.9919 5.51504 23.8612 5.22909 23.3659L4.96411 22.907L3.13228 19.7342C2.85225 19.2491 2.71224 19.0066 2.69967 18.7669C2.68862 18.556 2.74461 18.347 2.85963 18.1699C2.99039 17.9686 3.2329 17.8285 3.71792 17.5485L21.4778 7.29482L23.9596 5.86196L26.0182 4.67343C26.5032 4.39341 26.7457 4.2534 26.9855 4.24083C27.1964 4.22978 27.4053 4.28577 27.5825 4.40079C27.7838 4.53155 27.9238 4.77406 28.2038 5.25908L30.0892 8.52458Z" fill="currentColor"/>
              <path d="M20.4169 13.9525L15.1931 24.8165C15.0869 25.0373 15.1471 25.3021 15.3383 25.4553L16.5985 26.4653C16.8462 26.6638 17.2118 26.5996 17.377 26.3287L23.6823 15.9933C23.8302 15.751 23.7592 15.4351 23.522 15.2792L21.1803 13.7407C20.9141 13.5658 20.5549 13.6655 20.4169 13.9525Z" fill="white"/>
              <path d="M17.0581 16.2433C17.2753 17.088 16.7666 17.9487 15.922 18.1659C15.0774 18.3831 14.2166 17.8745 13.9994 17.0299C13.7822 16.1852 14.2908 15.3244 15.1355 15.1072C15.9801 14.89 16.8409 15.3987 17.0581 16.2433Z" fill="white"/>
              <path d="M25.1418 22.317C25.359 23.1616 24.8503 24.0224 24.0057 24.2396C23.1611 24.4568 22.3003 23.9482 22.0831 23.1035C21.8659 22.2589 22.3745 21.3981 23.2191 21.1809C24.0638 20.9637 24.9246 21.4723 25.1418 22.317Z" fill="white"/>
            </g>
            <path d="M5.38139 2.81592C5.40337 2.74807 5.44628 2.68894 5.50395 2.64699C5.56163 2.60505 5.63111 2.58246 5.70242 2.58246C5.77373 2.58246 5.84321 2.60505 5.90088 2.64699C5.95856 2.68894 6.00146 2.74807 6.02344 2.81592L6.56514 4.45266C6.80669 5.18089 7.37858 5.75281 8.10766 5.99437L9.7443 6.5361C9.81247 6.55787 9.87196 6.60074 9.91417 6.65853C9.95638 6.71631 9.97913 6.78603 9.97913 6.85759C9.97913 6.92915 9.95638 6.99886 9.91417 7.05665C9.87196 7.11444 9.81247 7.15731 9.7443 7.17908L8.10766 7.72081C7.74844 7.84014 7.42206 8.04175 7.15456 8.30958C6.88706 8.5774 6.68583 8.90403 6.56692 9.26341L6.02433 10.9001C6.00235 10.968 5.95945 11.0271 5.90177 11.0691C5.8441 11.111 5.77462 11.1336 5.70331 11.1336C5.632 11.1336 5.56252 11.111 5.50484 11.0691C5.44717 11.0271 5.40426 10.968 5.38228 10.9001L4.84058 9.26341C4.72149 8.90384 4.51999 8.57709 4.25217 8.30925C3.98435 8.04141 3.65762 7.8399 3.29807 7.72081L1.66142 7.17908C1.59358 7.15709 1.53445 7.11419 1.49251 7.05651C1.45057 6.99883 1.42798 6.92935 1.42798 6.85803C1.42798 6.78672 1.45057 6.71723 1.49251 6.65956C1.53445 6.60188 1.59358 6.55897 1.66142 6.53699L3.29807 5.99526C3.65745 5.87605 3.98401 5.67448 4.25167 5.40665C4.51933 5.13882 4.72069 4.81213 4.83969 4.45266L5.38139 2.81592Z" fill="currentColor"/>
            <path d="M30.5505 30.9015C30.5724 30.8337 30.6153 30.7746 30.673 30.7326C30.7307 30.6907 30.8002 30.6681 30.8715 30.6681C30.9428 30.6681 31.0123 30.6907 31.07 30.7326C31.1276 30.7746 31.1705 30.8337 31.1925 30.9015L31.7342 32.5383C31.9758 33.2665 32.5476 33.8384 33.2767 34.08L34.9134 34.6217C34.9815 34.6435 35.041 34.6864 35.0832 34.7442C35.1254 34.8019 35.1482 34.8717 35.1482 34.9432C35.1482 35.0148 35.1254 35.0845 35.0832 35.1423C35.041 35.2001 34.9815 35.2429 34.9134 35.2647L33.2767 35.8064C32.9175 35.9258 32.5911 36.1274 32.3236 36.3952C32.0561 36.663 31.8549 36.9897 31.736 37.349L31.1934 38.9858C31.1714 39.0536 31.1285 39.1128 31.0708 39.1547C31.0132 39.1966 30.9437 39.2192 30.8724 39.2192C30.8011 39.2192 30.7316 39.1966 30.6739 39.1547C30.6162 39.1128 30.5733 39.0536 30.5513 38.9858L30.0096 37.349C29.8906 36.9895 29.6891 36.6627 29.4212 36.3949C29.1534 36.127 28.8267 35.9255 28.4671 35.8064L26.8305 35.2647C26.7626 35.2427 26.7035 35.1998 26.6616 35.1421C26.6196 35.0845 26.597 35.015 26.597 34.9437C26.597 34.8723 26.6196 34.8029 26.6616 34.7452C26.7035 34.6875 26.7626 34.6446 26.8305 34.6226L28.4671 34.0809C28.8265 33.9617 29.1531 33.7601 29.4207 33.4923C29.6884 33.2244 29.8898 32.8978 30.0088 32.5383L30.5505 30.9015Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 权益卡说明 -->
    <AccountWithdrawDiscountRuleDialog
      v-if="isShowDiscountRuleDialog"
      v-model="isShowDiscountRuleDialog"
      :useRule="membershipCardUseRule"
    ></AccountWithdrawDiscountRuleDialog>
  </div>
</template>

<style lang="scss" scoped>
.MyCoupons-list {
  .MyCoupons-li {
    width: 100%;
    position: relative;
    z-index: 1;
    padding: 1px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #E4E3EA;
    &.active {
      // linear-gradient(270deg, #FF2477 1.73%, #F96341 100%)
      border-color: #FE306D;
      .half-circle-top {
        border-color: #FE306D;
      }
      .half-circle-bottom {
        border-color: #FE306D;
      }
    }
    &.disabled {
      background-color: #f7f8fb;
      .border {
        background: #E4E3EA;
      }
      .half-circle-top {
        border-color: #E4E3EA;
      }
      .MyCoupons-li-content {
        background-color: #F7F8FB;
      }
      .right-icon svg {
        color: #A5A4AA;
      }
    }
    &.disabled-text {
      .rad-span, .tertiary-span2, .tertiary-span {
        color: #A5A4AA;
      }      
    }
    .MyCoupons-li-right {
      position: relative;
      height: calc(100% - 34px);

    }
    .half-circle-top {
      width: 14px;
      height: 7px;
      border: 1px solid #E4E3EA;
      border-top: 0;
      border-bottom-right-radius: 9999px;
      border-bottom-left-radius: 9999px;
      background-color: #ffffff;
      position: absolute;
      top: -19px;
      left: -8px;
    }
    .half-circle-bottom {
      width: 14px;
      height: 7px;
      border: 1px solid #E4E3EA;
      border-bottom: 0;
      border-top-right-radius: 9999px;
      border-top-left-radius: 9999px;
      background-color: #ffffff;
      position: absolute;
      bottom: -19px;
      left: -8px;
    }
    .tick-icon {
      position: absolute;
      right: -2px;
      top: -19px;
    }
    .right-icon {
      width: 40px;
      height: 40px;
      padding: 16px;
      border-left: 1px dashed #E4E3EA;
      border-right: none;
      svg {
        color: #FB5250;
        height: 100%;
      }
    }
    .MyCoupons-li-content {
      flex: 1;
      height: 100%;
      min-height: 98px;
      padding: 8px 16px;
      border-radius: 9px;
      background-color: #ffffff;
      box-sizing: border-box;
    }
  }
  &.width50 {
    .MyCoupons-li {
      width: calc(50% - 16px);
    }
  }
  &.m {
    .MyCoupons-li {
      width: 100%;
    }
  }
}

.rad-span {
  color: #FF2477;
  font-size: 24px;
  font-family: var(--font-family-ZH, "PingFang SC");
  font-weight: 400;
  line-height: 34px;
  &.f12 {
    font-size: 12px;
    line-height: 18px;
  }
  &.f14 {
    font-size: 14px;
    line-height: 20px;
  }
  &.fw500 {
    font-weight: 500;
  }
  &.fw600 {
    font-weight: 600;
  }
}
.black-span {
  color: #171717;
  font-size: 18px;
  font-family: var(--font-family-ZH, "PingFang SC");
  font-weight: 500;
  line-height: 28px;
}
.tertiary-span {
  color: #817F86;
  font-size: 14px;
  font-family: var(--font-family-ZH, "PingFang SC");
  font-weight: 400;
  line-height: 20px;
  &.f12 {
    font-size: 12px;
    line-height: 18px;
  }
}
.tertiary-span2 {
  color: #38373D;
  font-size: 12px;
  font-family: var(--font-family-ZH, "PingFang SC");
  font-weight: 500;
  line-height: 18px;
}
.width45 {
  width: 45px;
  height: 24px !important;
}
.width80 {
  width: 80px;
}
.width50-percentage {
  width: 50%;
}
.width60-percentage {
  width: 60%;
}
.width70-percentage {
  width: 70%;
}

.rtl {
  .MyCoupons-list .MyCoupons-li {
    .half-circle-top, .half-circle-bottom {
      left: 68px;
    }
    .tick-icon {
      right: auto;
      top: -19px;
      left: -2px;
    }
    .right-icon {
      border-right: 1px dashed #E4E3EA;
      border-left: none;
    }
  } 
}
</style>