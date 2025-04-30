<script setup>
import { checkResponseData, accurate_add, arrToDict } from "@/util/index.js"
import { formatDate } from "@/util/dateUtil.js"
import { currencyFormat, formatCreditCardNumber } from "@/util/dataUtil.js"
import { Back, Right } from '@element-plus/icons-vue'
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

const { t } = useI18n();
const { userApi, withdrawApi } = useApi()
const settingStore = useSettingStore()
const router = useRouter()
const route = useRoute()
const isMobile = useIsMobile()
const { clientApi } = useApi()
const isShowErrorGialog = ref(false)
const form = reactive({
    applyAmt: undefined,
    accountName: undefined,
    accountNumber: undefined,
    swiftCode: undefined,
    bankName: undefined,
    openingBankCountry: undefined,
    openingBankCity: undefined,
    openingBankAddress: undefined,
    status: undefined,
    withdrawFee: 0,
})
const statusData = computed(() => {
  return [
    { value: 'WITHDRAWING', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'WITHDRAW_ACCEPT_FAIL', label: t('wallet.dataWithdrawStatusPending'), type: 'danger' },
    { value: 'WITHDRAW_ACCEPT_SUCCESS', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUING', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUE_ACCEPT_FAIL', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUE_ACCEPT_SUCCESS', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUE_SUCCESS', label: t('wallet.dataWithdrawStatusSuccess'), type: 'success' },
    { value: 'ISSUE_FAIL', label: t('wallet.dataWithdrawStatusPending'), type: 'danger' },
    { value: 'ISSUE_SUCCESS_RETURN', label: t('wallet.dataWithdrawStatusPending'), type: 'danger' },
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
const actualWithdrawAmount = computed(() => {
    return accurate_add(form.applyAmt, -form.withdrawFee) || 0
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


const flagUrl = (val) => {
  const id = (val).toLowerCase()
  return `https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/flag/${id}.png`
}
// 获取所有国家列表
const getAllCountry = async() => {
    const result = await userApi.getAllCountry()
    const res = checkResponseData(result)
    if (res) {
        res.forEach(item => item.name = item.name || item.enUs)
        locationData.countryData = res
    }
}
// 查询提现详情
const detail = async() => {
  const result = await withdrawApi.detail(route.query.id)
  const res = checkResponseData(result)
  if (res) {
    Object.assign(form, res, {
        formatAccountNumber: formatCreditCardNumber(res.accountNumber)
    })
  }
}
const jumpToWallet = () => {
    router.push({
        path: '/account/wallet'
    })
}
const jumpToCreate = () => {
    router.push({
        path: '/account/withdraw'
    })
}

onMounted(()=>{
    nextTick(() => {
        settingStore.setFormPage(true)
    })
    getAllCountry()
    detail()
})

onUnmounted(()=>{
    settingStore.setFormPage(false)
})
</script>

<template>
  <div :class="{ 'page': true, 'm': isMobile }">
    <div class="content">
        <div class="title-container">
            <el-link type="primary" class="back-link" @click="jumpToWallet">
                <el-icon><Back /></el-icon>
                {{ $t('withdraw.detailBack') }}
            </el-link>
            <h1>{{ $t('withdraw.detailTitle') }}</h1>
            <message v-if="statusType === 'primary'" type="warn" class="message">{{ $t('withdraw.detailMessageProcess') }}</message>
            <message v-else-if="statusType === 'success'" type="success" class="message">{{ $t('withdraw.detailMessageSuccess') }}</message>
            <message v-else-if="statusType === 'danger'" type="error" class="message">
                {{ $t('withdraw.detailMessageError') }}
                <br>
                <el-link type="primary" class="message-link" @click="jumpToCreate">
                    {{ $t('withdraw.detailLinkCreateNew') }}
                    <el-icon><Right /></el-icon>
                </el-link>
            </message>
        </div>
        <el-form
            ref="formRef"
            :model="form"
            label-position="top"
            class="form"
        >
            <el-form-item :label="$t('withdraw.detailFormLabelWithdrawalAmount')" prop="applyAmt" class="form-item amount-container">
                <el-input v-model="form.applyAmt" class="form-input input-default" disabled>
                    <template #prefix>$</template>
                    <template #suffix>USD</template>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('withdraw.detailFormLabelAccountHolderName')" prop="accountName" class="form-item">
                <el-input v-model="form.accountName" class="form-input input-default" disabled />
            </el-form-item>
            <div class="account-number-container">
                <el-form-item :label="$t('withdraw.detailFormLabelAccountNumber')" prop="accountNumber" class="form-item account-number">
                    <el-input v-model="form.formatAccountNumber" class="form-input input-default" disabled>
                        <template #prefix>
                            <img
                                    :src="cardIcon"
                                    class="card-icon"
                            >
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('withdraw.detailFormLabelSWIFTCodeOrBIC')" prop="swiftCode" class="form-item code">
                    <el-input v-model="form.swiftCode" class="form-input input-default" disabled />
                </el-form-item>
            </div>
            <el-form-item :label="$t('withdraw.detailFormLabelBankName')" prop="bankName" class="form-item">
                <el-input v-model="form.bankName" class="form-input input-default" disabled />
            </el-form-item>
            <el-form-item :label="$t('withdraw.detailFormLabelCountryOrRegion')" prop="openingBankCountry" class="form-item location-container">
                <el-select
                    v-model="form.openingBankCountry"
                    placeholder=""
                    class="form-input select-default"
                    disabled
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
            <el-form-item :label="$t('withdraw.detailFormLabelCity')" prop="openingBankCity" class="form-item">
                <el-input v-model="form.openingBankCity" class="form-input input-default" disabled />
            </el-form-item>
            <el-form-item :label="$t('withdraw.detailFormLabelAddress')" prop="openingBankAddress" class="form-item">
                <el-input v-model="form.openingBankAddress" class="form-input input-default" disabled />
            </el-form-item>
            <div class="fee-container">
                <p class="p">{{ $t('withdraw.applyFormMessageFee1') }} ${{ currencyFormat(actualWithdrawAmount) }} USD</p>
                <p class="p b8">{{ $t('withdraw.applyFormMessageFee2') }} ${{ currencyFormat(form.withdrawFee) }} USD</p>
                <p class="p">{{ $t('withdraw.applyFormMessageFee3') }}</p>
            </div>
        </el-form>
    </div>
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
            .account-number-container {
                display: block;
                .account-number {
                    width: 100%;
                }
                .code {
                    width: 100%;
                    margin-left: 0;
                }
            }
            .form-buttons {
                margin: 56px 0 16px;
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
        margin-bottom: 24px;
        .el-icon {
            font-size: 20px;
            margin-right: 6px;
        }
    }
    h1 {
        color: #101828;
        font-size: 30px;
        font-style: normal;
        font-weight: 600;
        line-height: 38px; /* 126.667% */
    }
    .message {
        margin-top: 32px;
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
            margin-bottom: 6px;
        }
    }
    .amount-container {
        padding: 20px;
        border-radius: 8px;
        background-color: #F9FAFB;
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
        .amount-p {
            color: #475467;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
            margin: 6px 0 0;
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
            margin-bottom: 4px;
            &.b8 {
                margin-bottom: 8px;
            }
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .form-buttons {
        :deep(.el-form-item__content) {
            justify-content: right;
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
