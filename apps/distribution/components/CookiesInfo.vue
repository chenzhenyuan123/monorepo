<script setup>
import Cookies from 'js-cookie'

const isMobile = useIsMobile()
const trackingCookies = ref(true)

onMounted(() => {
  trackingCookies.value = Cookies.get("use_tracking")
})

const tracking = accept => {
  Cookies.set("use_tracking", accept, { expires: 36500 });
  trackingCookies.value = true
}

const toPrivacy = () => {

}

</script>

<template>
  <template v-if="!trackingCookies">
    <div v-if="isMobile" class="container-m">
      <div class="t">
        {{ $t('home.cookieProtocolTip1') }} 
        <a class="privacy" href="/legal/privacy-policy" target="_blank">{{$t('login.footerPrivacyPolice')}}</a>.
      </div>
      <div class="t d">{{ $t('home.cookieProtocolTip2') }}</div>
      <button id="cookieProtocol-btn-decline" class="btn" @click="tracking('0')">
        {{ $t('home.cookieProtocolDecline') }}
      </button>
      <button id="cookieProtocol-btn-allow" class="btn allow" @click="tracking('1')">
        {{ $t('home.cookieProtocolAllow') }}
      </button>
      <i id="cookieProtocol-btn-allow" class="Flylink icon-x-close" @click="tracking('1')"></i>
    </div>
    <div v-else class="container">
      <div>
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14.0913 6.72222H20.0451C20.5172 6.72222 20.7533 6.72222 20.8914 6.82149C21.0118 6.9081 21.0903 7.04141 21.1075 7.18877C21.1272 7.35767 21.0126 7.56403 20.7833 7.97677L19.3624 10.5343C19.2792 10.684 19.2376 10.7589 19.2213 10.8381C19.2069 10.9083 19.2069 10.9806 19.2213 11.0508C19.2376 11.13 19.2792 11.2049 19.3624 11.3545L20.7833 13.9121C21.0126 14.3248 21.1272 14.5312 21.1075 14.7001C21.0903 14.8475 21.0118 14.9808 20.8914 15.0674C20.7533 15.1667 20.5172 15.1667 20.0451 15.1667H12.6136C12.0224 15.1667 11.7268 15.1667 11.501 15.0516C11.3024 14.9504 11.1409 14.7889 11.0397 14.5903C10.9247 14.3645 10.9247 14.0689 10.9247 13.4778V10.9444M7.23023 21.5L3.00801 4.61111M4.59139 10.9444H12.4024C12.9936 10.9444 13.2892 10.9444 13.515 10.8294C13.7136 10.7282 13.8751 10.5667 13.9763 10.3681C14.0913 10.1423 14.0913 9.84672 14.0913 9.25556V4.18889C14.0913 3.59772 14.0913 3.30214 13.9763 3.07634C13.8751 2.87773 13.7136 2.71625 13.515 2.61505C13.2892 2.5 12.9936 2.5 12.4024 2.5H4.6433C3.90597 2.5 3.53731 2.5 3.28515 2.65278C3.06415 2.78668 2.89995 2.99699 2.82364 3.24387C2.73659 3.52555 2.82601 3.88321 3.00484 4.59852L4.59139 10.9444Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="info">
        <div class="t">
          {{ $t('home.cookieProtocolTip1') }} 
          <a class="privacy" href="/legal/privacy-policy" target="_blank">{{$t('login.footerPrivacyPolice')}}</a>.
          {{ $t('home.cookieProtocolTip2') }}
        </div>
        <!-- <div class="t d">{{ $t('home.cookieProtocolTip2') }}</div> -->
      </div>
      <div class="right">
        <div class="flex-center-8"></div>
        <button id="cookieProtocol-btn-decline" class="btn" @click="tracking('0')">
          {{ $t('home.cookieProtocolDecline') }}
        </button>
        <div class="flex-center-12"></div>
        <button id="cookieProtocol-btn-allow" class="btn allow" @click="tracking('1')">
          {{ $t('home.cookieProtocolAllow') }}
        </button>
        <div class="flex-center-8"></div>
        <i id="cookieProtocol-btn-allow" class="Flylink icon-x-close" @click="tracking('1')"></i>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.t {
  font-size: 16px;
  color: #ffffff; 
  line-height: 24px;
}
.d {
  margin-top: 12px;
}
.container {
  position: absolute;
  z-index: 9999;
  background: #443ACC;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 112px;
  border: 1px solid #776CFF;
  display: flex;
  align-items: center;
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    /*margin: 0 16px 0 0;*/
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: #5548FF;
    .icon-flag-05 {
      color: #fff;
    }
  }
  .info {
    padding: 0 16px;
  }
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      cursor: pointer;
      padding: 10px 16px;
      border-radius: 8px;
      background: #fff;
      color: #443ACC;
      white-space: nowrap;
    }
    .allow {
      background: #5548FF;
      color: #fff;
    }
    .icon-x-close {
      display: block;
      width: 40px;
      min-width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      opacity: 0.7;
    }
  }
}
.container-m { 
  position: absolute;
  z-index: 9999;
  background: #443ACC;
  left: 8px;
  right: 8px;
  bottom: 16px;
  padding: 16px;
  border: 1px solid #776CFF;
  border-radius: 12px;
  .t {
    padding-right: 32px;
  }
  .btn {
    margin-top: 24px;
    cursor: pointer;
    padding: 10px 16px;
    border-radius: 8px;
    background: #fff;
    color: #443ACC;
    width: 100%;
  }
  .allow {
    margin-top: 12px;
    background: #5548FF;
    color: #fff;
  }
  .icon-x-close {
    cursor: pointer;
    position: absolute;
    top: 18px;
    right: 18px;
    font-size: 20px;
    color: #fff;
    opacity: 0.7;
  }
}
.privacy {
  cursor: pointer;
  color: #fff;
  text-decoration: underline;
}
</style>