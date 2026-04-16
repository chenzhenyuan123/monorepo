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
import {arrToDict} from "@flylinking/core/utils/common";
import {isUseless, removeSpace} from "@flylinking/core/utils/dataUtil";
import {isAccountNameAndSpece, isValidZipcode} from "@flylinking/core/utils/validate";
import { debounce } from 'throttle-debounce'
import { useUserStore } from '@/store/userState.js'

const { t, locale } = useI18n();
const { userApi, withdrawApi, countryApi } = useApi()
const settingStore = useSettingStore()
const router = useRouter()
const route = useRoute()
const isMobile = useIsMobile()
const userStore = useUserStore()

// 传入币种
const exchangeAccount = ref(route.query?.currency || 'USD')


const formValidateRef = ref()
const isShowVerifyGialog = ref(false)
const isShowAccountTypeDialog = ref(false)
const isShowSaveAddressDialog = ref(false)
const isShowSomethingErrorDialog = ref(false)
const loading = ref(false)
const form = reactive({
    withdrawType: 'Bank_Account',
    openingBankCountry: undefined,
    accountCurrency: exchangeAccount.value,
    applyAmt: undefined,
    withdrawCurrency: exchangeAccount.value,
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
watch(() => form.applyAmt, () => {
    // 提现金额变化，更新手续费、换汇金额等
    setIntervalForGetFeeLater()
})
watch(() => form.withdrawCurrency, () => {
    // 币种变化，更新手续费、汇率等
    setIntervalForGetFee()
    qrySettleConfigList(form.withdrawCurrency)
})


// 是否账户币种为USD
const isAccountCurrencyUSD = ref(form.accountCurrency === 'USD')
const isBankAccount = computed(() => {
    return form.withdrawType === 'Bank_Account'
})
watch(isBankAccount, () => {
    if (!isBankAccount.value && form.withdrawCurrency !== 'USD') {
        // 如果提现方式选择的是PayPal，到账币种只能是USD，不可修改
        form.withdrawCurrency = 'USD'
    } else {
        // 提现类型变化，更新手续费、汇率等
        setIntervalForGetFee()
    }
    if (form.openingBankCountry) formValidateRef.value?.formRef?.validateField('openingBankCountry')
    //
    if (isBankAccount.value) {
        formValidateRef.value?.formRef?.validateField('withdrawType')
    } else {
        risk_control_check('bankName')
    }
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
watch(isMustIndividualForAccountHolderType, () => {
    if (isMustIndividualForAccountHolderType.value && form.accountHolderType !== 'Individual') form.accountHolderType = 'Individual'
})
const isDeffCurrency = computed(() => {
    return form.accountCurrency !== form.withdrawCurrency
})


const hasSuccessBankcardData = ref(false)
const obtainedData = (bol) => {
    hasSuccessBankcardData.value = bol
}


const ableBalanceAmount = ref(0)
// 查询可用佣金
const qryBalanceList = () => {
    withdrawApi.qryBalanceList().then((result) => {
        const res = checkResponseData(result) || []
        res.some(item => {
            if (item.currency === form.accountCurrency) {
                ableBalanceAmount.value = item.availableBalance || 0
                return true
            }
        })
    })
}


const withdrawCurrencyListData = ref([])
// 查询到账币种列表
const qryCreditedCurrencyList = () => {
    return withdrawApi.qryCreditedCurrencyList().then((result) => {
        const res = checkResponseData(result)
        withdrawCurrencyListData.value = res || []
    })
}


const limitAmount = ref(0)
const isApplyAmtAble = computed(() => {
    return !isUseless(form.applyAmt) && form.applyAmt >= limitAmount.value && form.applyAmt <= ableBalanceAmount.value
})
// 查询币种最小可提现金额
const qryMinWithdrawalAmount = (currency) => {
    return withdrawApi.qryMinWithdrawalAmount({ currency }).then((result) => {
        const res = checkResponseData(result) || {}
        limitAmount.value = res.minWithdrawalAmount || 0
    })
}


const dayTypeDict = computed(() => {
    return {
        1: t('arrivalTime.weekday'),
        2: t('arrivalTime.nonWorkingDay'),
        3: t('arrivalTime.calendarDay'),
    }
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
    setIntervalForGetFee()
}
function qryMembershipCardData() {
    withdrawApi.listMembershipCardPage().then(result => {
        membershipCardData.value = checkResponseData(result) || []
    })
}


// 默认等级手续费
const defaultWithdrawFee = ref(0)
// 手续费
const fee = ref(0)
const feeData = ref({})
const isGetFee = ref(false)
const isGetLevelError = ref(false)
// 是否显示“获取等级错误”弹窗
const isShowErrorLevelDialog = ref(false)
// 查询手续费
function qryWithdrawFee() {
    isGetFee.value = false
    if (!isApplyAmtAble.value) {
        feeData.value = {}
        return
    }
    withdrawApi.qryWithdrawFee({
        accountCurrency: form.accountCurrency,
        applyAmt: form.applyAmt,
        withdrawCurrency: form.withdrawCurrency,
        withdrawType: form.withdrawType,
        cardNo: membershipCardNo.value
    }).then(result => {
        if (result?.success) {
            feeData.value = result.data || {}
            defaultWithdrawFee.value = result.data?.v0ReceivableFee || 0
            fee.value = result.data?.withdrawFee || 0
            isGetFee.value = true
            isGetLevelError.value = false
        } else if (result?.code === 'FA1002') {
            isGetLevelError.value = true
            isShowErrorLevelDialog.value = true
        } else {
            isGetLevelError.value = true
            errorMessage(result?.message)
        }
    }).finally(() => {
        formValidateRef.value?.formRef?.validateField('applyAmt')
    })
}
const rateRefreshData = ref({
    // 显示延时时间
    timerShow: false,
    // 轮循时间
    times: 30,
    // 30 秒内获取验证码
    timerCount: 30,
    timer: null,
})
function setIntervalForGetFee(times = rateRefreshData.value.times) {
    // 取消倒计时
    clearIntervalForGetFee()
    qryWithdrawFee()
    // 同币种不用轮循
    if (!isDeffCurrency.value) return
    // 重置时间
    rateRefreshData.value.timerCount = times
    rateRefreshData.value.timerShow = true
    rateRefreshData.value.timer = setInterval(() => {
        if (rateRefreshData.value.timerCount > 1) {
            rateRefreshData.value.timerCount--
        } else {
            setIntervalForGetFee()
        }
    }, 1000)
}
function clearIntervalForGetFee() {
    clearInterval(rateRefreshData.value.timer)
    rateRefreshData.value.timerShow = false
}
const setIntervalForGetFeeLater = debounce(300, setIntervalForGetFee)


// 风控校验记录
const checkResultData = reactive({
    accountName: true,
    bankName: true,
    openingBankCountry: true,
})
// 风控校验
const risk_control_check = (key) => {
    const obj = {}
    if (!isBankAccount.value && key === 'bankName') {
        obj.bankName = 'PayPal'
    } else {
        obj[key] = form[key]
    }
    // 空值不需要校验
    if (isUseless(obj[key])) return
    withdrawApi.risk_control_check(obj).then(result => {
        checkResultData[key] = checkResponseData(result)
        if (!isBankAccount.value && key === 'bankName') {
            formValidateRef.value?.formRef?.validateField('withdrawType')
        } else {
            formValidateRef.value?.formRef?.validateField(key)
        }
    })
}


const countryData = ref([])
// const countryDataByLang = computed(() => {
//     const key = locale.value === 'zh-CN' ? 'zhCn' : 'enUs'
//     return countryData.value.map(item => {
//         return { ...item, name: item[key] }
//     })
// })
const countryCodeArr = ref([])
const countryToName = ref({})
const currencyToCountryId = ref({})
// 获取所有国家列表
function getAllCountry() {
    countryApi.getAllCountry().then(result => {
        const res = checkResponseData(result)
        if (res) {
            // 展示所有国家列表，去除中国大陆
            countryData.value = res.filter(item => item.countryId !== 'CN')
            countryToName.value = arrToDict(countryData.value, { value: 'countryId', label: 'enUs' })
            currencyToCountryId.value = arrToDict(countryData.value, { value: 'currency', label: 'countryId' })
            countryCodeArr.value = countryData.value.map(item => item.countryId.toLowerCase())
        }
    })
}
const paypalCountryData = ref([])
const paypalCountryDict = ref({})
// 获取PayPal支持的国家列表
function listPaypalCountry() {
    countryApi.listPaypalCountry().then(result => {
        const res = checkResponseData(result)
        if (res) {
            paypalCountryData.value = res
            paypalCountryDict.value = arrToDict(paypalCountryData.value, { value: 'countryId', label: null })
        }
    })
}
const provinceData = ref([])
const provinceToZipCode = ref({})
const provinceToName = ref({})
const nameToProvince = ref({})
function getBaseProvinceByCountry(countryId) {
    return countryApi.getProvinceByCountry(countryId).then(result => {
        const res = checkResponseData(result)
        if (res) {
            provinceData.value = res
            provinceToZipCode.value = arrToDict(provinceData.value, { value: 'provinceId', label: 'zipCode' })
            provinceToName.value = arrToDict(provinceData.value, { value: 'provinceId', label: 'enUs' })
            nameToProvince.value = arrToDict(provinceData.value, { value: 'enUs', label: 'provinceId' })
        }
    })
}
function countryChange() {
    getBaseProvinceByCountry(form.openingBankCountry)
    form.bankState = undefined
}
function provinceChange() {
    const zip = provinceToZipCode.value[form.bankState]
    if (!form.zip && zip) form.zip = zip
}


// 账户图标轮循
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


// 选中记录地址
function selectBankcardData(obj) {
    Object.assign(form, {
        accountType: obj.accountType,
        accountHolderType: obj.accountHolderType,
        accountName: obj.accountName,
        bankState: nameToProvince.value[obj.bankState],
        zip: obj.zip,
        // openingBankCountry: obj.openingBankCountry,
        openingBankCity: obj.openingBankCity,
        openingBankAddress: obj.openingBankAddress,
    })
    if (isBankAccount.value) {
        Object.assign(form, {
            bankName: obj.bankName,
            accountNumber: formatCreditCardNumber(obj.accountNumber),
            routingNumber: obj.routingNumber,
            swiftCode: obj.swiftCode,
            bankCode: obj.bankCode,
            branchBankCode: obj.branchBankCode,
        })
        risk_control_check('bankName')
        triggerCycle()
    } else {
        Object.assign(form, {
            birthDate: obj.birthDate,
            paypalAccount: obj.accountNumber,
        })
        clearIntervalForCardIconCycle()
    }
    risk_control_check('accountName')
    risk_control_check('openingBankCountry')
}


const rules = () => {
    return {
        withdrawType: [
            {
                validator: (rule, value, callback) => {
                    if (value && !isBankAccount.value && !checkResultData.bankName) {
                        callback(new Error(t('withdraw.applyFormValidateRiskManagement')))
                    } else {
                        callback()
                    }
                },
                trigger: 'change'
            }
        ],
        applyAmt: [
            {
                required: true,
                message: t('withdraw.applyFormRequiredWithdrawalAmount'),
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value && !(value >= limitAmount.value)) {
                        callback(new Error(t('withdraw.applyFormValidateAmountMin') + ' ' + form.withdrawCurrency + ' ' + currencyFormat(limitAmount.value)))
                    } else if (value && value > ableBalanceAmount.value) {
                        callback(new Error(t('withdraw.applyFormValidateAmountMax') + ' ' + form.withdrawCurrency + ' ' + currencyFormat(ableBalanceAmount.value)))
                    } else if (feeData.value.arriveAmt <= 0) {
                        callback(new Error(t('withdraw.applyFormValidateArriveAmountMin', { min: 0 })))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur'
            }
        ],
        accountHolderType: [
            {
                required: true,
                message: t('withdraw.pleaseSelect'),
                trigger: 'change',
            },
        ],
        birthDate: [
            {
                required: true,
                message: t('withdraw.pleaseSelect'),
                trigger: 'change',
            },
        ],
        paypalAccount: [
            {
                required: true,
                message: t('withdraw.pleaseEnter'),
                trigger: 'blur',
            },
        ],
        bankName: [
            {
                validator: (rule, value, callback) => {
                    if (form.withdrawCurrency === 'USD' && !value) {
                        callback(new Error(t('withdraw.applyFormRequiredBankName')))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur'
            },
            {
                validator: (rule, value, callback) => {
                    if (value && hasChinese(value)) {
                        callback(new Error(t('withdraw.applyFormValidateNotChinese')))
                    } else if (value && !checkResultData.bankName) {
                        callback(new Error(t('withdraw.applyFormValidateRiskManagement')))
                    } else {
                        callback()
                    }
                },
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
                validator: (rule, value, callback) => {
                    if (value && !checkResultData.accountName) {
                        callback(new Error(t('withdraw.applyFormValidateRiskManagement')))
                    } else if (value && !isAccountNameAndSpece(value)) {
                        // callback(new Error(t('withdraw.applyFormValidateEnglish')))
                        callback(new Error(''))
                    } else {
                        callback()
                    }
                },
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
                validator: (rule, value, callback) => {
                    if (value && !isCardIconMatch.value) {
                        if (hasCountryCodeForIBAN(value)) {
                            callback(new Error(t('withdraw.applyFormValidateIBANError')))
                        } else {
                            callback(new Error(t('withdraw.applyFormValidateFormatError')))
                        }
                    } else {
                        callback()
                    }
                },
                trigger: 'blur'
            }
        ],
        openingBankCountry: [
            {
                required: true,
                message: t('withdraw.applyFormRequiredCountryOrRegion'),
                trigger: 'change',
            },
            {
                validator: (rule, value, callback) => {
                    if (value) {
                        if (!checkResultData.openingBankCountry) {
                            callback(new Error(t('withdraw.applyFormValidateRiskManagement')))
                        } else if (!isBankAccount.value && !paypalCountryDict.value[form.openingBankCountry]) {
                            callback(new Error(t('withdraw.applyFormValidatePaypalCountry')))
                        } else {
                            callback()
                        }
                    } else {
                        callback()
                    }
                },
                trigger: 'change'
            }
        ],
        openingBankCity: [
            {
                required: true,
                message: t('withdraw.applyFormRequiredCity'),
                trigger: 'blur',
            },
            {
                validator: (rule, value, callback) => {
                    if (value && !isCityName(value)) {
                        callback(new Error(t('withdraw.applyFormValidateFormatError')))
                    } else {
                        callback()
                    }
                },
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
                validator: (rule, value, callback) => {
                    if (value && hasChinese(value)) {
                        callback(new Error(t('withdraw.applyFormValidateNotChinese')))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur'
            }
        ],
        bankState: [
            {
                validator: (rule, value, callback) => {
                    if (value || form.withdrawCurrency !== 'USD') {
                        callback()
                    } else {
                        callback(new Error(t('withdraw.pleaseSelect')))
                    }
                },
                trigger: 'change'
            },
        ],
        zip: [
            {
                validator: (rule, value, callback) => {
                    if (value || form.withdrawCurrency !== 'USD') {
                        callback()
                    } else if (!isValidZipcode(value)){
                        callback(new Error(t("profile.zipcodeLimit")))
                    } else {
                        callback(new Error(t('withdraw.pleaseEnter')))
                    }
                },
                trigger: 'blur'
            },
        ],
        routingNumber: [
            {
                validator: (rule, value, callback) => {
                    if (value || (isBankAccount.value && form.swiftCode)) {
                        callback()
                    } else {
                        callback(new Error(t('withdraw.pleaseEnter')))
                    }
                },
                trigger: 'blur'
            },
            {
                validator: (rule, value, callback) => {
                    if (value && value?.length !== 9) {
                        callback(new Error(''))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur'
            }
        ],
        swiftCode: [
            {
                validator: (rule, value, callback) => {
                    if (value || (isShowRoutingNumber.value && form.routingNumber)) {
                        callback()
                    } else {
                        callback(new Error(t('withdraw.applyFormRequiredSWIFTCodeOrBIC')))
                    }
                },
                trigger: 'blur'
            },
            {
                validator: (rule, value, callback) => {
                    if (value && !isSWIFTCode(value, countryCodeArr.value)) {
                        callback(new Error(t('withdraw.applyFormValidateSWIFTCodeOrBICError')))
                    } else if (value && isGetFee.value && !(fee.value >= 0)) {
                        callback(new Error(t('withdraw.applyFormValidateSWIFTCodeOrBICError')))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur'
            }
        ],
        bankCode: [
            {
                required: true,
                message: t('withdraw.pleaseEnter'),
                trigger: 'blur',
            },
        ],
        branchBankCode: [
            {
                required: true,
                message: t('withdraw.pleaseEnter'),
                trigger: 'blur',
            },
        ],
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

    return ibanCounty === swiftCodeCounty && ibanCounty === openingBankCountry
}


// 提现申请前校验
const validateApply = () => {
    formValidateRef.value?.formRef?.validate((valid) => {
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
const apply = (checkCode) => {
    clearIntervalForGetFee()
    loading.value = true

    const params = {
        withdrawType: form.withdrawType,
        openingBankCountry: form.openingBankCountry,
        accountCurrency: form.accountCurrency,
        applyAmt: form.applyAmt,
        withdrawCurrency: form.withdrawCurrency,
        arriveAmt: feeData.value.arriveAmt,
        //
        accountHolderType: form.accountHolderType,
        accountName: form.accountName,
        zip: form.zip,
        openingBankCity: form.openingBankCity,
        openingBankAddress: form.openingBankAddress,
        //
        exchangeAmt: feeData.value.exchangeAmt,
        exchangeRate: feeData.value.exchangeRate,
        withdrawFee: fee.value,
        receivableFee: feeData.value.receivableFee,
        cardNo: membershipCardNo.value,
        discountNumber: feeData.value.discountNumber,
        checkCode
    }
    if (isBankAccount.value) {
        Object.assign(params, {
            bankName: form.bankName,
            accountNumber: normalCreditCardNumber(form.accountNumber),
            swiftCode: form.swiftCode,
        })
    } else {
        Object.assign(params, {
            birthDate: form.birthDate,
            accountNumber: form.paypalAccount,
        })
    }
    if (isShowAccountType.value) params.accountType = form.accountType
    if (isShowBankCode.value) params.bankCode = form.bankCode
    if (isShowBranchBankCode.value) params.branchBankCode = form.branchBankCode
    if (form.bankState) params.bankState = provinceToName.value[form.bankState]
    if (isShowRoutingNumber.value) params.routingNumber = form.routingNumber
    params.saveFlag = form.saveFlag ? 'Y' : 'N'

    withdrawApi.apply(params).then(result => {
        withdrawSubmitResult(result)
    }).finally(() => {
        loading.value = false
    })

}
function withdrawSubmitResult(result = {}) {
    // const res = checkResponseData(result, 'NO_RETURN_DATA')
    withdrawResultData.value = result.data || {}
    if (result.success) {
        if (result.data?.changedExchangeRate) {
            // 汇率变化
            isShowRateUpdateDialog.value = true
        } else {
            // 成功
            router.push({
                path: '/account/withdraw/result',
                query: {
                    success: 1,
                    withdrawNo: withdrawResultData.value.withdrawNo,
                    currency: form.withdrawCurrency,
                    estPaymentAmt: withdrawResultData.value.estPaymentAmt,
                    applyWithdrawTime: withdrawResultData.value.applyWithdrawTime
                }
            })
        }
    } else if (result.code === '核销提现券失败') {
        // 核销提现券失败
        isShowSomethingErrorDialog.value = true
    } else {
        // 失败
        router.push({
            path: '/account/withdraw/result',
            query: {
                success: 0
            }
        })
    }
}
const isShowRateUpdateDialog = ref(false)
const withdrawResultData = ref({})
const isWithdrawConfirm = ref(false)
// 提现确认/取消
function withdrawConfirm(isConfirm) {
    isWithdrawConfirm.value = isConfirm
    loading.value = true
    const params = {
        id: withdrawResultData.value.id,
        checkToken: withdrawResultData.value.checkToken,
        isConfirm
    }
    withdrawApi.confirm(params).then(result => {
        if (isWithdrawConfirm.value) {
            withdrawSubmitResult(result)
        } else {
            if (checkResponseData(result, 'NO_RETURN_DATA')) jumpToWallet()
        }
    }).finally(() => {
        loading.value = false
    })

}
function jumpToWallet() {
    router.push({
        path: '/account/wallet'
    })
}


onMounted(async ()=>{
    await console.log('onMounted')
    nextTick(() => {
        settingStore.setFormPage(true)
    })
    getAllCountry()
    listPaypalCountry()
    qryBalanceList()
    qryCreditedCurrencyList()
    qryMinWithdrawalAmount(form.accountCurrency)
    qrySettleConfigList(form.withdrawCurrency)
    setIntervalForCardIconCycle()
    qryMembershipCardData()
    userStore.getUserInfo()
    form.paypalAccount = userStore.userInfo.loginAccount
})

onUnmounted(()=>{
    settingStore.setFormPage(false)
    clearIntervalForCardIconCycle()
    clearIntervalForGetFee()
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
                            <el-radio value="PayPal" border :class="{ 'flex-1': !isMobile,'w-full': isMobile }" :disabled="!isAccountCurrencyUSD">
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
                          @change="risk_control_check('openingBankCountry');countryChange()"
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
                              v-show="isBankAccount || paypalCountryDict[item.countryId]"
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
                                <el-option :value="form.accountCurrency" :label="form.accountCurrency">
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
                              v-model="form.applyAmt"
                              class="form-input input-default"
                              @input="e => { form.applyAmt = getNumberByInput(e)}"
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                    <p class="tertiary-span2 mt8">
                        {{ $t('withdraw.applyFormMessageWithdrawalAmount1') }} {{ form.accountCurrency }} {{ currencyFormat(ableBalanceAmount) }}
                    </p>
                    <p class="tertiary-span2 mt12">
                        {{ $t('withdraw.applyFormMessageWithdrawalAmount2') }} {{ form.accountCurrency }} {{ currencyFormat(limitAmount) }}.
                    </p>
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
                              :disabled="!isBankAccount || !isAccountCurrencyUSD"
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
                                  v-for="item in withdrawCurrencyListData"
                                  :key="item"
                                  :value="item"
                                  :label="item"
                                >
                                    <div class="flex items-center gap8">
                                        <div class="circle-country-icon-container size-20">
                                            <img :src="flagUrl(currencyToCountryId[item])">
                                        </div>
                                        <span>{{ item }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" " class="form-item empty-label flex-1">
                            <el-input
                              :value="feeData.arriveAmt ? currencyFormat(feeData.arriveAmt) : ''"
                              class="form-input input-default"
                              disabled
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                    <p v-if="isDeffCurrency && feeData.exchangeRate && rateRefreshData.timerShow" class="tertiary-span2 mt12">
                        {{$t('withdraw.applyFormMessageExchangeRate')}} ({{ rateRefreshData.timerCount }}s) :  {{ form.accountCurrency }} 1 ≈ {{ form.withdrawCurrency }} {{ feeData.exchangeRate }}
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
            <div v-if="isApplyAmtAble && isGetFee" class="mb32" :class="{ pl16: isMobile, pr16: isMobile, pl32: !isMobile, pr32: !isMobile }">
                <div class="fee-container">
                    <p class="flex items-center">
                        <span class="tertiary-span2">{{ $t('withdraw.applyFormFeeModuleWithdrawalLabel') }}</span>
                        <span class="flex-center"></span>
                        <span class="tertiary-span2 fw600">
                            {{ form.accountCurrency }} {{ currencyFormat(form.applyAmt) }}
                            <template v-if="isDeffCurrency"> ≈ {{ form.withdrawCurrency }} {{ currencyFormat(feeData.exchangeAmt) }}</template>
                        </span>
                        <span class="flex-center-20"></span>
                    </p>
                    <p class="p flex-box mt8">
                        <span class="tertiary-span2">{{ $t('withdraw.applyFormFeeModuleFeeLabel') }}</span>
                        <span class="flex-center"></span>
                        <span :class="[ defaultWithdrawFee === fee ? 'tertiary-span2' : 'green-span', 'fw600' ]">{{ form.withdrawCurrency }} {{ currencyFormat(fee) }}</span>
                        <span class="flex-center-20"></span>
                    </p>
                    <div class="flex mt2">
                        <span class="flex-center-4"></span>
                        <div v-if="defaultWithdrawFee !== fee" class="fee-sub tertiary-span flex-1">
                            <div class="flex items-center">
                                <span>{{ $t('withdraw.applyFormFeeModuleStandardFeeLabel') }}</span>
                                <span class="flex-center"></span>
                                <span>{{ form.withdrawCurrency }} {{ currencyFormat(defaultWithdrawFee) }}</span>
                                <span class="flex-center-20"></span>
                            </div>
                            <div v-if="feeData.membershipBenefitDeductionAmt" class="flex items-center mt2">
                                <span>{{ $t('withdraw.applyFormFeeModuleMembershipFeeLabel') }}</span>
                                <span class="flex-center"></span>
                                <span>- {{ form.withdrawCurrency }} {{ currencyFormat(feeData.membershipBenefitDeductionAmt) }}</span>
                                <span class="flex-center-20"></span>
                            </div>
                            <div v-if="feeData.discountAmt" class="flex items-center cursor-pointer mt2" @click="showDiscountDetailsDialog">
                                <span>{{ $t('withdraw.applyFormFeeModuleCouponFeeLabel', { rate: feeData.discountNumber }) }}</span>
                                <span class="flex-center"></span>
                                <span>- {{ form.withdrawCurrency }} {{ currencyFormat(feeData.discountAmt) }}</span>
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
                        <span class="tertiary-span2 f16 fw600">{{ form.withdrawCurrency }} {{ currencyFormat(feeData.arriveAmt) }}</span>
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
                        <el-radio value="Business" :disabled="isMustIndividualForAccountHolderType">{{$t('withdraw.business')}}</el-radio>
                    </el-radio-group>
                    <div v-if="isSpecialForAccountHolderType" class="tertiary-span2 w-full">{{$t('withdraw.applyFormMessageAccountHolderType')}}</div>
                </el-form-item>
                <el-form-item :label="isBankAccount ? $t('withdraw.applyFormLabelBankAccountName') : $t('withdraw.applyFormLabelAccountHolderName')" prop="accountName" class="form-item">
                    <el-input
                      v-model="form.accountName"
                      :maxlength="100"
                      class="form-input input-default"
                      :placeholder="isBankAccount ? $t('withdraw.applyFormLabelBankAccountName') : $t('withdraw.applyFormLabelAccountHolderName')"
                      @change="e => { form.accountName = e.trim().replace(/\s+/g, ' ') }"
                      @blur="risk_control_check('accountName')"
                    />
                    <div class="tertiary-span2 w-full mt6">{{$t('withdraw.applyFormMessageBankAccountName', { num1: 100, num2: 1 })}}</div>
                </el-form-item>
                <el-form-item v-if="isBankAccount" :label="$t('withdraw.applyFormLabelBankName')" prop="bankName" class="form-item">
                    <el-input
                      v-model="form.bankName"
                      :maxlength="35+8"
                      class="form-input input-default"
                      @change="e => { form.bankName = e.trim() }"
                      @blur="risk_control_check('bankName')"
                    />
                </el-form-item>
                <el-form-item v-if="isBankAccount" :label="$t('withdraw.applyFormLabelAccountNumber')" prop="accountNumber" class="form-item account-number direction-ltr-input">
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
                      v-model="form.paypalAccount"
                      class="form-input input-default"
                      placeholder=""
                      @change="e => { form.paypalAccount = e.trim() }"
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
                    <el-form-item
                      :label="(isBankAccount ? $t('withdraw.applyFormLabelBankState') : $t('withdraw.applyFormLabelState')) + (form.withdrawCurrency === 'USD' ? '' : (' ('+$t('withdraw.optional')+')'))"
                      prop="bankState"
                      class="form-item flex-1 ellipsis-label"
                      style="margin-bottom: 0;overflow: hidden"
                    >
                        <el-select
                          v-model="form.bankState"
                          :placeholder="(isBankAccount ? $t('withdraw.applyFormLabelBankState') : $t('withdraw.applyFormLabelState')) + (form.withdrawCurrency === 'USD' ? '' : (' ('+$t('withdraw.optional')+')'))"
                          filterable
                          class="form-input select-default h44"
                          @change="provinceChange()"
                        >
                            <el-option
                              v-for="item in provinceData"
                              :key="item.provinceId"
                              :value="item.provinceId"
                              :label="item.enUs"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                      :label="$t('withdraw.applyFormLabelZip') + (form.withdrawCurrency === 'USD' ? '' : (' ('+$t('withdraw.optional')+')'))"
                      prop="zip"
                      class="form-item w-180 ellipsis-label"
                      style="margin-bottom: 0"
                    >
                        <el-input
                          v-model="form.zip"
                          :maxlength="12"
                          class="form-input input-default"
                          :placeholder="$t('withdraw.applyFormLabelZip') + (form.withdrawCurrency === 'USD' ? '' : (' ('+$t('withdraw.optional')+')'))"
                          @change="e => { form.zip = e.trim() }"
                        />
                        <div class="tertiary-span2 w-full mt6">{{$t('withdraw.maxMessage', { num: 12 })}}</div>
                    </el-form-item>
                </div>
                <el-form-item :label="isBankAccount ? $t('withdraw.applyFormLabelCity') : $t('withdraw.applyFormLabelCityOfAccountHolder')" prop="openingBankCity" class="form-item">
                    <el-input
                      v-model="form.openingBankCity"
                      :maxlength="35"
                      class="form-input input-default"
                      :placeholder="isBankAccount ? $t('withdraw.applyFormLabelCity') : $t('withdraw.applyFormLabelCityOfAccountHolder')"
                      @change="e => { form.openingBankCity = e.trim() }"
                    />
                </el-form-item>
                <el-form-item :label="isBankAccount ? $t('withdraw.applyFormLabelAddress') : $t('withdraw.applyFormLabelAddressOfAccountHolder')" prop="openingBankAddress" class="form-item">
                    <el-input
                      v-model="form.openingBankAddress"
                      :maxlength="70"
                      class="form-input input-default"
                      :placeholder="isBankAccount ? $t('withdraw.applyFormLabelAddress') : $t('withdraw.applyFormLabelAddressOfAccountHolder')"
                      @change="e => { form.openingBankAddress = e.trim() }"
                    />
                </el-form-item>
                <el-form-item v-if="isShowRoutingNumber" :label="$t('withdraw.applyFormLabelRoutingNumber')" prop="routingNumber" class="form-item">
                    <el-input
                      v-model="form.routingNumber"
                      :maxlength="9"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormLabelRoutingNumber')"
                      @change="e => { form.routingNumber = removeSpace(e) }"
                    />
                    <div class="tertiary-span2 w-full mt6">{{$t('withdraw.onlyCharactersMessage', { num: 9 })}}</div>
                </el-form-item>
                <el-form-item v-if="isBankAccount" :label="$t('withdraw.applyFormLabelSWIFTCodeOrBIC')" prop="swiftCode" class="form-item">
                    <el-input
                      v-model="form.swiftCode"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormLabelSWIFTCodeOrBIC')"
                      @input="e => { form.swiftCode = formatSWIFTCode(e) }"
                    />
                </el-form-item>
                <el-form-item v-if="isShowBankCode" :label="$t('withdraw.applyFormLabelBankCode')" prop="bankCode" class="form-item">
                    <el-input
                      v-model="form.bankCode"
                      :maxlength="11"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormLabelBankCode')"
                      @change="e => { form.bankCode = e.trim() }"
                    />
                    <div class="tertiary-span2 w-full mt6">{{$t('withdraw.maxMessage', { num: 11 })}}</div>
                </el-form-item>
                <el-form-item v-if="isShowBranchBankCode" :label="$t('withdraw.applyFormLabelBranchCode')" prop="branchBankCode" class="form-item">
                    <el-input
                      v-model="form.branchBankCode"
                      :maxlength="11"
                      class="form-input input-default"
                      :placeholder="$t('withdraw.applyFormLabelBranchCode')"
                      @change="e => { form.branchBankCode = e.trim() }"
                    />
                    <div class="tertiary-span2 w-full mt6">{{$t('withdraw.maxMessage', { num: 11 })}}</div>
                </el-form-item>
                <el-checkbox v-model="form.saveFlag" class="checkbox-default">
                    <div class="flex items-center gap4">
                        <span>{{ $t('withdraw.applyFormSaveForNextTime') }}</span>
                        <div class="lh0 cursor-pointer" @click.stop="isShowSaveAddressDialog = true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7.36035 0.00878906C9.14993 0.099534 10.7626 0.862255 11.9502 2.0498C13.2169 3.31657 14 5.06702 14 7L13.9912 7.36035C13.9005 9.14993 13.1378 10.7626 11.9502 11.9502L11.707 12.1816C10.4639 13.3116 8.81225 14 7 14L6.63965 13.9912C4.9693 13.9065 3.45321 13.2362 2.29297 12.1816L2.0498 11.9502C0.862255 10.7626 0.099534 9.14993 0.00878906 7.36035L0 7C0 5.06702 0.783057 3.31657 2.0498 2.0498C3.31657 0.783057 5.06702 0 7 0L7.36035 0.00878906ZM7 1.5C5.48083 1.5 4.1083 2.11438 3.11133 3.11133C2.11438 4.1083 1.5 5.48083 1.5 7C1.5 8.51918 2.11438 9.89172 3.11133 10.8887C4.1083 11.8856 5.48083 12.5 7 12.5C8.51917 12.5 9.89172 11.8856 10.8887 10.8887C11.8856 9.89172 12.5 8.51917 12.5 7C12.5 5.48083 11.8856 4.1083 10.8887 3.11133C9.89172 2.11438 8.51918 1.5 7 1.5ZM7.0752 8.89844C7.5534 8.8986 7.92771 9.25862 7.92773 9.72266C7.92773 10.1867 7.55341 10.5467 7.0752 10.5469C6.59683 10.5469 6.22266 10.1868 6.22266 9.72266C6.22268 9.25852 6.59684 8.89844 7.0752 8.89844ZM7.22656 3.45703C8.54319 3.45708 9.42871 4.20047 9.42871 5.31348C9.42862 6.0001 9.12041 6.5068 8.43848 6.91406C7.82777 7.28338 7.65723 7.51581 7.65723 7.96094V8.27344H6.41211L6.40234 7.96094C6.36919 7.16997 6.59663 6.75781 7.22656 6.37891C7.83749 6.00476 8.00293 5.78646 8.00293 5.35547C8.00274 4.92477 7.65276 4.63102 7.1416 4.63086C6.62061 4.63086 6.27451 4.95806 6.24609 5.46484H4.97656C4.99551 4.21919 5.85776 3.45703 7.22656 3.45703Z" fill="#817F86"/>
                            </svg>
                        </div>
                    </div>
                </el-checkbox>
            </div>

            <div class="form-buttons" :class="{ pl16: isMobile, pr16: isMobile, pl24: !isMobile, pr24: !isMobile }">
                <el-button class="button-default m-adaptive" style="margin: 0" @click="jumpToWallet">{{ $t('withdraw.applyFormButtonCancel') }}</el-button>
                <el-button type="primary" class="button-default m-adaptive" style="margin: 0" :loading="loading" :disabled="!(isGetFee && !isGetLevelError)" @click="validateApply">{{ $t('withdraw.applyFormButtonSubmit') }}</el-button>
            </div>
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
      <AccountWithdrawAccountTypeDialog v-model="isShowAccountTypeDialog"></AccountWithdrawAccountTypeDialog>
      <AccountWithdrawSaveAddressDialog v-model="isShowSaveAddressDialog"></AccountWithdrawSaveAddressDialog>
      <AccountWithdrawRateUpdateDialog
        v-model="isShowRateUpdateDialog"
        :originalExchangeRate="withdrawResultData.originalExchangeRate"
        :rate="withdrawResultData.changedExchangeRate"
        :currency="form.withdrawCurrency"
        :amount="withdrawResultData.changedEstEntryAmt"
        @submit="withdrawConfirm(true)"
        @cancel="withdrawConfirm(false)"
      ></AccountWithdrawRateUpdateDialog>
      <AccountWithdrawSomethingErrorDialog
        v-model="isShowSomethingErrorDialog"
        @submit="jumpToWallet"
      ></AccountWithdrawSomethingErrorDialog>
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
* {
    box-sizing: border-box;
}
.w-160 {
    width: 160px;
    min-width: 160px;
}
.w-180 {
    width: 180px;
    min-width: 180px;
}
.w-480 {
    width: 480px;
    min-width: 480px;
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
        &.ellipsis-label {
            :deep(.el-form-item__label) {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 100%;
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
