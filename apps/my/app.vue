<script setup name="home">
import Flylinking from '@/assets/imgs/64x64.icon.ico'
import AccountDisable from '@/components/AccountDisable';
import { ElConfigProvider } from 'element-plus'
import ZH_CN from 'element-plus/es/locale/lang/zh-cn'
import EN from 'element-plus/es/locale/lang/en'

const { $locale } = useNuxtApp()
const lang = computed(() => {
  return $locale.value === 'zh-CN' ? ZH_CN : EN
})
const isRTL = computed(() => {
  return ['ar', 'he-IL'].includes($locale.value)
})

useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-YYQGCQP27X',
      async: true
    },
    {
      innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YYQGCQP27X');`,
      type: 'text/javascript'
    },
    {
      innerHTML: `
        !(function(c,b,d,a){c[a]||(c[a]={});c[a].config=
          {
            pid:"f0jreo6m1b@00c8ef0426a5240",
            appType:"web",
            imgUrl:"https://retcode-us-west-1.arms.aliyuncs.com/r.png?",
            sendResource:true,
            enableLinkTrace:true,
            behavior:true
          };
        with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d)
        })(window,document,"https://sdk.rum.aliyuncs.com/v1/bl.js","__bl");`,
      type: 'text/javascript',
      body: true
    },
  ],
  __dangerouslyDisableSanitizers: ['script']
})
</script>
<template>
  <Head>
    <Link rel="icon" :href="Flylinking" sizes="64x64" />
    <Link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/c/font_4655796_4ybzqfy5mci.css" />
    <Meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <title>FlyLinking</title>
  </Head>
  <div>
    <noscript>
      You have to enable JavaScript to view this page.
    </noscript>
    <el-config-provider :locale="lang" :rtl="isRTL">
      <NuxtLayout>
        <NuxtPage />
        <!-- <AccountDisable :key="$locale" /> -->
      </NuxtLayout>
    </el-config-provider>
  </div>
</template>
