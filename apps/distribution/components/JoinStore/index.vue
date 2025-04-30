<!--
 * @Author: czy
 * @Description: 加入店铺-弹窗
-->
<script setup>
import { Warning, Check } from '@element-plus/icons-vue';
import { checkResponseData, currencyFormat } from "@/util/index.js";
const { joinApi } = useApi();
import key from '../svg/key.svg'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const attrs = useAttrs()
const emit = defineEmits(['joinSave'])
const close = () => {
  const fn = attrs['onUpdate:modelValue']
  fn && fn(false)
}
const loading = ref(false)
const showError = ref(false)
const showJoin = ref(false)
const codeStr = ref('')
const storeInfo = ref({})
const showJoinCheck = ref(false)
// 提交
const submit = async(type) => {
  if(!codeStr.value) {
    showError.value = true
    return
  }
  loading.value = true
  // type === 'confirm'为查询，join为加入
  if(type === 'confirm' && codeStr.value) {
    let storeId = codeStr.value
    if(codeStr.value.includes('/join?store=')) {
      const arr = codeStr.value.split('/join?store=')
      storeId = arr[arr.length - 1]
    }
    const result = await joinApi.getStoreDistributionSettings({storeId})
    const res = checkResponseData(result)
    if(res) {
      storeInfo.value = res
      showJoin.value = true
    } else {
      showError.value = true
    }
    loading.value = false
  }
  if(type === 'join' && storeInfo.value.storeId) {
    const result = await joinApi.joinStore({storeId: storeInfo.value.storeId})
    const res = checkResponseData(result, 'NO_RETURN_DATA')
    if(res) {
      showJoinCheck.value = true
      setTimeout(() => {
        close()
        emit('joinSave')
      }, 3000)
    }
    loading.value = false
  }
}
</script>

<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      width="400px"
      class="dialog-box join-dialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="dialog-content">
        <div class="join-header">
          <div class="circle-box">
            <div class="circle-box1">
              <div class="circle-box2">
                <div class="circle-box3">
                  <div class="circle-box4"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="key-icon">
            <img :src="key" />
          </div>
        </div>
        <h3 class="title">{{$t('products.productsJoin')}}</h3>
        <template v-if="!showJoin">
          <p class="text">{{$t('products.productsContactCode')}}</p>
          <el-form  label-position="top" class="join-form" novalidate>
            <el-form-item :label="$t('products.productsInvitationCode')">
              <el-input v-model="codeStr" :placeholder="$t('products.productsInvitationCodeHere')" @input="showError=false" clearable :class="{'error':showError}" :suffix-icon="showError? Warning : ''" />
              <span v-if="showError && codeStr" class="error-color">
                {{$t('products.productsInvitationCodeError')}}
              </span>
              <span v-if="showError && !codeStr" class="error-color">
                {{$t('products.productsInvitationRequired')}}
              </span>
            </el-form-item>
          </el-form>
        </template>
        <!-- 查询到店铺后展示 -->
        <template v-else>
          <p class="text">{{$t('products.productsJoinTip1', {storeName: storeInfo.storeName})}}</p>
          <p class="text margin-top20 margin-bottom20">
            {{$t('products.productsJoinTip3')}}
            <b class="direction-ltr direction-inline-block"> {{(storeInfo.storeCommissionRate ? currencyFormat(storeInfo.storeCommissionRate * 100) : 0)}}% </b>
            {{$t('products.productsJoinTip4')}}
          </p>
        </template>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <template v-if="!showJoin">
            <el-button @click="close()">{{$t('products.productsJoinCancel')}}</el-button>
            <el-button :loading="loading" type="primary" id="products-btn-confirm" @click="submit('confirm')">{{$t('products.productsJoinConfirm')}}</el-button>
          </template>
          <!-- 查询到店铺后展示 -->
          <template v-else>
            <el-button @click="showJoin=false">{{$t('email-sent.emailSentBack')}}</el-button>
            <el-button v-if="!showJoinCheck" :loading="loading" type="primary" id="products-btn-join" @click="submit('join')">
              {{ $t('join.joinSaveButton') }}
            </el-button>
            <el-button v-else type="primary" id="products-btn-join" :icon="Check">
              {{$t('products.productsJoined')}}
            </el-button>
          </template>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import url('./style.scss')
</style>
