<script setup>
import { checkResponseData, currencyFormat, errorMessage, accurate_add, accurate_toFixed } from "@/util/index.js"
import { formatDate } from "@/util/dateUtil.js"
import { normalCreditCardNumber, formatCreditCardNumber, formatSWIFTCode, getNumberByInput, flagUrl } from "@/util/dataUtil.js"
import { Back } from '@element-plus/icons-vue'
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
  hasChinese,
  isSWIFTCode,
  isCityName,
isAccountName,
//   isValidZipcode,
    isBaseCard,
  isVisaCard,
  isMasterCard,
  isHipercard,
  isDiscover,
  isDinerClub,
  isAmex,
  isElo,
  isIBAN,
hasCountryCodeForIBAN,
} from "@/util/validate";

const { t } = useI18n();
const { userApi, withdrawApi, countryApi } = useApi()
const settingStore = useSettingStore()
const router = useRouter()
const route = useRouter()
const isMobile = useIsMobile()

// 传入币种
const exchangeAccount = ref(route.query?.currency || 'USD')


const formValidateRef = ref()
const isShowVerifyGialog = ref(false)
const limitAmount = ref(50)
const ableBalanceAmount = ref(0)
const loading = ref(false)
const form = reactive({
    withdrawalMethod: 'bankAccount',
    withdrawalCurrency: exchangeAccount.value,
    convertedCurrency: exchangeAccount.value,
    applyAmt: undefined,
    accountName: undefined,
    accountNumber: '',
    swiftCode: undefined,
    bankName: undefined,
    openingBankCountry: undefined,
    openingBankCity: undefined,
    openingBankAddress: undefined,
})
const checkResultData = reactive({
    applyAmt: true,
    accountName: true,
    accountNumber: true,
    swiftCode: true,
    bankName: true,
    openingBankCountry: true,
    openingBankCity: true,
    openingBankAddress: true,
})


// 是否账户币种为USD
const isExchangeAccountUSD = ref(exchangeAccount.value === 'USD')


const hasSuccessBankcardData = ref(false)
const obtainedData = (bol) => {
    hasSuccessBankcardData.value = bol
}


// 选中优惠券
const membershipCardNo = ref()
const membershipCardData = ref([])
// 是否显示“获取等级错误”弹窗
const isShowDiscountDetailsDialog = ref(false)
function showDiscountDetailsDialog() {
    isShowDiscountDetailsDialog.value = true
}
function changeSelectCoupon(val) {
    membershipCardNo.value = val
    qryWithdrawFee()
}
function qryMembershipCardData() {
    withdrawApi.listMembershipCardPage().then(result => {
        membershipCardData.value = checkResponseData(result) || []
    })
}


// 手续费
const fee = ref(0)
const membershipFeeDiff = ref(0)
const couponFeeDiff = ref(0)
const feeData = ref({})
const isGetFee = ref(false)
const isGetLevelError = ref(false)
// 查询手续费
async function qryWithdrawFee() {
    const result = await withdrawApi.qryWithdrawFee({
        cardNo: membershipCardNo.value
    })
    if (result?.success) {
        feeData.value = result.data || {}
        fee.value = result.data?.withdrawFee || 0
        membershipFeeDiff.value = accurate_add(defaultWithdrawFee.value, -feeData.value.receivableFee) || 0
        couponFeeDiff.value = accurate_add(feeData.value.receivableFee, -feeData.value.withdrawFee) || 0
        isGetFee.value = true
        isGetLevelError.value = false
    } else if (result?.code === 'FA1002') {
        isGetLevelError.value = true
        isShowErrorLevelDialog.value = true
    } else {
        errorMessage(result?.message)
    }
}
// 默认等级手续费
const defaultWithdrawFee = ref(0)
const defaultWithdrawFeeData = ref({})
const isGetDefaultWithdrawFee = ref(false)
const isGetDefaultLevelError = ref(false)
// 是否显示“获取等级错误”弹窗
const isShowErrorLevelDialog = ref(false)
// 查询默认等级手续费
const qryDefaultWithdrawFee = async () => {
    const result = await withdrawApi.qryDefaultWithdrawFee()
    if (result?.success) {
        defaultWithdrawFeeData.value = result.data || {}
        defaultWithdrawFee.value = result.data?.withdrawFee || 0
        isGetDefaultWithdrawFee.value = true
        isGetDefaultLevelError.value = false
    } else if (result?.code === 'FA1002') {
        isGetDefaultLevelError.value = true
        isShowErrorLevelDialog.value = true
    } else {
        errorMessage(result?.message)
    }
}


