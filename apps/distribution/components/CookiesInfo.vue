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
        <div class="icon" alt="">
          <i class="Flylink icon-flag-05"></i>
        </div>
      </div>
      <div>
        <div class="t">
          {{ $t('home.cookieProtocolTip1') }} 
          <a class="privacy" href="/legal/privacy-policy" target="_blank">{{$t('login.footerPrivacyPolice')}}</a>.
          {{ $t('home.cookieProtocolTip2') }}
        </div>
        <!-- <div class="t d">{{ $t('home.cookieProtocolTip2') }}</div> -->
      </div>
      <div class="right">
        <button id="cookieProtocol-btn-decline" class="btn" @click="tracking('0')">
          {{ $t('home.cookieProtocolDecline') }}
        </button>
        <button id="cookieProtocol-btn-allow" class="btn allow" @click="tracking('1')">
          {{ $t('home.cookieProtocolAllow') }}
        </button>
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
    margin: 0 16px 0 0;
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: #5548FF;
    .icon-flag-05 {
      color: #fff;
    }
  }
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0 0 24px;
    min-width: 200px;
    .btn {
      cursor: pointer;
      padding: 10px 16px;
      border-radius: 8px;
      background: #fff;
      color: #443ACC;
      padding: 10px 16px;
    }
    .allow {
      margin-left: 12px;
      background: #5548FF;
      color: #fff;
      margin-right: 12px;
    }
    .icon-x-close {
      cursor: pointer;
      margin-left: 18px;
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
  padding: 16px 48px 16px 16px;
  border: 1px solid #776CFF;
  border-radius: 12px;
  .btn {
    margin-top: 24px;
    cursor: pointer;
    padding: 10px 16px;
    border-radius: 8px;
    background: #fff;
    color: #443ACC;
    width: calc(100% + 32px);
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