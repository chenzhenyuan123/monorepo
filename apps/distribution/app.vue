<script setup name="home">
import Flylinking from '@/assets/imgs/64x64.icon.ico'
import AccountDisable from '@/components/AccountDisable';
import { ElConfigProvider } from 'element-plus'
import ZH_CN from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import es from 'element-plus/es/locale/lang/es'
import fr from 'element-plus/es/locale/lang/fr'
import de from 'element-plus/es/locale/lang/de'
import pt from 'element-plus/es/locale/lang/pt'
import ar from 'element-plus/es/locale/lang/ar'
import ru from 'element-plus/es/locale/lang/ru'
import ja from 'element-plus/es/locale/lang/ja'
import ko from 'element-plus/es/locale/lang/ko'
import vi from 'element-plus/es/locale/lang/vi'
import it from 'element-plus/es/locale/lang/it'
import he from 'element-plus/es/locale/lang/he'

const { $locale } = useNuxtApp()

const langs = {
  'en-US': en,
  'es-ES': es,
  'fr-FR': fr,
  'zh-CN': ZH_CN,
  'de-DE': de,
  'pt-PT': pt,
  'ar': ar,
  'ru-RU': ru,
  'ja-JP': ja,
  'ko-KR': ko,
  'vi-VN': vi,
  'it-IT': it,
  'he-IL': he,
};
const lang = computed(() => {
  const elLang = langs[$locale.value]
  return elLang ? elLang : en
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
    <Link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/c/font_4655796_hsbgmyd9mit.css" />
    <Meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <title>FlyLinking</title>
  </Head>
  <div>
    <noscript>
      You have to enable JavaScript to view this page.
    </noscript>
    <el-config-provider :locale="lang">
      <NuxtLayout>
        <NuxtPage />
        <!-- <AccountDisable /> -->
      </NuxtLayout>
    </el-config-provider>
  </div>
</template>
