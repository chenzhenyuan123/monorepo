<script setup>
import { checkResponseData, currencyFormat, errorMessage, accurate_add } from "@/util/index.js"
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


// 是否显示“获取等级错误”弹窗
const isShowErrorLevelDialog = ref(true)


// 手续费
const fee = ref(0)
const isGetFee = ref(false)
// 查询手续费
const qryWithdrawFee = async () => {
    if (!isSWIFTCode(form.swiftCode, countryCodeArr.value)) {
        fee.value = 0
        isGetFee.value = false
        return
    }
    const result = await withdrawApi.qryWithdrawFee({swiftCode: form.swiftCode})
    if (result?.success) {
        fee.value = result.data?.withdrawFee || 0
        isGetFee.value = true
    } else if (result?.code === 'FA1002') {
        isShowErrorLevelDialog.value = true
    } else {
        errorMessage(result?.message)
    }
    formValidateRef.value?.formRef?.validateField('swiftCode')
}
// 默认等级手续费
const defaultWithdrawFee = ref(0)
const isGetDefaultWithdrawFee = ref(false)
// 查询默认等级手续费
const qryDefaultWithdrawFee = async () => {
    const result = await withdrawApi.qryDefaultWithdrawFee()
    if (result?.success) {
        defaultWithdrawFee.value = result.data?.withdrawFee || 0
        isGetDefaultWithdrawFee.value = true
    } else if (result?.code === 'FA1002') {
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
    qryWithdrawFee()
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
  } else if (value && isGetFee.value && !(fee.value > 0)) {
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
        isShowVerifyGialog.value = true
    })
}
// 提现申请
const apply = async (checkCode) => {
    loading.value = true

    const result = await withdrawApi.apply(Object.assign({}, form, {
        withdrawFee: fee.value,
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


onMounted(()=>{
    nextTick(() => {
        settingStore.setFormPage(true)
    })
    getAllCountry()
    qryBalance()
    setIntervalForCardIconCycle()
    qryDefaultWithdrawFee()
    // errorMessage(123, 0)
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
                        <template #suffix>USD</template>
                    </el-input>
                </el-form-item>
                <p class="amount-p">
                    {{ $t('withdraw.applyFormMessageWithdrawalAmount1') }} USD {{ currencyFormat(ableBalanceAmount) }}
                    <br>
                    <br>
                    {{ $t('withdraw.applyFormMessageWithdrawalAmount2') }} ${{ currencyFormat(limitAmount) }} USD.
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
                        @change="qryWithdrawFee"
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
                <p class="p flex-box mb4">
                    {{ $t('withdraw.applyFormMessageFee1') }}
                    <span class="flex-center-6"></span>
                    ${{ currencyFormat(actualWithdrawAmount) }} USD
                </p>
                <p class="p flex-box mb8">
                    {{ $t('withdraw.applyFormMessageFee2') }}
                    <span class="flex-center-6"></span>
                    <span class="success"> ${{ currencyFormat(fee) }} USD</span>
                    <span class="flex-center-6"></span>
                    <del>${{ currencyFormat(defaultWithdrawFee) }} USD</del>
                </p>
                <p class="p">{{ $t('withdraw.applyFormMessageFee3') }}</p>
            </div>
            <el-form-item class="form-buttons">
                <el-button v-if="isMobile" key="msubmit" type="primary" class="button-default m-adaptive" :loading="loading" @click="validateApply">{{ $t('withdraw.applyFormButtonSubmit') }}</el-button>
                <el-button class="button-default m-adaptive" @click="jumpToWallet">{{ $t('withdraw.applyFormButtonCancel') }}</el-button>
                <el-button v-if="!isMobile" key="pcsubmit" type="primary" class="button-default m-adaptive" :loading="loading" @click="validateApply">{{ $t('withdraw.applyFormButtonSubmit') }}</el-button>
            </el-form-item>
        </FormValidate>
    </div>
      <AccountWithdrawVerifyTipDialog
              v-model="isShowVerifyGialog"
              @submit="apply"
      ></AccountWithdrawVerifyTipDialog>
      <AccountWithdrawErrorLevelDialog v-model="isShowErrorLevelDialog"></AccountWithdrawErrorLevelDialog>
</div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
* {
    box-sizing: border-box;
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
