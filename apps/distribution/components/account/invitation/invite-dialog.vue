<script setup>
import { CloseBold, Check } from '@element-plus/icons-vue';
import { checkResponseData, copyToClipboard, arrToDict, errorMessage } from "@/util/index.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isMobile = useIsMobile()
const { clientApi } = useApi()
const props = defineProps({
})
const attrs = useAttrs()
const form = reactive({
    storeId: undefined
})
const isCopySuccess = ref(false)
const inviteData = reactive({
    // 分销员佣金比例
    distributorCommissionRateStr: '',
    bindingStoreList: [
        // {
        //     // 店铺id
        //     storeId: undefined,
        //     // 店铺名称
        //     storeName: undefined,
        //     // 用户编号 分销员
        //     userNo: undefined,
        //     // 分享链接
        //     signupUrl: undefined,
        // }
    ]

})
const bindingStoreToObj = computed(() => {
    return arrToDict(inviteData.bindingStoreList, { value: 'storeId', label: null })
})
const inviteItemData = computed(() => {
     return bindingStoreToObj.value[form.storeId] || {}
})

// 邀请店铺下拉列表
const getInviteData = async() => {
    const result = await clientApi.bind_listStoresToInvite()
    const res = checkResponseData(result)
    if (res) {
        res.bindingStoreList = res.bindingStoreList || []
        res.bindingStoreList.forEach(item => {
            item.label = item.storeName ? `${item.storeName}（${item.storeId}）` : item.storeId
        });
        Object.assign(inviteData, res)
        // if (inviteData.bindingStoreList.length) {
        //     form.storeId = inviteData.bindingStoreList[0].storeId
        // }
    }
}
const cancel = () => {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}
// 提交
const submit = () => {
    if (!inviteItemData.value.signupUrl) {
        errorMessage(t('invitation.inviteDialogMessageSelectStore'))
        return
    }

    const isCopy = copyToClipboard(inviteItemData.value.signupUrl)
    if (isCopy) {
        isCopySuccess.value = true
        setTimeout(() => {
            cancel()
        }, 500)
    }
}

getInviteData()

</script>

<template>
  <div class="dialog-container">
    <el-dialog
    v-bind="$attrs"
    width="688px"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :class="{ 'm': isMobile }"
    >
        <template #header="{ close }">
            <el-icon class="close-container" @click="close"><CloseBold /></el-icon>
            <span class="icon-container">
                <img src="@/assets/imgs/users-plus.svg" alt="">
            </span>
            <h1>{{$t('invitation.inviteDialogtitle')}}</h1>
        </template>

        <el-form
            :model="form"
            label-position="top"
            class="dialog-form"
            novalidate
        >
            <el-form-item :label="$t('invitation.inviteDialogLabelStore')" class="dialog-form-item">
                <el-select
                    v-model="form.storeId"
                    placeholder=""
                    class="select-default"
                >
                    <el-option
                        v-for="item in inviteData.bindingStoreList"
                        :key="item.storeId"
                        :value="item.storeId"
                        :label="item.label"
                    />
                </el-select>
                <div class="dialog-form-item-p">{{$t('invitation.inviteDialogDescribeStoreBefore')}} <span class="dialog-form-item-span-primary direction-ltr direction-inline-block">10</span> {{$t('invitation.inviteDialogDescribeStoreafter')}}</div>
            </el-form-item>
            <el-form-item :label="$t('invitation.inviteDialogLabelLink')" class="dialog-form-item">
                <el-input
                    v-model="inviteItemData.signupUrl"
                    class="dialog-form-input input-default"
                    readonly
                />
                <div class="dialog-form-item-p">{{$t('invitation.inviteDialogDescribeLink')}}</div>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="!isMobile" id="invitation-btn-pc-dialog-cancel" class="dialog-footer-button button-default dialog-adaptive" @click="cancel">{{$t('invitation.inviteDialogButtonCancel')}}</el-button>
                <el-button type="primary" id="invitation-btn-dialog-copy" class="dialog-footer-button button-default dialog-adaptive" :disabled="!inviteData.bindingStoreList.length" @click="submit">
                    <template v-if="isCopySuccess" #icon>
                        <Check />
                    </template>
                    <template v-if="isCopySuccess">
                        {{$t('invitation.inviteDialogButtonCopied')}}
                    </template>
                    <template v-else>
                        {{$t('invitation.inviteDialogButtonCreatAndCopy')}}
                    </template>
                </el-button>
                <el-button v-if="isMobile" id="invitation-btn-m-dialog-cancel" class="dialog-footer-button button-default dialog-adaptive" @click="cancel">{{$t('invitation.inviteDialogButtonCancel')}}</el-button>
            </div>
        </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
.dialog-container :deep(.el-dialog) {
    max-width: calc(100% - 16px);
    padding: 0;
    border-radius: 12px;
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03);
    background-color: #FFF;
    background-image: url('@/assets/imgs/bg-cricles.svg');
    background-position: 0 0;
    background-repeat: no-repeat;
    &.m {
    .el-dialog__footer {
        padding: 24px 16px 16px;
    }
    .dialog-footer {
        display: block;
        .dialog-footer-button {
            width: 100%;
            + .dialog-footer-button {
                margin: 12px 0 0;
            }
        }
    }
    }
    .el-dialog__header {
        padding: 24px 24px 20px 24px;
        .close-container {
            position: absolute;
            top: 16px;
            right: 16px;
            padding: 10px;
            cursor: pointer;
            font-size: 24px;
            color: #98A2B3;
            &:hover {
                color: #5548FF;
            }
        }
        .icon-container {
            display: inline-block;
            padding: 11px;
            border-radius: 10px;
            border: 1px solid #E4E7EC;
            background: #FFF;
            box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
            margin-bottom: 16px;
        }
        h1 {
            color: #101828;
            font-size: 18px;
            font-weight: 600;
            line-height: 28px; /* 155.556% */
        }
    }
    .el-dialog__body {
        padding: 0 24px;
    }
    .el-dialog__footer {
        padding: 32px 24px 24px;
    }
    .dialog-form {
        .dialog-form-item {
            margin-bottom: 0;
            + .dialog-form-item {
                margin-top: 20px;
            }
        }
        .el-form-item__label {
            color: #344054;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px; /* 142.857% */
            margin-bottom: 6px;
        }
        .dialog-form-input {
            .el-input__wrapper {
                background-color: #F9FAFB;
                .el-input__inner {
                    color: #5548FF;
                }
            }
        }
        .dialog-form-item-p {
            color: #475467;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
            margin-top: 8px;
            .dialog-form-item-span-primary {
                color: #5548FF;
                font-weight: 700;
            }
        }
    }
    .dialog-footer {
        display: flex;
        justify-content: space-between;
        .dialog-footer-button {
            flex: 1;
            + .dialog-footer-button {
                margin: 0 0 0 12px;
            }
        }
    }
}
.rtl .dialog-container :deep(.el-dialog) {
    .el-dialog__header {
        .close-container {
            left: 16px;
            right: auto;
        }
    }

    .dialog-footer {
        .dialog-footer-button {
            + .dialog-footer-button {
                margin: 0 12px 0 0;
            }
        }
    }
}
</style>
