<!--
 * @Author: czy
 * @Description: 根据店铺搜索商品
-->
<script setup name="StoreListSearch">
import { Search } from '@element-plus/icons-vue'
import { checkResponseData, arrToDict, errorMessage } from "@/util/index.js";
const { clientApi } = useApi()

const isMobile = useIsMobile()

const storeId = ref('')
const storeSearch = ref('')
const storeData = ref([])

const filterByStrList = computed(() => {
  return storeData.value.filter(item => {
    return item.storeId.toLowerCase().includes(storeSearch.value.toLowerCase()) || item.storeName.toLowerCase().includes(storeSearch.value.toLowerCase())
  })
})
onMounted(() => {
  getInviteData()
})

// 邀请店铺下拉列表
const getInviteData = async() => {
    const result = await clientApi.bind_listStoresToInvite()
    const res = checkResponseData(result)
    if (res) {
      storeData.value = res?.bindingStoreList || []
      if(res?.bindingStoreList) {
        storeId.value = res?.bindingStoreList[0]?.storeId
        emit('change', storeId.value)
      }
    }
}

const emit = defineEmits(["change","hide"])
const checkStore = val => {
  if(val) {
    const obj = storeData.value.find(item => item.storeId === val)
    storeId.value = obj.storeId
  } else {
    storeId.value = ''
  }
  emit('change', storeId.value)
}
const isShowStoreSearch = ref(false)
const toggleDropdown = (visible) => {
  if(visible==='blur') {
    selectRef.value.blur()
    return
  }
  isShowStoreSearch.value = visible
  storeSearch.value = ''
};
const selectRef = ref(null)

</script>

<template>
  <div class="home-btn-Store-box" :class="{ 'm': isMobile, 'home-btn-Store-active': isShowStoreSearch }">
    <el-select
      ref="selectRef"
      v-model="storeId"
      :placeholder="$t('home.homeStoreSearch')"
      :popper-class="isMobile ? 'home-btn-Store-box-select m' : 'home-btn-Store-box-select'"
      id="home-btn-Store-Search"
      placement="bottom-end"
      @change="checkStore"
      @visible-change="toggleDropdown"
    >
      <template #header>
        <div v-if="isMobile" class="header">
          <p>{{$t('home.homeStoreSearch')}}</p>
          <div class="close" @click="toggleDropdown('blur')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="#98A2B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <el-input v-model="storeSearch" id="home-btn-Store-Search" :prefix-icon="Search" :placeholder="$t('home.homeSearch')" clearable />
      </template>
      <el-option
        v-for="item in filterByStrList"
        :key="item.storeId"
        :label="`${item.storeName} (${item.storeId})`"
        :value="item.storeId"
      >
        <OverflowTip :content="`${item.storeName}（${item.storeId}）`">
          <b>{{ item.storeName }}</b>
          <label>（{{ item.storeId }}）</label>
        </OverflowTip>
        <span class="check">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="#5548FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </span>
      </el-option>
    </el-select>
  </div>
</template>

<style lang="scss">
.el-popper.home-btn-Store-box-select {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  .el-select-dropdown__wrap {
    max-height: 280px;
  }
  .el-select-dropdown__item {
    height: 44px;
    margin: 0 6px;
    padding: 0;
    background: #fff;
    display: flex;
    justify-content: space-between;
    &.is-selected, &.is-hovered {
      background: #fff;
      .check{
        display: block;
      }
      background: #F2F4F7;
      border-radius: 6px;
    }
    .check {
      text-align: right;
      display: none;
      margin-top: 10px;
      margin-right: 10px;
    }
    .text {
      line-height: 44px;
      padding: 0 8px;
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      b{
        font-size: 16px;
        color: #101828;
        font-family: Inter;
        font-weight: 600;
      }
      label {
        color:  #475467;
        font-family: Inter;
        font-size: 16px;
        font-weight: normal;
        cursor: pointer;
      }
    }
  }
  .el-popper__arrow {
    display: none;
  }
  .el-select-dropdown__header{
    padding: 12px 16px;
    background: #fff;
    border-radius: 8px 8px 0 0;
    .el-input__wrapper {
      border-radius: 8px;
      border: 1px solid #D0D5DD;
      background:#FFF;
      box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      padding: 2px 14px;
      color: #101828;
      font-size: 16px;
      font-weight: 600;
    }
    .header {
      margin-bottom: 32px;
      position: relative;
      display: flex;
      justify-content: space-between;
      p {
        color: #101828;
        font-family: Inter;
        font-size: 18px;
        font-weight: 600;
        line-height: 28px;
      }
      .close {
        margin-top: 3px;
      }
    }
  }

  &.m{
    position: fixed !important;
    top: 0px !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding-top: 64px;
    background: rgba(0,0,0,0.7);
    border-radius: 0;
    .el-select-dropdown__wrap {
      max-height: 100%;
    }
    .el-scrollbar {
      height: calc(100vh - 185px);
      overflow-y: auto;
      background: #fff;
    }
    .el-select-dropdown__item {
      margin: 0 12px;
      .text{
        max-width: calc(100% - 30px);
      }
    }
  }
}
</style>
<style scoped lang="scss">
.home-btn-Store-box {
  width: 213px;
  :deep(.el-select) {
    .el-select__wrapper {
      height: 40px;
      padding: 10px 14px;
      border: 1px solid #D0D5DD;
      background: #FFF;
      box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      color: #344054;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      margin-top: 2px;
      .el-select__placeholder {
        color: #344054;
        font-family: Inter;
        font-size: 14px;
        font-weight: 600;
      }
    }
    .el-select__suffix {
      .el-icon {
        font-size: 16px;
        color: #344054;
      }
    }
  }
      
  &.home-btn-Store-active {
    :deep(.el-select) {
      .el-select__wrapper {
        border-radius: 8px;
        border: 1px solid #D0D5DD;
        background: #FFF;
        box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 2px #FFF, 0px 0px 0px 4px #776CFF;
      }
    }
  }
  &.m {
    margin-bottom: 12px;
  }
}
</style>