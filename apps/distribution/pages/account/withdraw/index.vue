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
const isMobile = useIsMobile()
const formValidateRef = ref()
const isShowVerifyGialog = ref(false)
const limitAmount = ref(50)
const ableBalanceAmount = ref(0)
const loading = ref(false)
const form = reactive({
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
const defaultFeeDiff = ref(0)
const membershipFeeDiff = ref(0)
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
        defaultFeeDiff.value = accurate_add(defaultWithdrawFee.value, -feeData.value.receivableFee) || 0
        membershipFeeDiff.value = accurate_add(feeData.value.receivableFee, -feeData.value.withdrawFee) || 0
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
        <div class="title-container">
            <el-link type="primary" class="back-link" @click="jumpToWallet">
                <el-icon><Back /></el-icon>
                {{ $t('withdraw.applyBack') }}
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
            <div class="amount-container">
                <el-form-item :label="$t('withdraw.applyFormLabelWithdrawalAmount')" prop="applyAmt" class="form-item">
                    <el-input
                        v-model="form.applyAmt"
                        class="form-input input-default"
                        @input="e => { form.applyAmt = getNumberByInput(e)}"
                    >
                        <template #prefix>$</template>
                    </el-input>
                </el-form-item>
                <p class="amount-p">
                    {{ $t('withdraw.applyFormMessageWithdrawalAmount1') }} ${{ currencyFormat(ableBalanceAmount) }}
                    <br>
                    <br>
                    {{ $t('withdraw.applyFormMessageWithdrawalAmount2') }} ${{ currencyFormat(limitAmount) }}.
                </p>
            </div>
            <div v-show="hasSuccessBankcardData" class="account-container">
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
            <el-form-item :label="$t('withdraw.applyFormLabelCountryOrRegion')" prop="openingBankCountry" class="form-item location-container">
                <el-select
                    v-model="form.openingBankCountry"
                    placeholder=""
                    filterable
                    class="form-input select-default"
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
            <div class="fee-container">
                <p class="p flex-box">
                    {{ $t('withdraw.applyFormFeeModuleWithdrawalLabel') }}
                    <span class="flex-center"></span>
                    ${{ currencyFormat(form.applyAmt) }}
                </p>
                <template v-if="isGetFee">
                    <p class="p flex-box mt8">
                        {{ $t('withdraw.applyFormFeeModuleFeeLabel') }}
                        <span class="flex-center"></span>
                        <span v-if="defaultWithdrawFee === fee"> ${{ currencyFormat(fee) }}</span>
                        <span v-else class="flex items-center">
                            <span class="success"> ${{ currencyFormat(fee) }}</span>
                            <span class="flex-center-6"></span>
                            <del>${{ currencyFormat(defaultWithdrawFee) }}</del>
                        </span>
                    </p>
                    <div v-if="defaultFeeDiff" class="p flex-box mt8">
                        <span class="flex-center"></span>
                        <span>-${{ currencyFormat(defaultFeeDiff) }}</span>
                    </div>
                    <div v-if="membershipFeeDiff" class="p flex-box cursor-pointer mt8" @click="showDiscountDetailsDialog">
                        <span class="flex-center"></span>
                        <span>-${{ currencyFormat(membershipFeeDiff) }}</span>
                        <div class="lh0">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div v-if="feeData.receivableFee > 0 && membershipCardData.length && !membershipCardNo" class="flex mt4">
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
                    </div>
                </template>
                <p class="p flex-box mt8">
                    {{ $t('withdraw.applyFormFeeModuleReceivedLabel') }}
                    <span class="flex-center"></span>
                    ${{ currencyFormat(actualWithdrawAmount) }}
                </p>
                <p class="p mt8">{{ $t('withdraw.applyFormFeeModuleMessage') }}</p>
            </div>
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
.grey-span {
    color: #667085;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
}
.page {
    padding: 32px 0;
    &.m {
        padding: 16px 0;
        .title-container {
            margin: 0 16px 32px;
        }
        .form {
            padding: 0 16px;
            .amount-container {
                margin: 0 -16px 32px;
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
    margin: 0 32px 32px;
    .back-link {
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        margin: 0 -6px 24px;
        .el-icon {
            font-size: 20px;
            margin: 0 6px;
        }
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
    padding: 0 32px;
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
    }
    .amount-container {
        padding: 20px;
        border-radius: 8px;
        background-color: #F9FAFB;
        margin-bottom: 32px;
        .form-item {
            margin-bottom: 0;
            /*&.is-error {*/
            /*    margin-bottom: 16px;*/
            /*}*/
            :deep(.el-input__wrapper) {
                .el-input__prefix {
                    padding: 0 8px 0 14px;
                }
                .el-input__inner {
                    padding-left: 0;
                    padding-right: 0;
                }
                .el-input__suffix {
                    padding: 0 14px;
                }
            }
        }
        .amount-p {
            color: #475467;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
            margin: 6px 0 0;
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
        margin-top: 32px;
        .p {
            color: #475467;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
            .success {
                color: #079455;
            }
            del {
                color: #667085;
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
</style>
