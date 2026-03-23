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
    {
      innerHTML: `
      (function () {
        window._fmOpt = {
          partner: "Camel",
          success: function (data) {
            data && sessionStorage.setItem("blackBox", data);
          },
        };
        var fm = document.createElement("script");
        fm.type = "text/javascript";
        fm.async = true;
        fm.src =
          "https://static.trustdecision.com/tdfp/us/cc2ab7c6ae66eb02190b5f8389b91bd3/fm.js" +
          "?t=" +
          (new Date().getTime() / 3600000).toFixed(0);
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(fm, s);
      })();`,
      type: 'text/javascript',
      body: true
    },
    {
      innerHTML: `
          function _howxm(){_howxmQueue.push(arguments)}
          window._howxmQueue=window._howxmQueue||[];
          _howxm('setAppID','f2afcc13-1350-4ff1-8509-7694359ba245');
          (function(){var scriptId='howxm_script';
          if(!document.getElementById(scriptId)){
          var e=document.createElement('script'),
          t=document.getElementsByTagName('script')[0];
          e.setAttribute('id',scriptId);
          e.type='text/javascript';e.async=!0;
          e.src='https://static.howxm.com/sdk.js';
          t.parentNode.insertBefore(e,t)}})();`,
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
        <!-- <AccountDisable :key="$locale" /> -->
      </NuxtLayout>
    </el-config-provider>
  </div>
</template>
