<script setup>
import { checkResponseData, accurate_add, arrToDict } from "@/util/index.js"
import { formatDate } from "@/util/dateUtil.js"
import { currencyFormat, formatCreditCardNumber } from "@/util/dataUtil.js"
import { Right } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/settingState.js'
import { useI18n } from "vue-i18n";
import visa from "@/assets/imgs/card-icon/visa.svg";
import master from "@/assets/imgs/card-icon/master.svg";
import hipercardIcon from "@/assets/imgs/card-icon/hipercard.svg";
import discover from "@/assets/imgs/card-icon/discover.svg";
import dinerClub from "@/assets/imgs/card-icon/dinerClub.svg";
import AMEXIcon from "@/assets/imgs/card-icon/AMEX.svg";
import eloIcon from "@/assets/imgs/card-icon/elo.svg";
import ibanIcon from "@/assets/imgs/card-icon/iban.svg";
import emptyIcon from "@/assets/imgs/card-icon/empty.svg";
import {
//   isValidZipcode,
    isVisaCard,
    isMasterCard,
    isHipercard,
    isDiscover,
    isDinerClub,
    isAmex,
    isElo,
    isIBAN,
} from "@/util/validate";
import { Message } from '@flylinking/ui'
import {flagUrl} from "@flylinking/core/utils/dataUtil";

const { t } = useI18n();
const { userApi, withdrawApi, countryApi } = useApi()
const settingStore = useSettingStore()
const router = useRouter()
const route = useRoute()
const isMobile = useIsMobile()
const isShowAccountTypeDialog = ref(false)
const form = reactive({
    withdrawType: 'Bank_Account',
    openingBankCountry: undefined,
    accountCurrency: undefined,
    applyAmt: undefined,
    withdrawCurrency: undefined,
    accountType: 'saving',
    accountHolderType: undefined,
    accountName: undefined,
    // 固定部分
    openingBankCity: undefined,
    openingBankAddress: undefined,
    bankState: undefined,
    zip: undefined,
    // 储蓄账户部分
    //
    bankName: undefined,
    accountNumber: '',
    routingNumber: undefined,
    swiftCode: undefined,
    bankCode: undefined,
    branchBankCode: undefined,
    // PayPal部分
    //
    birthDate: undefined,
    paypalAccount: undefined,
})
const membershipFeeDiff = computed(() => {
    return form.v0WithdrawFee ? (accurate_add(form.v0WithdrawFee, -form.receivableFee) || 0) : 0
})
const couponFeeDiff = computed(() => {
    return accurate_add(form.receivableFee, -form.withdrawFee) || 0
})
const actualWithdrawAmount = computed(() => {
    return accurate_add(form.applyAmt, -form.withdrawFee) || 0
})


// 是否账户币种为USD
const isBankAccount = computed(() => {
    return form.withdrawType === 'Bank_Account'
})
// 是否展示账户类型，提现方式=银行账户，到账币种=USD，且账户所在国=美国
const isShowAccountType = computed(() => {
    return isBankAccount.value && form.withdrawCurrency === 'USD' && form.openingBankCountry === 'US'
})
// 是否展示Routing Number，提现方式=银行账户，且账户所在地选择美国，且到账币种=USD时展示
const isShowRoutingNumber = computed(() => {
    return isBankAccount.value && form.withdrawCurrency === 'USD' && form.openingBankCountry === 'US'
})
// 是否展示银行代码，提现方式=银行账户，且账户所在国是以色列，英国时展示且必填
const isShowBankCode = computed(() => {
    return isBankAccount.value && (form.openingBankCountry === 'IL' || form.openingBankCountry === 'UK')
})
// 是否展示分行代码，提现方式=银行账户，且账户所在国是孟加拉时，展示且必填
const isShowBranchBankCode = computed(() => {
    return isBankAccount.value && form.openingBankCountry === 'BD'
})
// 账户持有人类型，账户所在国是以色列，孟加拉，沙特时，默认选中个人，不能修改
const isSpecialForAccountHolderType = computed(() => {
    return form.openingBankCountry === 'IL' || form.openingBankCountry === 'BD' || form.openingBankCountry === 'SA'
})
// 账户持有人类型，当账户类型=paypal时，【个人】被选中且不可修改
const isMustIndividualForAccountHolderType = computed(() => {
    return !isBankAccount.value || isSpecialForAccountHolderType.value
})
const isDeffCurrency = computed(() => {
    return form.accountCurrency !== form.withdrawCurrency
})


