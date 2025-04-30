<!--
 * @Author: czy
 * @Description: 404页面
-->
<script setup name="NotFound404">

definePageMeta({
  layout: 'noside'
});

const isMobile = useIsMobile()
</script>

<template>
  <div class="notFound-box" :class="{ m: isMobile }">
    <img src="~@/assets/imgs/404.svg" alt="404" />
    <div class="notFound-content">
      <h1>{{$t('NotFound404.NotFound404PageLost')}}</h1>
      <p>{{$t('NotFound404.NotFound404PageMove')}}</p>
      <NuxtLink to="/home" class="a-text" id="NotFound404-btn-gohome">{{$t('NotFound404.NotFound404GoHome')}}</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notFound-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  img, .notFound-content{
    max-width: 100%;
  }
  .notFound-content {
    position: absolute;
    text-align: center;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    h1 {
      color: #101828;
      text-align: center;
      font-size: 60px;
      font-weight: 600;
      line-height: 72px;
      letter-spacing: -1.2px;
    }
    p {
      color: #475467;
      text-align: center;
      font-size: 20px;
      line-height: 30px;
      margin: 24px 0 48px;
    }
    .a-text {
      display: block;
      min-width: 88px;
      max-width: 120px;
      height: 28px;
      padding: 16px 22px;
      border-radius: 10px;
      border: 2px solid rgba(255, 255, 255, 0.12);
      background: #5548FF;
      box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      color: #FFF;
      font-size:  18px;
      font-weight: 600;
      line-height: 28px;
      text-decoration: none;
      margin: 0 auto;
    }
  }
}
.m.notFound-box {
  width: calc(100% - 16px);
  margin: 0 auto;
}
</style>