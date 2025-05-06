<!--
 * @Author: czy
 * @Description: 下拉框使用Layer组件兼容PC和移动端
-->
<script setup>
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  isShowStoreSearch: {
    type: Boolean,
    default: false
  },
  data: {
    type: String,
    default: ''
  }
})

const storeId = ref('')
const storeSearch = ref('')
const storeData = ref([{
  code: '9FUWPFZLKK',
  label: 'linlianjun'
}, {
  code: '9FUWPFZ234',
  label: 'ymt'
}, {
  code: '9FUWPFZ234',
  label: 'ymt'
}, {
  code: '9FUWPFZ234',
  label: 'ymt'
}, {
  code: '9FUWPFZ234',
  label: 'ymt'
}, {
  code: '9FUWPFZ234',
  label: 'ymt'
}, {
  code: '9FUWPFZ234',
  label: 'ymt'
}, {
  code: '9FUWPFZ234',
  label: 'ymt'
}, {
  code: '9FUWPFZ234',
  label: 'ymt'
}])

const filterByStrList = computed(() => {
  return storeData.value.filter(item => {
    return item.code.toLowerCase().includes(storeSearch.value.toLowerCase()) || item.label.toLowerCase().includes(storeSearch.value.toLowerCase())
  })
})

const layerRef = ref(null)

const emit = defineEmits(["change","hide"])

const hide = () => {
  layerRef.value.hide()
  emit('hide')
}

const checkStore = obj => {
  if (obj.code === storeId.value) return

  storeId.value = obj.code
  emit('change', storeId.value)
}

onMounted(() => {
  storeSearch.value = ''
  storeId.value = props.data || ''
  layerRef.value.show()
});

onBeforeUnmount(() => {
});

</script>

<template>
  <Layer ref="layerRef" title="" class="layer">
    <div class="content">
      <h3 class="h3">View products by store</h3>
      <div class="search-container">
        <el-input v-model="storeSearch" id="home-btn-Store-Search" :prefix-icon="Search" :placeholder="$t('home.homeSearch')" clearable />
      </div>
      <ul class="store-list">
        <li
          v-for="item in filterByStrList"
          :key="item.code"
          :class="{ 'currency-item': true, 'active': item.code === storeId }"
          @click="checkStore(item)"
        >
          <span class="span">{{ item.label }}（{{ item.code }}）</span>
          <div class="center"></div>
          <div class="check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1872 3.75739C14.4801 4.05028 14.4801 4.52516 14.1872 4.81805L6.76256 12.2427C6.46966 12.5356 5.99479 12.5356 5.7019 12.2427L1.81281 8.35358C1.51992 8.06069 1.51992 7.58582 1.81281 7.29292C2.1057 7.00003 2.58058 7.00003 2.87347 7.29292L6.23223 10.6517L13.1265 3.75739C13.4194 3.4645 13.8943 3.4645 14.1872 3.75739Z" fill="#3369FF"/>
            </svg>
          </div>
        </li>
      </ul>
    </div>
  </Layer>
</template>

<style lang="scss" scoped>

* {
  box-sizing: border-box;
}

.layer {
  :deep(.layer-body) {
    background: #FFF;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.10), 0px 4px 20px 0px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    &.init-animation {
      animation: none;
    }
    .layer-body-title {
    padding-left: 12px;
    padding-right: 12px;
    }
    .layer-body-bottom-button {
      display: none;
    }
  }
  &.is-pc {
    :deep(.layer-body) {
      width: 280px;
      top: 50px;
      right: 0;
      border-radius: 12px;
    }
  }
}

.content {
  overflow: hidden;
}
.h1 {
  padding: 16px 12px;
  color: #222;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
}
.h2 {
  display: flex;
  align-items: center;
  padding: 16px 12px;
  border-top: 1px solid #E5E5E5;
  .label {
    color: #424552;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
    margin-right: 4px;
  }
  .value {
    color: #222;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 142.857% */
  }
}
.h3 {
  padding: 16px 12px 0;
  border-top: 1px solid #E5E5E5;
  color: #686A6C;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
}
.search-container {
  padding: 8px 14px;
  :deep(.el-input__inner) {
    /*height: 36px;*/
    height: 34px;
  }
}
.store-list {
  padding: 0 6px;
  max-height: 350px;
  overflow-y: auto;
}
.currency-item {
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    border-radius: 6px;
    background: #F5F7FA;
  }
  &.active {
    cursor: default;
    .span {
      color: #3369FF;
    }
    .check {
      display: block;
    }
  }
  .center {
    flex: 1;
  }
  .img {
    width: 19.6px;
    height: 14px;
    border: 0.7px solid #E5E5E5;
    border-radius: 1px;
    overflow: hidden;
    margin: 0 10px 0 2px;
  }
  .span {
    color: #222;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 19.6px; /* 140% */
  }
  .check {
    display: none;
  }
}

</style>