const statusData = computed(() => {
  return [
    { value: 'WITHDRAWING', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'WITHDRAW_ACCEPT_FAIL', label: t('wallet.dataWithdrawStatusFailed'), type: 'danger' },
    { value: 'WITHDRAW_ACCEPT_SUCCESS', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUING', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUE_ACCEPT_FAIL', label: t('wallet.dataWithdrawStatusFailed'), type: 'danger' },
    { value: 'ISSUE_ACCEPT_SUCCESS', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUE_SUCCESS', label: t('wallet.dataWithdrawStatusSuccess'), type: 'success' },
    { value: 'ISSUE_FAIL', label: t('wallet.dataWithdrawStatusFailed'), type: 'danger' },
    { value: 'ISSUE_SUCCESS_RETURN', label: t('wallet.dataWithdrawStatusFailed'), type: 'danger' },
  ]
})
// const statusToType = computed(() => {
//   return arrToDict(statusData.value, { label: 'type' })
// })
const statusType = computed(() => {
  return statusData.value.find(item => {
    return item.value === form.status
  })?.type
})
const cardIcon = computed(() => {
    const cardNum = form.accountNumber
    if (isVisaCard(cardNum)) {
        return visa
    } else if (isMasterCard(cardNum)) {
        return master
    } else if (isHipercard(cardNum)) {
        return hipercardIcon
    } else if (isDiscover(cardNum)) {
        return discover
    } else if (isDinerClub(cardNum)) {
        return dinerClub
    } else if (isAmex(cardNum)) {
        return AMEXIcon
    } else if (isElo(cardNum)) {
        return eloIcon
    } else if (isIBAN(cardNum)) {
        return ibanIcon
    }
    return emptyIcon
});


const countryData = ref([])
// const countryDataByLang = computed(() => {
//     const key = locale.value === 'zh-CN' ? 'zhCn' : 'enUs'
//     return countryData.value.map(item => {
//         return { ...item, name: item[key] }
//     })
// })
const countryToName = ref({})
const currencyToCountryId = ref({})
// 获取所有国家列表
function getAllCountry() {
    countryApi.getAllCountry().then(result => {
        const res = checkResponseData(result)
        if (res) {
            // 展示所有国家列表，去除中国大陆
            countryData.value = res.filter(item => item.countryId !== 'CN')
            countryToName.value = arrToDict(countryData.value, { value: 'countryId', label: 'name' })
            currencyToCountryId.value = arrToDict(countryData.value, { value: 'currency', label: 'countryId' })
        }
    })
}

// 查询提现详情
function detail() {
  return withdrawApi.detail(route.query.id).then(result => {
      const res = checkResponseData(result)
      if (res) {
        Object.assign(form, res, {
            formatAccountNumber: formatCreditCardNumber(res.accountNumber)
        })
      }
  })
}


const dayTypeDict = ref({
    1: '工作日',
    2: '非工作日',
    3: '自然日',
})
const settleConfigListData = ref([])
// 查询提现到账时间说明列表
const qrySettleConfigList = (currency) => {
    return withdrawApi.qrySettleConfigList({ currency }).then((result) => {
        const res = checkResponseData(result) || []
        settleConfigListData.value = res.map(item => {
            let period = item.period || 0
            let settleHour = item.settleHour
            if (settleHour >= 0) {
                // 加2小时
                settleHour += 2
                if (settleHour >= 24) {
                    // 超过一天
                    period++
                    settleHour -= 24
                }
            }
            return Object.assign({}, item, {
                period: period,
                settleHour: settleHour
            })
        })
    })
}


const jumpToWallet = () => {
    router.push({
        path: '/account/wallet'
    })
}
const jumpToCreate = () => {
    router.push({
        path: '/account/withdraw',
        query: {
            currency: form.accountCurrency
        }
    })
}

onMounted(async ()=>{
    await console.log('onMounted')
    nextTick(() => {
        settingStore.setFormPage(true)
    })
    getAllCountry()
    await detail()
    qrySettleConfigList(form.withdrawCurrency)
})

onUnmounted(()=>{
    settingStore.setFormPage(false)
})
</script>

<template>
  <div :class="{ 'page': true, 'm': isMobile }">
    <div class="content">
        <div class="title-container mb32">
            <el-link type="primary" class="back-link mb24" @click="jumpToWallet">
                <div class="lh0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.8333 10.0001H4.16667M4.16667 10.0001L10 15.8334M4.16667 10.0001L10 4.16675" stroke="#5548FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="flex-center-6"></div>
                <span>{{ $t('withdraw.detailBack') }}</span>
            </el-link>
            <h1>{{ $t('withdraw.detailTitle') }}</h1>
            <message v-if="statusType === 'primary'" type="warn" class="message mt32">{{ $t('withdraw.detailMessageProcess') }}</message>
            <message v-else-if="statusType === 'success'" type="success" class="message mt32">{{ $t('withdraw.detailMessageSuccess') }}</message>
            <message v-else-if="statusType === 'danger'" type="error" class="message mt32">
                <div>
                    {{ $t('withdraw.detailMessageError') }}
                    <br>
                    <el-link type="primary" class="message-link" @click="jumpToCreate">
                        {{ $t('withdraw.detailLinkCreateNew') }}
                        <el-icon><Right /></el-icon>
                    </el-link>
                </div>
            </message>
        </div>
        <FormValidate
          ref="formValidateRef"
          :model="form"
          label-position="top"
          class="form"
          novalidate
          disabled
        >
            <div class="mb32" :class="{ pl32: !isMobile, pr32: !isMobile }">
                <div class="hr mb16"></div>
                <div :class="{ pl20: isMobile, pr20: isMobile }">
                    <el-form-item :label="$t('withdraw.applyFormLabelWithdrawMethod')" prop="withdrawType" class="form-item" style="margin-bottom: 12px;">
                        <el-radio-group
                          v-model="form.withdrawType"
                          class="radio-card-group gap8 w-full"
                        >
                            <el-radio value="Bank_Account" border :class="{ 'flex-1': !isMobile,'w-full': isMobile }" >
                                <div class="flex items-center gap8">
                                    <div class="lh0">
                                        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_5551_29303)">
                                                <rect width="28" height="20" fill="black"/>
                                                <g clip-path="url(#clip1_5551_29303)">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21 16.9999H7V15.4999H21V16.9999ZM9.5 15.0009H8V9.99993H9.5V15.0009ZM16.1982 15.0009H14.6982V9.99993H16.1982V15.0009ZM20.2002 15.0009H18.7002V9.99993H20.2002V15.0009ZM13.5 14.9999H12V9.99895H13.5V14.9999ZM13.1055 3.44719C13.6685 3.16571 14.3315 3.16571 14.8945 3.44719L20.7236 6.36125C20.8928 6.44586 20.9998 6.61937 21 6.80852V8.51262L20.9902 8.61321C20.9503 8.80856 20.7959 8.96193 20.6006 9.00188L20.5 9.01262H7.5L7.39941 9.00188C7.20406 8.96193 7.0497 8.80856 7.00977 8.61321L7 8.51262V6.80852C7.00023 6.61937 7.10716 6.44586 7.27637 6.36125L13.1055 3.44719ZM14.4473 4.34172C14.1658 4.20101 13.8342 4.20101 13.5527 4.34172L8 7.11711V8.01262H20V7.11711L14.4473 4.34172ZM14 5.49993C14.5522 5.49993 14.9999 5.94774 15 6.49993C15 7.05221 14.5523 7.49993 14 7.49993C13.4477 7.49993 13 7.05221 13 6.49993C13.0001 5.94774 13.4478 5.49993 14 5.49993Z" fill="white"/>
                                                </g>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_5551_29303">
                                                    <rect width="28" height="20" rx="2" fill="white"/>
                                                </clipPath>
                                                <clipPath id="clip1_5551_29303">
                                                    <rect width="16" height="16" fill="white" transform="translate(6 2)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <span class="black-span fw500">{{$t('withdraw.bankAccount')}}</span>
                                </div>
                            </el-radio>
                            <!--  从非USD账户中发起提现，默认选中银行账户，PayPal不能选  -->
                            <el-radio value="PayPal" border :class="{ 'flex-1': !isMobile,'w-full': isMobile }">
                                <div class="flex items-center gap8">
                                    <div class="lh0">
                                        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_5551_29293)">
                                                <rect width="28" height="20" fill="white"/>
                                                <path d="M12.1879 16.9915L12.4479 15.3403L11.8688 15.3269H9.10364L11.0253 3.14225C11.0313 3.10546 11.0507 3.07117 11.079 3.04681C11.1073 3.02245 11.1436 3.00903 11.1814 3.00903H15.8439C17.3917 3.00903 18.4599 3.33113 19.0176 3.96688C19.2791 4.26512 19.4456 4.57678 19.5261 4.91976C19.6106 5.27964 19.6121 5.7096 19.5296 6.23401L19.5237 6.27228V6.6083L19.7851 6.75642C20.0053 6.87324 20.1803 7.00695 20.3145 7.16004C20.5382 7.41504 20.6828 7.73913 20.744 8.12336C20.8071 8.51853 20.7862 8.98875 20.6828 9.52111C20.5635 10.1335 20.3707 10.6669 20.1102 11.1033C19.8706 11.5054 19.5654 11.8389 19.2031 12.0974C18.8571 12.343 18.446 12.5294 17.9813 12.6487C17.5309 12.766 17.0174 12.8251 16.4543 12.8251H16.0914C15.8319 12.8251 15.5799 12.9186 15.3821 13.0861C15.1838 13.2571 15.0525 13.4907 15.0123 13.7462L14.9849 13.8948L14.5256 16.8051L14.5048 16.912C14.4993 16.9458 14.4899 16.9627 14.4759 16.9741C14.4635 16.9846 14.4456 16.9915 14.4282 16.9915H12.1879Z" fill="#253B80"/>
                                                <path d="M20.0327 6.31091C20.0188 6.39989 20.0029 6.49085 19.985 6.5843C19.3701 9.74118 17.2666 10.8317 14.5799 10.8317H13.212C12.8834 10.8317 12.6065 11.0703 12.5553 11.3944L11.855 15.8362L11.6567 17.0953C11.6233 17.308 11.7874 17.4999 12.0021 17.4999H14.4283C14.7156 17.4999 14.9597 17.2911 15.0049 17.0078L15.0288 16.8845L15.4856 13.9856L15.5149 13.8266C15.5596 13.5422 15.8042 13.3335 16.0915 13.3335H16.4543C18.805 13.3335 20.6451 12.3791 21.1829 9.61741C21.4076 8.46371 21.2913 7.5004 20.6968 6.82289C20.5169 6.6186 20.2937 6.4491 20.0327 6.31091Z" fill="#179BD7"/>
                                                <path d="M19.3894 6.05456C19.2954 6.02722 19.1985 6.00237 19.0991 5.98C18.9992 5.95813 18.8968 5.93874 18.7914 5.92184C18.4226 5.8622 18.0184 5.83386 17.5855 5.83386H13.9311C13.8411 5.83386 13.7556 5.85424 13.679 5.89103C13.5105 5.97205 13.3853 6.13161 13.355 6.32695L12.5775 11.2509L12.5552 11.3946C12.6064 11.0705 12.8832 10.8319 13.2118 10.8319H14.5797C17.2664 10.8319 19.37 9.74081 19.9848 6.58443C20.0032 6.49099 20.0186 6.40002 20.0326 6.31105C19.877 6.22853 19.7085 6.15795 19.527 6.09781C19.4823 6.08289 19.4361 6.06848 19.3894 6.05456Z" fill="#222D65"/>
                                                <path d="M13.355 6.32692C13.3854 6.13157 13.5106 5.97202 13.6791 5.89149C13.7562 5.85471 13.8412 5.83433 13.9311 5.83433H17.5856C18.0185 5.83433 18.4226 5.86266 18.7915 5.92231C18.8968 5.93921 18.9992 5.9586 19.0991 5.98047C19.1986 6.00283 19.2955 6.02769 19.3894 6.05503C19.4362 6.06894 19.4824 6.08336 19.5276 6.09777C19.709 6.15792 19.8776 6.229 20.0331 6.31102C20.2161 5.1444 20.0316 4.35009 19.4009 3.63083C18.7055 2.839 17.4504 2.5 15.8443 2.5H11.1819C10.8538 2.5 10.5739 2.73859 10.5232 3.06318L8.5812 15.3731C8.54292 15.6166 8.73082 15.8363 8.97637 15.8363H11.8549L12.5776 11.2509L13.355 6.32692Z" fill="#253B80"/>
                                            </g>
                                            <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" stroke="#CCCCCC" stroke-width="0.5"/>
                                            <defs>
                                                <clipPath id="clip0_5551_29293">
                                                    <rect width="28" height="20" rx="2" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <span class="black-span fw500">{{$t('withdraw.payPal')}}</span>
                                </div>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('withdraw.applyFormLabelAccountLocation')" prop="openingBankCountry" class="form-item">
                        <el-select
                          v-model="form.openingBankCountry"
                          :placeholder="$t('withdraw.applyFormPlaceholderAccountLocation')"
                          filterable
                          class="form-input select-default h44"
                        >
                            <template #label="{ label, value }">
                                <div class="flex items-center gap8">
                                    <div class="circle-country-icon-container size-20">
                                        <img v-if="value" :src="flagUrl(value)">
                                    </div>
                                    <span>{{ label }}</span>
                                </div>
                            </template>
                            <el-option
                              v-for="item in countryData"
                              :key="item.countryId"
                              :value="item.countryId"
                              :label="item.enUs"
                            >
                                <div class="flex items-center gap8">
                                    <div class="circle-country-icon-container size-20">
                                        <img :src="flagUrl(item.countryId)">
                                    </div>
                                    <span>{{ item.enUs }}</span>
                                </div>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="mb32" :class="{ pl32: !isMobile, pr32: !isMobile }">
                <div class="amount-container">
                    <div class="flex gap10">
                        <el-form-item :label="$t('withdraw.applyFormLabelWithdrawalAmount')" class="form-item nowrap-label w-160">
                            <el-select
                              v-model="form.accountCurrency"
                              placeholder=""
                              filterable
                              class="form-input select-default h44"
                              disabled
                            >
                                <template #label="{ label, value }">
                                    <div class="flex items-center gap8">
                                        <div class="circle-country-icon-container size-20">
                                            <img v-if="currencyToCountryId[value]" :src="flagUrl(currencyToCountryId[value])">
                                        </div>
                                        <span>{{ label }}</span>
                                    </div>
                                </template>
                                <el-option v-if="form.accountCurrency" :value="form.accountCurrency" :label="form.accountCurrency">
                                    <div class="flex items-center gap8">
                                        <div class="circle-country-icon-container size-20">
                                            <img :src="flagUrl(currencyToCountryId[form.accountCurrency])">
                                        </div>
                                        <span>{{ form.accountCurrency }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" " prop="applyAmt" class="form-item empty-label flex-1">
                            <el-input
                              :value="form.applyAmt ? currencyFormat(form.applyAmt) : ''"
                              class="form-input input-default"
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="lh0 txt-center mt20 mb20">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.25 7.5V15M5.25 15L2.25 12M5.25 15L8.25 12M12.75 10.5V3M12.75 3L9.75 6M12.75 3L15.75 6" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="amount-container">
                    <div class="flex gap10">
                        <el-form-item :label="$t('withdraw.applyFormLabelConvertedTo')" class="form-item nowrap-label w-160">
                            <el-select
                              v-model="form.withdrawCurrency"
                              placeholder=""
                              filterable
                              class="form-input select-default h44"
                            >
                                <template #label="{ label, value }">
                                    <div class="flex items-center gap8">
                                        <div class="circle-country-icon-container size-20">
                                            <img v-if="currencyToCountryId[value]" :src="flagUrl(currencyToCountryId[value])">
                                        </div>
                                        <span>{{ label }}</span>
                                    </div>
                                </template>
                                <el-option
                                  v-if="form.withdrawCurrency"
                                  :value="form.withdrawCurrency"
                                  :label="form.withdrawCurrency"
                                >
                                    <div class="flex items-center gap8">
                                        <div class="circle-country-icon-container size-20">
                                            <img :src="flagUrl(currencyToCountryId[form.withdrawCurrency])">
                                        </div>
                                        <span>{{ form.withdrawCurrency }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" " class="form-item empty-label flex-1">
                            <el-input
                              :value="form.arriveAmt ? currencyFormat(form.arriveAmt) : ''"
                              class="form-input input-default"
                              disabled
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                    <p v-if="isDeffCurrency && form.exchangeRate" class="tertiary-span2 mt12">
                        {{$t('withdraw.applyFormMessageExchangeRate')}}:  {{ form.accountCurrency }} 1 ≈ {{ form.withdrawCurrency }} {{ form.exchangeRate }}
                    </p>
                    <el-popover
                      placement="bottom-start"
                      effect="light"
                      trigger="click"
                      :width="480"
                      popper-class="popover-dialog"
                    >
                        <div class="arrival-time-container">
                            <div class="flex items-stretch">
                                <div class="arrival-time-item flex-1 black-span2 f16">{{$t('arrivalTime.applicationTime')}}（UTC +8）</div>
                                <div class="arrival-time-item flex-1 black-span2 f16">{{$t('arrivalTime.estimatedPaymentTime')}}（UTC +8）</div>
                            </div>
                            <div v-for="(item, index) in settleConfigListData" :key="index" class="flex items-stretch">
                                <div class="arrival-time-item flex-1 black-span2 f16 fw500">
                                    <template v-if="item.withdrawStartHour >= 0 && item.withdrawEndHour >= 0">
                                        {{ item.withdrawStartHour }}:00 - {{ item.withdrawEndHour }}:00
                                    </template>
                                    <template v-if="dayTypeDict[item.dayType]">({{ dayTypeDict[item.dayType] }})</template>
                                </div>
                                <div class="arrival-time-item flex-1 black-span2 f16 fw500">
                                    <template v-if="item.period >= 2">{{$t('arrivalTime.nextDays', { num: item.period })}}</template>
                                    <template v-else-if="item.period === 1">{{$t('arrivalTime.nextWorkingDay')}}</template>
                                    <template v-else>{{$t('arrivalTime.today')}}</template>
                                    <template v-if="item.settleHour >= 0">{{ item.settleHour }}:00</template>
                                </div>
                            </div>
                            <div class="arrival-time-p tertiary-span3">{{$t('arrivalTime.message')}}</div>
                        </div>
                        <template #reference>
                            <el-link type="primary" underline="never" class="underline-dotted mt12">{{$t('arrivalTime.explanation')}}</el-link>
                        </template>
                    </el-popover>
                </div>
            </div>
            <div class="mb32" :class="{ pl16: isMobile, pr16: isMobile, pl32: !isMobile, pr32: !isMobile }">
                <div class="fee-container">
                    <p class="flex items-center">
                        <span class="tertiary-span2">{{ $t('withdraw.applyFormFeeModuleWithdrawalLabel') }}</span>
                        <span class="flex-center"></span>
                        <span class="tertiary-span2 fw600">
                            {{ form.accountCurrency }} {{ currencyFormat(form.applyAmt) }}
                            <template v-if="isDeffCurrency"> ≈ {{ form.withdrawCurrency }} {{ currencyFormat(form.exchangeAmt) }}</template>
                        </span>
                        <span class="flex-center-20"></span>
                    </p>
                    <p class="p flex-box mt8">
                        <span class="tertiary-span2">{{ $t('withdraw.applyFormFeeModuleFeeLabel') }}</span>
                        <span class="flex-center"></span>
                        <span :class="[ form.v0WithdrawFee === form.withdrawFee ? 'tertiary-span2' : 'green-span', 'fw600' ]">{{ form.withdrawCurrency }} {{ currencyFormat(form.withdrawFee) }}</span>
                        <span class="flex-center-20"></span>
                    </p>
                    <div class="flex mt2">
                        <span class="flex-center-4"></span>
                        <div v-if="form.v0WithdrawFee !== form.withdrawFee" class="fee-sub tertiary-span flex-1">
                            <div class="flex items-center">
                                <span>{{ $t('withdraw.applyFormFeeModuleStandardFeeLabel') }}</span>
                                <span class="flex-center"></span>
                                <span>{{ form.withdrawCurrency }} {{ currencyFormat(form.v0WithdrawFee) }}</span>
                                <span class="flex-center-20"></span>
                            </div>
                            <div v-if="membershipFeeDiff && form.v0WithdrawFee" class="flex items-center mt2">
                                <span>{{ $t('withdraw.applyFormFeeModuleMembershipFeeLabel') }}</span>
                                <span class="flex-center"></span>
                                <span>- {{ form.withdrawCurrency }} {{ currencyFormat(membershipFeeDiff) }}</span>
                                <span class="flex-center-20"></span>
                            </div>
                            <div v-if="couponFeeDiff" class="flex items-center mt2">
                                <span>{{ $t('withdraw.applyFormFeeModuleCouponFeeLabel', { rate: form.discountNumber }) }}</span>
                                <span class="flex-center"></span>
                                <span>- {{ form.withdrawCurrency }} {{ currencyFormat(couponFeeDiff) }}</span>
                                <span class="flex-center-20"></span>
                            </div>
                        </div>
                    </div>
                    <div v-if="fee > 0 && membershipCardData.length && !membershipCardNo" class="flex mt2">
                        <div class="flex-center"></div>
                        <el-button
                          type="primary"
                          class="button-default h32 f14"
                          @click="showDiscountDetailsDialog"
                        >
                            <div class="lh0 mr4">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_5206_681)">
                                        <path d="M8 2.25C8.41421 2.25 8.75 2.58579 8.75 3V7.25H13C13.4142 7.25 13.75 7.58579 13.75 8C13.75 8.41421 13.4142 8.75 13 8.75H8.75V13C8.75 13.4142 8.41421 13.75 8 13.75C7.58579 13.75 7.25 13.4142 7.25 13V8.75H3C2.58579 8.75 2.25 8.41421 2.25 8C2.25 7.58579 2.58579 7.25 3 7.25H7.25V3C7.25 2.58579 7.58579 2.25 8 2.25Z" fill="currentColor"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_5206_681">
                                            <rect width="16" height="16" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            {{ $t('withdraw.applyFormFeeModuleButtonAdd') }}
                        </el-button>
                        <span class="flex-center-20"></span>
                    </div>
                    <div class="hr mt8"></div>
                    <p class="flex items-center mt8">
                        <span class="tertiary-span2 fw600">{{ $t('withdraw.applyFormFeeModuleReceivedLabel') }}</span>
                        <span class="flex-center"></span>
                        <span class="tertiary-span2 f16 fw600">{{ form.withdrawCurrency }} {{ currencyFormat(form.arriveAmt) }}</span>
                        <span class="flex-center-20"></span>
                    </p>
                    <p class="flex items-center tertiary-span2 mt8">
                        <span>{{ $t('withdraw.applyFormFeeModuleMessage') }}</span>
                        <span class="flex-center-20"></span>
                    </p>
                </div>
            </div>
            <div v-show="hasSuccessBankcardData" class="account-container mb32">
                <div class="mb20">
                    <p class="tertiary-span2 f600">{{ $t('withdraw.applyFormMessageAccountUlTitle') }}</p>
                    <p class="tertiary-span2">{{ $t('withdraw.applyFormMessageAccountUlTip') }}</p>
                </div>
                <AccountWithdrawAccountUl
                  :key="form.withdrawType + '-' + form.openingBankCountry"
                  :withdrawType="form.withdrawType"
                  :openingBankCountry="form.openingBankCountry"
                  @obtainedData="obtainedData"
                  @select="selectBankcardData"
                ></AccountWithdrawAccountUl>
            </div>
            <div class="info-container mb32" :class="{ pl16: isMobile, pr16: isMobile, pl32: !isMobile, pr32: !isMobile }">
                <div class="black-span2 f18 fw600 mb24">{{$t('withdraw.accountDetails')}}</div>
                <el-form-item v-if="isShowAccountType" prop="accountType" class="form-item">
                    <template #label>
                        <div class="flex items-center gap4">
                            <span>{{$t('withdraw.applyFormLabelAccountType')}}</span>
                            <div class="lh0 cursor-pointer" @click="isShowAccountTypeDialog = true">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_5733_444)">
                                        <path d="M6.05992 6.00016C6.21665 5.55461 6.52602 5.1789 6.93322 4.93958C7.34042 4.70027 7.81918 4.61279 8.2847 4.69264C8.75022 4.77249 9.17246 5.01451 9.47664 5.37585C9.78081 5.73718 9.94729 6.19451 9.94658 6.66683C9.94658 8.00016 7.94658 8.66683 7.94658 8.66683M7.99992 11.3335H8.00659M14.6666 8.00016C14.6666 11.6821 11.6818 14.6668 7.99992 14.6668C4.31802 14.6668 1.33325 11.6821 1.33325 8.00016C1.33325 4.31826 4.31802 1.3335 7.99992 1.3335C11.6818 1.3335 14.6666 4.31826 14.6666 8.00016Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_5733_444">
                                            <rect width="16" height="16" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </template>
                    <el-radio-group v-model="form.accountType" class="radio-default w-full">
                        <el-radio value="saving">{{$t('withdraw.savingsAccount')}}</el-radio>
                        <el-radio value="checking">{{$t('withdraw.checkingAccount')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('withdraw.applyFormLabelAccountHolderType')" prop="accountHolderType" class="form-item">
                    <el-radio-group v-model="form.accountHolderType" class="radio-default w-full">
                        <el-radio value="Individual">{{$t('withdraw.individual')}}</el-radio>
                        <el-radio value="Business">{{$t('withdraw.business')}}</el-radio>
                    </el-radio-group>
                    <div v-if="isSpecialForAccountHolderType" class="tertiary-span2 w-full">{{$t('withdraw.applyFormMessageAccountHolderType')}}</div>
                </el-form-item>
                <el-form-item :label="isBankAccount ? $t('withdraw.applyFormLabelBankAccountName') : $t('withdraw.applyFormLabelAccountHolderName')" prop="accountName" class="form-item">
                    <el-input
                      v-model="form.accountName"
                      class="form-input input-default"
                      :placeholder="isBankAccount ? $t('withdraw.applyFormLabelBankAccountName') : $t('withdraw.applyFormLabelAccountHolderName')"
                    />
                </el-form-item>
                <el-form-item v-if="isBankAccount" :label="$t('withdraw.applyFormLabelBankName')" prop="bankName" class="form-item">
                    <el-input
                      v-model="form.bankName"
                      class="form-input input-default"
                    />
                </el-form-item>
                <el-form-item v-if="isBankAccount" :label="$t('withdraw.applyFormLabelAccountNumber')" prop="accountNumber" class="form-item account-number direction-ltr-input">
                    <el-input
                      v-model="form.accountNumber"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormPlaceholderAccountNumber')"
                    >
                        <template #prefix>
                            <img
                              :src="cardIcon"
                              class="card-icon"
                            >
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="!isBankAccount" :label="$t('withdraw.applyFormLabelDateOfBirth')" prop="birthDate" class="form-item">
                    <el-date-picker
                      v-model="form.birthDate"
                      value-format="YYYY-MM-DD"
                      class="form-input input-date-default h44 w-full"
                      type="date"
                      :placeholder="$t('withdraw.applyFormPlaceholderDateOfBirth')"
                    />
                </el-form-item>
                <el-form-item v-if="!isBankAccount" :label="$t('withdraw.applyFormLabelPaypalAccount')" prop="paypalAccount" class="form-item">
                    <el-input
                      v-model="form.accountNumber"
                      class="form-input input-default"
                      placeholder=""
                    ></el-input>
                </el-form-item>
                <div class="black-span2 f18 fw600 mt56 mb24">{{$t('withdraw.accountOpeningInformation')}}</div>
                <el-form-item v-if="isBankAccount" :label="$t('withdraw.applyFormLabelCountryOrRegion')" class="form-item">
                    <div class="flex items-center gap8" style="height: 44px;">
                        <template v-if="form.openingBankCountry">
                            <div class="circle-country-icon-container size-20">
                                <img :src="flagUrl(form.openingBankCountry)">
                            </div>
                            <span>{{ countryToName[form.openingBankCountry] }}</span>
                        </template>
                        <template v-else>-</template>
                    </div>
                </el-form-item>
                <div class="flex gap16 mb16">
                    <el-form-item :label="(isBankAccount ? $t('withdraw.applyFormLabelBankState') : $t('withdraw.applyFormLabelState')) + (form.withdrawCurrency === 'USD' ? '' : (' ('+$t('withdraw.optional')+')'))" prop="bankState" class="form-item flex-1" style="margin-bottom: 0">
                        <el-input
                          v-model="form.bankState"
                          class="form-input input-default"
                          :placeholder="(isBankAccount ? $t('withdraw.applyFormLabelBankState') : $t('withdraw.applyFormLabelState')) + (form.withdrawCurrency === 'USD' ? '' : (' ('+$t('withdraw.optional')+')'))"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('withdraw.applyFormLabelZip') + (form.withdrawCurrency === 'USD' ? '' : (' ('+$t('withdraw.optional')+')'))" prop="zip" class="form-item w-180" style="margin-bottom: 0">
                        <el-input
                          v-model="form.zip"
                          class="form-input input-default"
                          :placeholder="$t('withdraw.applyFormLabelZip') + (form.withdrawCurrency === 'USD' ? '' : (' ('+$t('withdraw.optional')+')'))"
                        />
                    </el-form-item>
                </div>
                <el-form-item :label="isBankAccount ? $t('withdraw.applyFormLabelCity') : $t('withdraw.applyFormLabelCityOfAccountHolder')" prop="openingBankCity" class="form-item">
                    <el-input
                      v-model="form.openingBankCity"
                      class="form-input input-default"
                      :placeholder="isBankAccount ? $t('withdraw.applyFormLabelCity') : $t('withdraw.applyFormLabelCityOfAccountHolder')"
                    />
                </el-form-item>
                <el-form-item :label="isBankAccount ? $t('withdraw.applyFormLabelAddress') : $t('withdraw.applyFormLabelAddressOfAccountHolder')" prop="openingBankAddress" class="form-item">
                    <el-input
                      v-model="form.openingBankAddress"
                      class="form-input input-default"
                      :placeholder="isBankAccount ? $t('withdraw.applyFormLabelAddress') : $t('withdraw.applyFormLabelAddressOfAccountHolder')"
                    />
                </el-form-item>
                <el-form-item v-if="isShowRoutingNumber" :label="$t('withdraw.applyFormLabelRoutingNumber')" prop="routingNumber" class="form-item">
                    <el-input
                      v-model="form.routingNumber"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormLabelRoutingNumber')"
                    />
                </el-form-item>
                <el-form-item v-if="isBankAccount" :label="$t('withdraw.applyFormLabelSWIFTCodeOrBIC')" prop="swiftCode" class="form-item">
                    <el-input
                      v-model="form.swiftCode"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormLabelSWIFTCodeOrBIC')"
                    />
                </el-form-item>
                <el-form-item v-if="isShowBankCode" :label="$t('withdraw.applyFormLabelBankCode')" prop="bankCode" class="form-item">
                    <el-input
                      v-model="form.bankCode"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormLabelBankCode')"
                    />
                </el-form-item>
                <el-form-item v-if="isShowBranchBankCode" :label="$t('withdraw.applyFormLabelBranchCode')" prop="branchBankCode" class="form-item">
                    <el-input
                      v-model="form.branchBankCode"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormLabelBranchCode')"
                    />
                </el-form-item>
            </div>
        </FormValidate>
    </div>
  <AccountWithdrawAccountTypeDialog v-model="isShowAccountTypeDialog"></AccountWithdrawAccountTypeDialog>
  </div>
</template>

<style lang="scss">
@import url("@/assets/css/element-reset/input-date.scss");
</style>
<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
@import url("@/assets/css/element-reset/radio.scss");
@import url("@/assets/css/element-reset/input-date.scss");
* {
    box-sizing: border-box;
}
.message-link {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    margin-top: 12px;
    .el-icon {
        font-size: 20px;
        margin-left: 6px;
    }
}
.w-160 {
    width: 160px;
}
.w-180 {
    width: 180px;
}
.w-480 {
    width: 480px;
}
.black-span {
    color: #171717;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw500 {
        font-weight: 500;
    }
}
.black-span2 {
    color: #101828;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw500 {
        font-weight: 500;
    }
    &.fw600 {
        font-weight: 600;
    }
    &.f16 {
        font-size: 16px;
        line-height: 24px;
    }
    &.f18 {
        font-size: 18px;
        line-height: 28px;
    }
}
.green-span {
    color: #079455;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw600 {
        font-weight: 600;
    }
    &.f16 {
        font-size: 16px;
        line-height: 24px;
    }
}
.tertiary-span {
    color: #667085;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
}
.tertiary-span2 {
    color: #475467;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw600 {
        font-weight: 600;
    }
    &.f16 {
        font-size: 16px;
        line-height: 24px;
    }
}
.tertiary-span3 {
    color: #686A6C;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
}
.hr {
    border-bottom: 1px solid #E4E7EC;
}
.underline-dotted {
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
}
.page {
    padding: 28px 0;
    &.m {
        padding: 16px 0;
        .title-container {
            margin-left: 16px;
            margin-right: 16px;
        }
        .form {
            .amount-container {
                border-radius: 0;
                border-left: 0;
                border-right: 0;
            }
            .account-container {
                border-radius: 0;
            }
        }
    }
}
.content {
    width: 526px;
    max-width: 100%;
    margin: 0 auto;
    padding: 32px 0;
    border-radius: 10px;
    background-color: #FFF;
}
.title-container {
    margin-left: 32px;
    margin-right: 32px;
    .back-link {
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
    }
    h1 {
        color: #101828;
        font-size: 30px;
        font-style: normal;
        font-weight: 600;
        line-height: 38px; /* 126.667% */
    }
}
.form {
    .form-item {
        margin-bottom: 16px;
        &:last-child {
            margin-bottom: 0;
        }
        :deep(.el-form-item__label) {
            color: #344054;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 20px; /* 142.857% */
            padding: 0;
            margin: 0 0 6px;
            &::before {
                display: none;
            }
        }
        :deep(.el-form-item__error) {
            font-size: 14px;
            position: static;
        }
        &.nowrap-label {
            :deep(.el-form-item__label) {
                white-space: nowrap;
            }
        }
        &.empty-label {
            :deep(.el-form-item__label) {
                height: 20px;
            }
        }
    }
    .radio-card-group {
        .el-radio {
            height: 48px;
            margin: 0;
            &.is-bordered.is-checked {
                border-width: 2px;
            }
            :deep(.el-radio__inner) {
                width: 20px;
                height: 20px;
                &::after {
                    width: 8px;
                    height: 8px;
                }
            }
        }
    }
    .amount-container {
        padding: 20px;
        border-radius: 8px;
        background-color: #F9FAFB;
        border: 1px solid #E4E7EC;
        .form-item {
            margin-bottom: 0;
        }
    }
    .account-container {
        padding: 20px 20px 8px;
        border-radius: 8px;
        background-color: #F2F4F7;
    }
    .info-container {
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #F2F4F7;
    }
    .account-number {
        :deep(.el-input__wrapper) {
            .rtl & {
                .el-input__prefix-inner > img {
                    margin: 0 0 0 8px;
                }
                .el-input__prefix {
                    padding: 0 10px 0 8px;
                }
                .el-input__inner {
                    padding: 10px 0 10px 14px;
                }
            }
            .el-input__prefix {
                padding: 0 8px 0 10px;
            }
            .el-input__inner {
                padding-left: 0;
            }
        }
    }
    .fee-container {
        padding: 16px 0 0;
        border-top: 1px solid #E4E7EC;
        .fee-sub {
            padding: 4px 0 4px 12px;
            border-left: 1px solid #E4E3EA;
            .rtl & {
                padding: 4px 12px 4px 0;
                border-left: 0;
                border-right: 1px solid #E4E3EA;
            }
        }
    }
    .form-buttons {
        display: flex;
        justify-content: right;
        gap: 12px;
        .rtl & {
            justify-content: left;
        }
        .m & {
            flex-direction: column-reverse;
        }
    }
}
.card-icon {
    display: block;
    width: 30px;
    height: auto;
}
.pre-flag {
    display: block;
    width: 22px;
    height: auto;
    box-shadow: 0 0 0 1px #f2f2f2;
    /*border-radius: 2px;*/
}
.arrival-time-container {
    .arrival-time-item {
        min-height: 46px;
        padding: 11px 14px 10px;
        border-bottom: 1px solid #D0D5DD;
    }
    .arrival-time-p {
        padding: 11px 14px 10px;
        width: 410px;
        max-width: 100%;
    }
}
</style>
