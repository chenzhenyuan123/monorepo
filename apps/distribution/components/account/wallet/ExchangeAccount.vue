<script setup>
  import { useI18n } from "vue-i18n";
  import { checkResponseData, currencyFormat} from "@/util/index.js"

  const router = useRouter()
  const { t } = useI18n();
  const isMobile = useIsMobile()


  const formatterAmount = (v, c) => {
    return (c || 'USD') + ' ' + currencyFormat(v)
  }
  const jumpToWithdraw = () => {
    router.push({
      path: '/account/withdraw'
    })
  }

</script>

<template>
  <div>
    <div class="black-span fw600 mb4">Important Notes:</div>
    <ExpandContent
      class="black-span"
      :class="[ isMobile ? 'mb36' : 'mb52' ]"
      :ellipsisNum="isMobile ? 3 : 10"
    >
      Commissions are settled in USD. If you withdraw in a non-USD currency and the withdrawal fails, the converted funds will be shown in your Exchange Account.
      <br>
      <br>
      For failures caused by receiving bank rejection, the withdrawal fee is non-refundable. The final refund amount is subject to the actual amount returned by the bank.
      <br>
      <br>
      Funds in the Exchange Account can only be withdrawn in their original currency.
    </ExpandContent>
    <div class="card-group flex gap24 mb32">
      <div class="card">
        <div class="card-icon-container flex items-center justify-center mb20">
          <div class="lh0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_5666_2727)">
                <path d="M-5.24537e-07 12C-8.1423e-07 18.6274 5.37259 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37259 18.6274 -2.34843e-07 12 -5.24537e-07C5.37259 -8.1423e-07 -2.34843e-07 5.37259 -5.24537e-07 12Z" fill="#003399"/>
                <path d="M21.4302 13.237L22.4871 11.82L21.0701 10.7631L20.0132 12.1801L21.4302 13.237Z" fill="#FFD400"/>
                <path d="M20.6359 8.45754L21.0934 6.75002L19.3859 6.29248L18.9284 8.00001L20.6359 8.45754Z" fill="#FFD400"/>
                <path d="M17.7074 4.61427L17.2499 2.90674L15.5423 3.36426L15.9999 5.07177L17.7074 4.61427Z" fill="#FFD400"/>
                <path d="M13.2499 2.74999L11.9999 1.5L10.7499 2.74999L11.9999 3.99999L13.2499 2.74999Z" fill="#FFD400"/>
                <path d="M8.45764 3.36426L6.75015 2.90674L6.29262 4.61427L8.00014 5.07177L8.45764 3.36426Z" fill="#FFD400"/>
                <path d="M4.61412 6.29248L2.90659 6.75002L3.36413 8.45754L5.07166 8.00001L4.61412 6.29248Z" fill="#FFD400"/>
                <path d="M2.90769 10.7599L1.51008 11.8423L2.59249 13.2399L3.9901 12.1575L2.90769 10.7599Z" fill="#FFD400"/>
                <path d="M3.36413 15.5425L2.90659 17.25L4.61412 17.7075L5.07166 16L3.36413 15.5425Z" fill="#FFD400"/>
                <path d="M6.29262 19.3858L6.75015 21.0933L8.45764 20.6357L8.00014 18.9282L6.29262 19.3858Z" fill="#FFD400"/>
                <path d="M10.7499 21.25L11.9999 22.5L13.2499 21.25L11.9999 20L10.7499 21.25Z" fill="#FFD400"/>
                <path d="M15.5423 20.6357L17.2499 21.0933L17.7074 19.3858L15.9999 18.9282L15.5423 20.6357Z" fill="#FFD400"/>
                <path d="M19.3859 17.7075L21.0934 17.25L20.6359 15.5425L18.9283 16L19.3859 17.7075Z" fill="#FFD400"/>
              </g>
              <defs>
                <clipPath id="clip0_5666_2727">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div class="card-prompt-container">
          <el-popover
            placement="top"
            effect="dark"
            :width="309"
            :content="$t('wallet.balanceTip')"
          >
            <template #reference>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3369_8429)">
                  <path d="M9.99984 13.3333V10M9.99984 6.66666H10.0082M18.3332 10C18.3332 14.6024 14.6022 18.3333 9.99984 18.3333C5.39746 18.3333 1.6665 14.6024 1.6665 10C1.6665 5.39762 5.39746 1.66666 9.99984 1.66666C14.6022 1.66666 18.3332 5.39762 18.3332 10Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_3369_8429">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </template>
          </el-popover>
        </div>
        <div class="card-p">Available</div>
        <div class="card-amount-container">
          <span class="card-amount">{{ formatterAmount(123) }}</span>
          <div class="card-amount-center"></div>
          <el-button class="button-default" @click="jumpToWithdraw">{{$t('wallet.walletWIthdrawButton')}}</el-button>
        </div>
      </div>
      <div class="card">
        <div class="card-icon-container flex items-center justify-center mb20">
          <div class="lh0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_5666_3947)">
                <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
                <path d="M24.0008 12.0012C24.0008 7.24364 21.2322 3.13289 17.2182 1.19189V22.8104C21.2322 20.8695 24.0008 16.7587 24.0008 12.0012Z" fill="#D80027"/>
                <path d="M0.000427246 12.0004C0.000427246 16.758 2.7691 20.8687 6.78305 22.8097V1.19116C2.7691 3.13216 0.000427246 7.24291 0.000427246 12.0004Z" fill="#D80027"/>
                <path d="M14.0875 13.5663L16.1744 12.5228L15.131 12.001V10.9576L13.044 12.001L14.0875 9.91408H13.044L12.0006 8.34888L10.9571 9.91408H9.91358L10.9571 12.001L8.8701 10.9576V12.001L7.82666 12.5228L9.91358 13.5663L9.39186 14.6097H11.4788V16.1749H12.5223V14.6097H14.6092L14.0875 13.5663Z" fill="#D80027"/>
              </g>
              <defs>
                <clipPath id="clip0_5666_3947">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div class="card-prompt-container">
          <el-popover
            placement="top"
            effect="dark"
            :width="309"
            :content="$t('wallet.balanceTip')"
          >
            <template #reference>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3369_8429)">
                  <path d="M9.99984 13.3333V10M9.99984 6.66666H10.0082M18.3332 10C18.3332 14.6024 14.6022 18.3333 9.99984 18.3333C5.39746 18.3333 1.6665 14.6024 1.6665 10C1.6665 5.39762 5.39746 1.66666 9.99984 1.66666C14.6022 1.66666 18.3332 5.39762 18.3332 10Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_3369_8429">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </template>
          </el-popover>
        </div>
        <div class="card-p">Available</div>
        <div class="card-amount-container">
          <span class="card-amount">{{ formatterAmount(123) }}</span>
          <div class="card-amount-center"></div>
          <el-button class="button-default" @click="jumpToWithdraw">{{$t('wallet.walletWIthdrawButton')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/css/element-reset/button.scss" as *;
  * {
    box-sizing: border-box;
  }
  .black-span {
    color: #475467;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw600 {
      font-weight: 600;
    }
  }
  .card-group {
    .card {
      width: 510px;
      max-width: 100%;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #E4E7EC;
      background: #FFF;
      box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      position: relative;
      .card-icon-container {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        border: 1px solid #E4E7EC;
        background: #FFF;
        box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      }
      .card-prompt-container {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .card-prompt {

      }
      .card-p {
        color: #475467;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px; /* 142.857% */
        margin-bottom: 8px;
      }
      .card-amount {
        color: #101828;
        font-size: 36px;
        font-weight: 600;
        line-height: 44px; /* 122.222% */
        letter-spacing: -0.72px;
        direction: ltr;
        &.tip-trigger-style {
          text-decoration-line: underline;
          text-decoration-style: dotted;
          text-decoration-skip-ink: auto;
          text-decoration-color: #667085;
          text-decoration-thickness: auto;
          text-underline-offset: auto;
          //text-underline-position: from-font;
          text-underline-position: under;
          &:hover {
            text-decoration-style: solid;
            text-decoration-skip-ink: none;
          }
        }
      }
      .card-amount-container {
        display: flex;
        align-items: center;
        .card-amount-center {
          flex: 1;
        }
      }
    }
  }
</style>
