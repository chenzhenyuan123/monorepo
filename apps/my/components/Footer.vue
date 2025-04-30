<!--
 * @Author: czy
 * @Description: 公共底部
-->
<script setup name="Footer">
const isMobile = useIsMobile()
const date = new Date();
const year = date.getFullYear();
</script>
<template>
  <div class="footer-box" :class="{ m: isMobile }">
    <div class="margin-top16 left-box">@ {{year}} {{$t('login.footeRightsReserved')}}</div>
    <div class="right-box">
      <div class="margin-top16 margin-right16 left-box"><a href="/legal/privacy-policy" target="_blank">{{$t('login.footerPrivacyPolice')}}</a></div>
      <div class="margin-top16 right-box"><a href="/legal/terms-of-usage" target="_blank">{{$t('login.footeTermOfUse')}}</a></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer-box {
  width: 100%;
  border-top: 1px solid #E4E7EC;
  padding-top: 26px;
  overflow: hidden;
  padding-bottom: 56px;
  a {
    display: block;
    text-decoration: none;
    color: #667085;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
  .left-box {
    float: left;
    color: #667085;
    font-size: 14px;
  }
  .right-box {
    float: right;
    text-align: right;
    .margin-right16 {
      margin-right: 16px;
    }
  }
  &.m {
    border-top: 0;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 40px;
    font-size: 12px;
    line-height: 18px;
    padding-top: 0;
    .margin-top16 {
      margin-top: 16px;
    }
    .left-box, .right-box {
      float: none;
    }
    .margin-right16 {
      margin-right: 0;
    }
  }
}
</style>