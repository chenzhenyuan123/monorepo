<script setup>
    import {formatCreditCardNumber, normalCreditCardNumber} from "@/util/dataUtil";
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

    const props = defineProps({
        successBankcardItem: {
            type: Object,
            default: () => ({
                // id: 1,
                // accountName: 'qwe',
                // accountNumber: '123123123123',
                // bankName: 'asdfsgsdg'
            })
        },
        active: {
            type: Boolean,
            default: false
        }
    })
    const isMobile = useIsMobile()
    const { t } = useI18n();
    const { withdrawApi } = useApi()
    const emit = defineEmits(["delete", "select"])

    const isShowDeleteGialog = ref(false)

    const isRTL = useState('isRTL', () => {
        return false
    })

    const delBankcard = () => {
        emit('delete')
    }
    const selectBankcard = () => {
        emit('select')
    }
    const dropdownRef = ref();
    const showdropdown = () => {
        dropdownRef.value?.handleOpen?.()
        // 可以在此阻止后续点击事件
        // e.preventDefault();
    }
    const showDeleteDialog = () => {
        isShowDeleteGialog.value = true
    }

    const cardIcon = (accountNumber) => {
        const cardNum = normalCreditCardNumber(accountNumber)
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
    }
    onMounted(()=>{
    })
</script>

<template>
        <li>
            <div
                    class="account-li-item"
                    :class="{ active: active, m: isMobile }"
                    @click="selectBankcard"
            >
                <img :src="cardIcon(successBankcardItem.accountNumber)" alt="" class="account-li-item-icon">
                <div class="account-li-item-content">
                    <p class="account-li-item-p bold">{{ successBankcardItem.accountName }}</p>
                    <p class="account-li-item-p">{{ successBankcardItem.accountNumber }}</p>
                    <p class="account-li-item-p bold">{{ successBankcardItem.bankName }}</p>
                </div>
                <div class="account-li-item-icon-last" @click.stop>
                    <el-dropdown ref="dropdownRef" :placement="isRTL ? 'bottom-start' : 'bottom-end'" trigger="click" popper-class="dropdown-class">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9.99935 10.8333C10.4596 10.8333 10.8327 10.4602 10.8327 9.99992C10.8327 9.53968 10.4596 9.16659 9.99935 9.16659C9.53911 9.16659 9.16602 9.53968 9.16602 9.99992C9.16602 10.4602 9.53911 10.8333 9.99935 10.8333Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9.99935 4.99992C10.4596 4.99992 10.8327 4.62682 10.8327 4.16659C10.8327 3.70635 10.4596 3.33325 9.99935 3.33325C9.53911 3.33325 9.16602 3.70635 9.16602 4.16659C9.16602 4.62682 9.53911 4.99992 9.99935 4.99992Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9.99935 16.6666C10.4596 16.6666 10.8327 16.2935 10.8327 15.8333C10.8327 15.373 10.4596 14.9999 9.99935 14.9999C9.53911 14.9999 9.16602 15.373 9.16602 15.8333C9.16602 16.2935 9.53911 16.6666 9.99935 16.6666Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <template #dropdown>
                            <el-dropdown-menu @click="showDeleteDialog">
                                <el-dropdown-item>{{ $t('withdraw.applyFormMessageAccountUlButtonDelete') }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>

            <AccountWithdrawDeleteAccountDialog
                    v-if="isShowDeleteGialog"
                    v-model="isShowDeleteGialog"
                    :successBankcardItem="successBankcardItem"
                    @submit="delBankcard"
            ></AccountWithdrawDeleteAccountDialog>

        </li>
</template>

<style lang="scss">
    @use "@/assets/css/element-reset/popper.scss" as *;
    @use "@/assets/css/element-reset/form.scss" as *;
</style>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    li {
        .account-li-item {
            display: flex;
            height: 92px;
            min-width: 320px;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #E4E7EC;
            background: #FFF;
            cursor: pointer;
            &.m {
                .account-li-item-icon {
                    width: 34px;
                    min-width: 34px;
                    height: 24px;
                }
                .account-li-item-content {
                    max-width: 242px;
                }
            }
            &.active {
                border: 2px solid #776CFF;
                box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
                cursor: default;
            }
            .account-li-item-icon {
                display: block;
                width: 46px;
                min-width: 46px;
                height: 32px;
            }
            .account-li-item-icon-last {
                width: 24px;
                min-width: 24px;
                height: 24px;
                border-radius: 4px;
                border: 2px solid transparent;
                &:hover, &:active {
                    border-color: #776CFF;
                }
            }
            .account-li-item-content {
                flex: 1;
                /*padding: 0 4px 0 12px;*/
                /*max-width: 206px;*/
                padding: 0 12px;
                max-width: 230px;
                .account-li-item-p {
                    color: #475467;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    &.bold {
                        color: #344054;
                        font-weight: 500;
                    }
                }
            }
        }
    }
</style>