const selectBankcardData = (obj) => {
    Object.assign(form, obj, {
        accountNumber: formatCreditCardNumber(obj.accountNumber),
        // swiftCode: formatSWIFTCode(obj.swiftCode),
    })
    risk_control_check('accountName')
    risk_control_check('bankName')
    risk_control_check('openingBankCountry')
    triggerCycle()
}
// 校验金额
const validateAmt = (rule, value, callback) => {
if (value && !(value >= limitAmount.value)) {
    callback(new Error(t('withdraw.applyFormValidateAmountMin') + ' USD ' + currencyFormat(limitAmount.value)))
  } else if (value && value > ableBalanceAmount.value) {
    callback(new Error(t('withdraw.applyFormValidateAmountMax') + ' USD ' + currencyFormat(ableBalanceAmount.value)))
  } else {
    callback()
  }
}
// 校验名称
const validateAccountName = (rule, value, callback) => {
  if (value && !checkResultData.accountName) {
    callback(new Error(t('withdraw.applyFormValidateRiskManagement')))
  } else if (value && !isAccountName(value)) {
    callback(new Error(t('withdraw.applyFormValidateEnglish')))
  } else {
    callback()
  }
}
// 校验卡号
const validateNumber = (rule, value, callback) => {
if (value && !isCardIconMatch.value) {
    if (hasCountryCodeForIBAN(value)) {
        callback(new Error(t('withdraw.applyFormValidateIBANError')))
    } else {
        callback(new Error(t('withdraw.applyFormValidateFormatError')))
    }
  } else {
    callback()
  }
}
// 校验SWIFTCode
const validateSWIFTCode = (rule, value, callback) => {
if (value && !isSWIFTCode(value, countryCodeArr.value)) {
    callback(new Error(t('withdraw.applyFormValidateSWIFTCodeOrBICError')))
  } else if (value && isGetFee.value && !(fee.value >= 0)) {
    callback(new Error(t('withdraw.applyFormValidateSWIFTCodeOrBICError')))
  } else {
    callback()
  }
}
// 校验银行名称
const validateBankName = (rule, value, callback) => {

  if (value && hasChinese(value)) {
    callback(new Error(t('withdraw.applyFormValidateNotChinese')))
  } else if (value && !checkResultData.bankName) {
    callback(new Error(t('withdraw.applyFormValidateRiskManagement')))
  } else {
    callback()
  }
}
// 校验国家
const validateCountry = (rule, value, callback) => {
  if (value && !checkResultData.openingBankCountry) {
    callback(new Error(t('withdraw.applyFormValidateRiskManagement')))
  } else {
    callback()
  }
}
// 校验城市
const validateCity = (rule, value, callback) => {
  if (value && !isCityName(value)) {
    callback(new Error(t('withdraw.applyFormValidateFormatError')))
  } else {
    callback()
  }
}
// 校验地址
const validateAddress = (rule, value, callback) => {
  if (value && hasChinese(value)) {
    callback(new Error(t('withdraw.applyFormValidateNotChinese')))
  } else {
    callback()
  }
}
// 是否显示“获取等级错误”弹窗
const isShowErrorAreaDialog = ref(false)
function validateCardAndSWIFTCodeAndCounty () {
    if (!isIBANCard()) return true

    const iban = form.accountNumber.replace(/\s+/g, '').toUpperCase();
    const ibanCounty = iban.slice(0,2)

    const swiftCode = form.swiftCode.toUpperCase();
    const swiftCodeCounty = swiftCode.slice(4,6)

    const openingBankCountry = form.openingBankCountry.toUpperCase();

    console.log('ibanCounty: ', ibanCounty)
    console.log('swiftCodeCounty: ', swiftCodeCounty)
    console.log('openingBankCountry: ', openingBankCountry)

    return ibanCounty === swiftCodeCounty && ibanCounty === openingBankCountry
}
const rules = () => {
    return {
        applyAmt: [
            {
            required: true,
            message: t('withdraw.applyFormRequiredWithdrawalAmount'),
            trigger: 'blur',
            },
            {
                validator: validateAmt,
                trigger: 'blur'
            }
        ],
        accountName: [
            {
            required: true,
            message: t('withdraw.applyFormRequiredAccountHolderName'),
            trigger: 'blur',
            },
            {
                validator: validateAccountName,
                trigger: 'blur'
            }
        ],
        accountNumber: [
            {
            required: true,
            message: t('withdraw.applyFormRequiredAccountNumber'),
            trigger: 'blur',
            },
            {
                validator: validateNumber,
                trigger: 'blur'
            }
        ],
        swiftCode: [
            {
            required: true,
            message: t('withdraw.applyFormRequiredSWIFTCodeOrBIC'),
            trigger: 'blur',
            },
            {
                validator: validateSWIFTCode,
                trigger: 'blur'
            }
        ],
        bankName: [
            {
            required: true,
            message: t('withdraw.applyFormRequiredBankName'),
            trigger: 'blur',
            },
            {
                validator: validateBankName,
                trigger: 'blur'
            }
        ],
        openingBankCountry: [
            {
            required: true,
            message: t('withdraw.applyFormRequiredCountryOrRegion'),
            trigger: 'blur',
            },
            {
                validator: validateCountry,
                trigger: 'blur'
            }
        ],
        openingBankCity: [
            {
            required: true,
            message: t('withdraw.applyFormRequiredCity'),
            trigger: 'blur',
            },
            {
                validator: validateCity,
                trigger: 'blur'
            }
        ],
        openingBankAddress: [
            {
            required: true,
            message: t('withdraw.applyFormRequiredAddress'),
            trigger: 'blur',
            },
            {
                validator: validateAddress,
                trigger: 'blur'
            }
        ],
    }
}
const locationData = reactive({
    countryData: [
        // {
        //     "countryId": "CN",
        //         "name": "China",
        //         "description": "中国大陆",
        //         "valid": "1",
        //         "area": "N",
        //         "chinaArea": "亚洲",
        //         "sort": 0E-30,
        //         "countryCode": "457",
        //         "threeCountryCode": null,
        //         "currency": "RMB",
        //         "callingCode": "86",
        //         "ecCountryId": "CN"
        // }
    ]
})
const countryCodeArr = computed(() => {
    return locationData.countryData.map(item => item.countryId.toLowerCase())
})
let isCycleForCardIcon = ref(false)
let indexForCardIcon = ref(0)
let tForCardIcon = undefined
const cardIconList = [
    visa,
    master,
    hipercardIcon,
    discover,
    dinerClub,
    AMEXIcon,
    eloIcon,
    ibanIcon,
]
const actualWithdrawAmount = computed(() => {
    return accurate_add(form.applyAmt, -fee.value) || 0
})
const isCardIconMatch = computed(() => {
    const cardNum = normalCreditCardNumber(form.accountNumber)
    if (isBaseCard(cardNum)) {
        return true
    } else if (isVisaCard(cardNum)) {
        return true
    } else if (isMasterCard(cardNum)) {
        return true
    } else if (isHipercard(cardNum)) {
        return true
    } else if (isDiscover(cardNum)) {
        return true
    } else if (isDinerClub(cardNum)) {
        return true
    } else if (isAmex(cardNum)) {
        return true
    } else if (isElo(cardNum)) {
        return true
    } else if (isIBAN(cardNum)) {
        return true
    }
    return false
});
function isIBANCard() {
    const cardNum = normalCreditCardNumber(form.accountNumber)
    if (isIBAN(cardNum)) {
        return true
    }
    return false
}
const cardIcon = computed(() => {
    if (isCycleForCardIcon.value) {
        return cardIconList[indexForCardIcon.value]
    }

    const cardNum = normalCreditCardNumber(form.accountNumber)
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

const setIntervalForCardIconCycle = () => {
    clearIntervalForCardIconCycle()

    isCycleForCardIcon.value = true
    tForCardIcon = setInterval(() => {
        if (indexForCardIcon.value >= (cardIconList.length - 1)) {
            indexForCardIcon.value = 0
        } else {
            indexForCardIcon.value++
        }
    }, 1000)
}
const clearIntervalForCardIconCycle = () => {
    clearInterval(tForCardIcon)
    isCycleForCardIcon.value = false
}
const triggerCycle = () => {
    if (form.accountNumber) {
        clearIntervalForCardIconCycle()
    } else {
        setIntervalForCardIconCycle()
    }
}
// 获取所有国家列表
const getAllCountry = async() => {
    const result = await countryApi.getAllCountry()
    const res = checkResponseData(result)
    if (res) {
        res.forEach(item => item.name = item.name || item.enUs)
        locationData.countryData = res
    }
}
// 查询可用佣金
const qryBalance = async() => {
  const result = await withdrawApi.qryBalance()
  ableBalanceAmount.value = checkResponseData(result)
}
// 风控校验
const risk_control_check = async(key) => {
    const obj = {}
    obj[key] = form[key]
    const result = await withdrawApi.risk_control_check(obj)
    checkResultData[key] = checkResponseData(result)
    formValidateRef.value?.formRef?.validateField(key)
}
// 提现申请前校验
const validateApply = () => {
    formValidateRef.value?.formRef?.validate(async (valid) => {
        if (!valid) {
            console.log('error submit!!');
            return false;
        }
        if (!validateCardAndSWIFTCodeAndCounty()) {
            isShowErrorAreaDialog.value = true
            return false;
        }
        isShowVerifyGialog.value = true
    })
}
// 提现申请
const apply = async (checkCode) => {
    loading.value = true

    const result = await withdrawApi.apply(Object.assign({}, form, {
        withdrawFee: fee.value,
        receivableFee: feeData.value.receivableFee,
        cardNo: membershipCardNo.value,
        discountNumber: feeData.value.discountNumber,
        accountNumber: normalCreditCardNumber(form.accountNumber),
        checkCode
    }))
    const res = checkResponseData(result, 'NO_RETURN_DATA')
    router.push({
        path: '/account/withdraw/result',
        query: {
            success: res ? 1 : 0
        }
    })
    loading.value = false
}
const jumpToWallet = () => {
    router.push({
        path: '/account/wallet'
    })
}


onMounted(async ()=>{
    nextTick(() => {
        settingStore.setFormPage(true)
    })
    getAllCountry()
    qryBalance()
    setIntervalForCardIconCycle()
    await qryDefaultWithdrawFee()
    qryWithdrawFee()
    qryMembershipCardData()
})

onUnmounted(()=>{
    settingStore.setFormPage(false)
    clearIntervalForCardIconCycle()
})
</script>

<template>
  <div :class="{ 'page': true, 'm': isMobile }">
    <div class="content">
        <div class="title-container mb32">
            <el-link type="primary" class="back-link mb24" @click="jumpToWallet">
                <div class="lh0 mr6">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.8333 10.0001H4.16667M4.16667 10.0001L10 15.8334M4.16667 10.0001L10 4.16675" stroke="#5548FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span>{{ $t('withdraw.applyBack') }}</span>
            </el-link>
            <h1>{{ $t('withdraw.applyTitle') }}</h1>
        </div>
        <FormValidate
            ref="formValidateRef"
            :model="form"
            :rules="rules()"
            label-position="top"
            class="form"
            novalidate
        >
            <div class="mb32" :class="{ pl32: !isMobile, pr32: !isMobile }">
                <div class="hr mb16"></div>
                <div :class="{ pl20: isMobile, pr20: isMobile }">
                    <el-form-item label="Withdrawal Method" prop="withdrawalMethod" class="form-item" style="margin-bottom: 12px;">
                        <el-radio-group
                          v-model="form.withdrawalMethod"
                          class="radio-card-group gap8 w-full"
                        >
                            <el-radio label="bankAccount" border :class="{ 'flex-1': !isMobile,'w-full': isMobile }" >
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
                                    <span class="black-span fw500">Bank account</span>
                                </div>
                            </el-radio>
                            <!--  从非USD账户中发起提现，默认选中银行账户，PayPal不能选  -->
                            <el-radio label="payPal" border :class="{ 'flex-1': !isMobile,'w-full': isMobile }" :disabled="!isExchangeAccountUSD">
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
                                    <span class="black-span fw500">PayPal</span>
                                </div>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('withdraw.applyFormLabelCountryOrRegion')" prop="openingBankCountry" class="form-item location-container">
                        <el-select
                          v-model="form.openingBankCountry"
                          placeholder=""
                          filterable
                          class="form-input select-default h44"
                          @change="risk_control_check('openingBankCountry')"
                        >
                            <template #label="{ label, value }">
                                <!-- <template #label="{ label }"> -->
                                <img
                                  v-if="value"
                                  :src="flagUrl(value)"
                                  class="pre-flag location-icon"
                                >
                                <span>{{ label }}</span>
                            </template>
                            <el-option
                              v-for="item in locationData.countryData"
                              :key="item.countryId"
                              :value="item.countryId"
                              :label="item.name"
                            />
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="mb32" :class="{ pl32: !isMobile, pr32: !isMobile }">
                <div class="amount-container">
                    <div class="flex gap10">
                        <el-form-item :label="$t('withdraw.applyFormLabelWithdrawalAmount')" class="form-item nowrap-label w-160">
                            <el-select
                              v-model="form.withdrawalCurrency"
                              placeholder=""
                              filterable
                              class="form-input select-default h44"
                              disabled
                            >
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" " prop="applyAmt" class="form-item empty-label flex-1">
                            <el-input
                              v-model="form.applyAmt"
                              class="form-input input-default"
                              @input="e => { form.applyAmt = getNumberByInput(e)}"
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                    <p class="tertiary-span2 mt8">
                        {{ $t('withdraw.applyFormMessageWithdrawalAmount1') }} ${{ currencyFormat(ableBalanceAmount) }}
                    </p>
                    <p class="tertiary-span2 mt12">
                        {{ $t('withdraw.applyFormMessageWithdrawalAmount2') }} ${{ currencyFormat(limitAmount) }}.
                    </p>
                </div>
                <div class="lh0 txt-center mt20 mb20">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.25 7.5V15M5.25 15L2.25 12M5.25 15L8.25 12M12.75 10.5V3M12.75 3L9.75 6M12.75 3L15.75 6" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="amount-container">
                    <div class="flex gap10">
                        <el-form-item label="Converted to" class="form-item nowrap-label w-160">
                            <el-select
                              v-model="form.convertedCurrency"
                              placeholder=""
                              filterable
                              class="form-input select-default h44"
                              :disabled="!isExchangeAccountUSD"
                            >
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" " prop="applyAmt" class="form-item empty-label flex-1">
                            <el-input
                              v-model="form.applyAmt"
                              class="form-input input-default"
                              disabled
                            >
                            </el-input>
                        </el-form-item>
                    </div>

                    <el-popover
                      placement="bottom-start"
                      effect="light"
                      :width="480"
                      popper-class="popover-dialog"
                    >
                        <div class="arrival-time-container">
                            <div class="flex items-stretch">
                                <div class="arrival-time-item flex-1 black-span2 f16">申请时间（UTC +8）</div>
                                <div class="arrival-time-item flex-1 black-span2 f16">预计打款时间（UTC +8）</div>
                            </div>
                            <div class="flex items-stretch">
                                <div class="arrival-time-item flex-1 black-span2 f16 fw500">0:00 - 15:00 (自然日)</div>
                                <div class="arrival-time-item flex-1 black-span2 f16 fw500">当日 19:00</div>
                            </div>
                            <div class="flex items-stretch">
                                <div class="arrival-time-item flex-1 black-span2 f16 fw500">0:00 - 15:00 (自然日)</div>
                                <div class="arrival-time-item flex-1 black-span2 f16 fw500">当日 19:00</div>
                            </div>
                            <div class="arrival-time-p tertiary-span3">支持7*24h(包括香港、大陆节假日)提款,按以下规则进行打款款;其中节假日目前只能受理业务,到账为工作日, 上述表格中展示的时间为北京时间。</div>
                        </div>
                        <template #reference>
                            <el-link type="primary" underline="never" class="underline-dotted mt12">Explanation of Arrival Time</el-link>
                        </template>
                    </el-popover>
                </div>
            </div>


            <div class="mb32" :class="{ pl16: isMobile, pr16: isMobile, pl32: !isMobile, pr32: !isMobile }">
                <div class="fee-container">
                    <p class="flex items-center">
                        <span class="tertiary-span2">{{ $t('withdraw.applyFormFeeModuleWithdrawalLabel') }}</span>
                        <span class="flex-center"></span>
                        <span class="tertiary-span2 fw600">${{ currencyFormat(form.applyAmt) }}</span>
                        <span class="flex-center-20"></span>
                    </p>
                    <p class="p flex-box mt8">
                        <span class="tertiary-span2">{{ $t('withdraw.applyFormFeeModuleFeeLabel') }}</span>
                        <span class="flex-center"></span>
                        <span :class="[ defaultWithdrawFee === fee ? 'tertiary-span2' : 'green-span', 'fw600' ]"> ${{ currencyFormat(fee) }}</span>
                        <span class="flex-center-20"></span>
                    </p>
                    <div class="flex mt2">
                        <span class="flex-center-4"></span>
                        <div v-if="defaultWithdrawFee !== fee" class="fee-sub tertiary-span flex-1">
                            <div class="flex items-center">
                                <span>{{ $t('withdraw.applyFormFeeModuleStandardFeeLabel') }}</span>
                                <span class="flex-center"></span>
                                <span>${{ currencyFormat(defaultWithdrawFee) }}</span>
                                <span class="flex-center-20"></span>
                            </div>
                            <div v-if="membershipFeeDiff" class="flex items-center mt2">
                                <span>{{ $t('withdraw.applyFormFeeModuleMembershipFeeLabel') }}</span>
                                <span class="flex-center"></span>
                                <span>-${{ currencyFormat(membershipFeeDiff) }}</span>
                                <span class="flex-center-20"></span>
                            </div>
                            <div v-if="couponFeeDiff" class="flex items-center cursor-pointer mt2" @click="showDiscountDetailsDialog">
                                <span>{{ $t('withdraw.applyFormFeeModuleCouponFeeLabel', { rate: feeData.discountNumber }) }}</span>
                                <span class="flex-center"></span>
                                <span>-${{ currencyFormat(couponFeeDiff) }}</span>
                                <div class="lh0 direction-rotate180">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
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
                        <span class="tertiary-span2 f16 fw600">${{ currencyFormat(actualWithdrawAmount) }}</span>
                        <span class="flex-center-20"></span>
                    </p>
                    <p class="flex items-center tertiary-span2 mt8">
                        <span>{{ $t('withdraw.applyFormFeeModuleMessage') }}</span>
                        <span class="flex-center-20"></span>
                    </p>
                </div>
            </div>

            <div v-show="hasSuccessBankcardData" class="mb32" :class="{ pl32: !isMobile, pr32: !isMobile }">
                <div class="account-container">
                    <div class="account-container-part1">
                        <el-form-item :label="$t('withdraw.applyFormMessageAccountUlTitle')" class="form-item"></el-form-item>
                        <p class="account-p">
                            {{ $t('withdraw.applyFormMessageAccountUlTip') }}
                        </p>
                    </div>
                    <AccountWithdrawAccountUl
                            @obtainedData="obtainedData"
                            @select="selectBankcardData"
                    ></AccountWithdrawAccountUl>
                </div>
            </div>

            <el-form-item :label="$t('withdraw.applyFormLabelAccountHolderName')" prop="accountName" class="form-item">
                <el-input
                    v-model="form.accountName"
                    :maxlength="35"
                    class="form-input input-default"
                    @change="e => { form.accountName = e.trim() }"
                    @blur="risk_control_check('accountName')"
                />
            </el-form-item>
            <div class="account-number-container">
                <el-form-item :label="$t('withdraw.applyFormLabelAccountNumber')" prop="accountNumber" class="form-item account-number direction-ltr-input">
                    <el-input
                        v-model="form.accountNumber"
                        class="form-input input-default"
                        :placeholder="$t('withdraw.applyFormPlaceholderAccountNumber')"
                        @input="e => { form.accountNumber = formatCreditCardNumber(e);clearIntervalForCardIconCycle()}"
                        @blur="triggerCycle()"
                    >
                        <template #prefix>
                            <img
                                :src="cardIcon"
                                class="card-icon"
                            >
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('withdraw.applyFormLabelSWIFTCodeOrBIC')" prop="swiftCode" class="form-item code">
                    <el-input
                        v-model="form.swiftCode"
                        class="form-input input-default"
                        @input="e => { form.swiftCode = formatSWIFTCode(e) }"
                    />
                </el-form-item>
            </div>
            <el-form-item :label="$t('withdraw.applyFormLabelBankName')" prop="bankName" class="form-item">
                <el-input
                    v-model="form.bankName"
                    :maxlength="35+8"
                    class="form-input input-default"
                    @change="e => { form.bankName = e.trim() }"
                    @blur="risk_control_check('bankName')"
                />
            </el-form-item>
            <el-form-item :label="$t('withdraw.applyFormLabelCity')" prop="openingBankCity" class="form-item">
                <el-input
                    v-model="form.openingBankCity"
                    :maxlength="35"
                    class="form-input input-default"
                    @change="e => { form.openingBankCity = e.trim() }"
                />
            </el-form-item>
            <el-form-item :label="$t('withdraw.applyFormLabelAddress')" prop="openingBankAddress" class="form-item">
                <el-input
                    v-model="form.openingBankAddress"
                    :maxlength="70"
                    class="form-input input-default"
                    @change="e => { form.openingBankAddress = e.trim() }"
                />
            </el-form-item>
            <el-form-item class="form-buttons">
                <el-button v-if="isMobile" key="msubmit" type="primary" class="button-default m-adaptive" :loading="loading" :disabled="isGetLevelError || isGetDefaultLevelError" @click="validateApply">{{ $t('withdraw.applyFormButtonSubmit') }}</el-button>
                <el-button class="button-default m-adaptive" @click="jumpToWallet">{{ $t('withdraw.applyFormButtonCancel') }}</el-button>
                <el-button v-if="!isMobile" key="pcsubmit" type="primary" class="button-default m-adaptive" :loading="loading" :disabled="isGetLevelError || isGetDefaultLevelError" @click="validateApply">{{ $t('withdraw.applyFormButtonSubmit') }}</el-button>
            </el-form-item>
        </FormValidate>
    </div>
      <AccountWithdrawVerifyTipDialog
              v-model="isShowVerifyGialog"
              @submit="apply"
      ></AccountWithdrawVerifyTipDialog>
      <AccountWithdrawErrorLevelDialog v-model="isShowErrorLevelDialog"></AccountWithdrawErrorLevelDialog>
      <AccountWithdrawErrorAreaDialog v-model="isShowErrorAreaDialog"></AccountWithdrawErrorAreaDialog>
      <AccountWithdrawDiscountDetailsDialog
        v-if="isShowDiscountDetailsDialog"
        v-model="isShowDiscountDetailsDialog"
        :membershipCardNo="membershipCardNo"
        :membershipCardData="membershipCardData"
        @change="changeSelectCoupon"
      ></AccountWithdrawDiscountDetailsDialog>
</div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
* {
    box-sizing: border-box;
}
.w-160 {
    width: 160px;
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
    &.f16 {
        font-size: 16px;
        line-height: 24px;
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
                padding: 20px 6px 8px;
                border-radius: 0;
                margin: 0 -16px 32px;
                .account-container-part1 {
                    padding: 0 14px 20px;
                }
            }
            .account-number-container {
                display: block;
                .account-number {
                    width: 100%;
                }
                .code {
                    width: 100%;
                    margin-bottom: 16px;
                }
            }
            .form-buttons {
                margin: 56px 0 16px;
                .button-default {
                    margin: 0;
                    + .button-default {
                        margin: 12px 0 0;
                    }
                }
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
        padding: 20px 14px 8px;
        border-radius: 8px;
        background-color: #F2F4F7;
        margin-bottom: 32px;
        .account-container-part1 {
            padding: 0 6px 20px;
        }
        .form-item {
            margin-bottom: 0;
        }
        .account-p {
            color: #475467;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
            margin: 0;
        }
    }
    .account-number-container {
        display: flex;
        justify-content: space-between;
        .account-number {
            /*flex: 1;*/
            width: calc(100% - 176px);
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
        .code {
            width: 160px;
            /*margin-left: 16px;*/
        }
    }
    .location-container {
        :deep(.el-select__selected-item) {
            display: flex;
            align-items: center;
        }
        .location-icon {
            margin-right: 8px;
            .rtl & {
                margin-left: 8px;
                margin-right: 0;
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
        margin: 32px -6px 0;
        :deep(.el-form-item__content) {
            justify-content: right;
            .rtl & {
                justify-content: left;
            }
        }
        .button-default {
            margin: 0 6px;
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
