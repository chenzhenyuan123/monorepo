<script setup>
import { useI18n } from "vue-i18n";
import { ClickOutside as vClickOutside } from 'element-plus';
import { queryStringify, parseQuery } from '@/util/router.js'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
// import locale from 'element-plus/lib/locale'
const isMobile = useIsMobile()
const props = defineProps({
  width: {
    type: String,
    default: '400'
  }
})
const { t, locale } = useI18n();
const langVisible = ref(false);
const langs = {
  'en-US': "English",
  // 'es-ES': 'español',
  'fr-FR': 'Français',
  'zh-CN': '中文',
  'de-DE': 'Deutsch',
  'pt-PT': 'português',
  ar: 'العربية',
  'ru-RU': 'Русский',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'vi-VN': 'Tiếng Việt',
  'it-IT': 'Italiano',
  'he-IL': 'היברית',
};

// flex布局是横向递增换行的，UI效果是纵向递增成2列的，所以需要手动排序
const sortedLangs = (() => {
  const arr = []
  const keys = Object.keys(langs)
  const n = Math.ceil(keys.length / 2)
  for (let i = 0; i < n; i++) {
    arr.push(keys[i])
    if (i + n < keys.length) {
      arr.push(keys[i + n])
    }
  }
  return arr
})();

const isRTL = useState('isRTL', () => {
  return false
})

const langItemClick = (lang) => {
  setLangCondition(lang);
  closeLang();
};

const setLangCondition = (lang) => {
  locale.value = lang;
  localStorage.setItem("language", locale.value);

    if (['ar', 'he-IL'].includes(lang)) {
      document.documentElement.classList.add('rtl')
      document.documentElement.classList.remove('ltr')
      isRTL.value = true
    } else {
      document.documentElement.classList.add('ltr')
      document.documentElement.classList.remove('rtl')
      isRTL.value = false
    }

    const Q = parseQuery()
  if (Q.lang) {
    // 若url中lang有值，则替换
    Q.lang = lang
    queryStringify(Q)
  }
};

const closeLang = () => {
  langVisible.value = false;
};

const showLang = () => {
  langVisible.value = true;
};

const toggleLang = () => {
  langVisible.value = !langVisible.value;
};

const emit = defineEmits(["langLoaded"])
const initLang = () => {
  /**
   * 规则：url传参 > 本地 > 浏览器语言 > en-US
   */
  const Q = parseQuery()
  // 默认语种（列表，以优先级排序）
  const localLangArr = [mapLanguage(Q.lang), localStorage.getItem("language"), mapLanguage(navigator.language || navigator.userLanguage)];
  let localLang = "en-US";
  // 考虑到可能会删除语种配置，取值有踏空风险
  localLangArr.some(item => {
    if (langs[item]) {
      localLang = item
      return true
    }
  })
  setLangCondition(localLang);
  nextTick(() => {
    emit('langLoaded', true)
  })
};
const mapLanguage = (langStr) => {
  if (!langStr) return
  let str = langStr.replace(/-|_/g, '-')
  if (str.length === 2) {
    str = str.toLowerCase()
  }
  return Object.keys(langs).find(key => key.startsWith(str))
}

const isDown = ref(false)
onMounted(() => {
  initLang();
});
</script>

<template>
  <div class="lang" :class="{ m: isMobile }">
    <el-popover
      :visible="langVisible"
      placement="bottom"
      :width="width ? width : 160"
      :show-arrow="false"
      trigger="click"
      :popper-class="isMobile ? 'lang-popover-m' : 'lang-popover'"
      @show="isDown=true"
      @hide="isDown=false"
    >
      <template #reference>
        <div class="switch-lang" @click="showLang" v-click-outside="closeLang">
          <img src="~@/assets/imgs/global.svg" />
          <span class="lang-name">{{ langs[locale] === 'English' ? 'EN' : langs[locale] }}</span>
          <span class="lang-arrow">
            <el-icon><ArrowDown v-if="!isDown" /><ArrowUp v-else /></el-icon>
          </span>
        </div>
      </template>
      <div>
        <div class="lang-item-title">{{ t('login.selectLanguage') }}</div>
        <div class="lang-content">
          <div v-for="lang in sortedLangs" :key="lang" class="lang-item">
            <div class="lang-item-inner" :class="{active: lang === locale}" @click="langItemClick(lang)">
              <span>{{ langs[lang] }} - {{ lang.split('-')[0].toUpperCase() }}</span>
              <span class="lang-checked">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4138 3.28743C12.6701 3.54371 12.6701 3.95922 12.4138 4.2155L5.91728 10.712C5.661 10.9683 5.24549 10.9683 4.98921 10.712L1.58625 7.3091C1.32997 7.05281 1.32997 6.6373 1.58625 6.38102C1.84254 6.12474 2.25805 6.12474 2.51433 6.38102L5.45324 9.31993L11.4857 3.28743C11.742 3.03114 12.1575 3.03114 12.4138 3.28743Z" fill="currentColor"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss">
  .el-popover.el-popper.lang-popover {
    padding: 0 !important;
  }
  .el-popover.el-popper.lang-popover-m {
    position: fixed !important;
    /*border-radius: 0 0 8px 8px !important;*/
    /*transform: translate3d(0px, 50px, 0px) !important;*/
    padding: 0 !important;
    /*inset: 0 auto auto 0 !important;*/
    /*top: 0px !important;*/
    right: auto !important;
    /*bottom: auto !important;*/
    left: 0 !important;
    border-top: none !important;
    /*box-shadow: 0px 5px 4px 0px rgba(0, 0, 0, 0.1) !important;*/
    width: 100% !important;
    max-width: 100% !important;
  }
</style>

<style lang="scss" scoped>
  * {
    box-sizing: border-box;
  }
.lang {
  // margin-right: 24px;
  .switch-lang {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #D0D5DD;
    .el-icon {
      color: #424552;
    }
  }

  .lang-name {
    padding: 0 6px;
    font-size: 16px;
    color: #344054;
    font-weight: 600;
  }
}

.m .lang {
  .switch-lang {
    padding: 10px 16px;
  }
  .lang-arrow {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}

.lang-item-title{
  display: flex;
  align-items: center;
  height: 44px;
  color: #101828;
  font-weight: 600;
  line-height: 1.4;
  padding: 0 14px;
  border-bottom: 1px solid #E4E7ED;
}
.lang-content{
  padding: 4px 0;
  display: flex;
  flex-wrap: wrap;
  direction: ltr !important;
}

.lang-item {
  width: 50%;
  padding: 1px 6px;
  box-sizing: border-box;
  .lang-item-inner{
    padding: 10px 8px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    position: relative;
    .lang-checked{
      position: absolute;
      display: none;
      top: 12px;
      right: 10px;
      color: #3369FF;
      .rtl & {
        left: 10px;
        right: auto;
      }
    }
    &:hover, &.active {
      background-color: #F2F4F7;
    }
    &.active {
      .lang-checked {
        display: initial;
        line-height: 1;
        svg{
          display: block;
        }
      }
    }
  }

  img {
    width: 20px;
    display: block;
  }



  .flag {
    margin-right: 8px;
    margin-left: 12px
  }
}
</style>
