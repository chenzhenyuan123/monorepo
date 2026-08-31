import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  {
    name: 'flylinking/ignore',
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/dist/**',
      '**/.output*/**',
      '**/coverage/**',
      '**/*.md',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    name: 'flylinking/vue-overrides',
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        // Vue 3 Composition API 常见全局 API（项目通过 auto-import 使用）
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        onUpdated: 'readonly',
        onBeforeMount: 'readonly',
        onBeforeUnmount: 'readonly',
        onBeforeUpdate: 'readonly',
        provide: 'readonly',
        inject: 'readonly',
        nextTick: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        defineOptions: 'readonly',
        defineModel: 'readonly',
        withDefaults: 'readonly',
        definePageMeta: 'readonly',
        // Nuxt 3 常见 auto-import composables
        useIsMobile: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useI18n: 'readonly',
        useHead: 'readonly',
        useAsyncData: 'readonly',
        useFetch: 'readonly',
        useState: 'readonly',
        useAppConfig: 'readonly',
        useRuntimeConfig: 'readonly',
        useNuxtApp: 'readonly',
        useLocalePath: 'readonly',
        useLocaleHead: 'readonly',
        useSwitchLocalePath: 'readonly',
        useLocales: 'readonly',
        navigateTo: 'readonly',
      },
    },
    rules: {
      // 组件命名 / 代码风格约束（格式类交由 Prettier 处理）
      'vue/multi-word-component-names': ['warn', { ignores: ['App', 'NuxtRoot', 'Index'] }],
      'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
      'vue/html-self-closing': ['warn', {
        html: { void: 'always', normal: 'never', component: 'always' },
        svg: 'always',
        math: 'always',
      }],
      'vue/no-unused-vars': 'warn',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'off',
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },
  // 最后接入：关闭所有与 Prettier 冲突的格式规则，Prettier 独占格式化
  prettier,
]
