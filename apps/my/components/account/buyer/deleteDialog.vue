<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isMobile = useIsMobile()
const attrs = useAttrs()
const emit = defineEmits(['delete'])

const submit = () => {
    emit('delete')
    cancel()
}

const cancel = () => {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}

</script>

<template>
  <div class="dialog-container">
    <el-dialog
    v-bind="$attrs"
    width="359px"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :class="{ 'm': isMobile }"
    >
        <template #header="{ close }">
            <el-icon class="close-container" @click="close"><CloseBold /></el-icon>
            <span class="icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#F04438" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <h1>{{$t('profile.shippingAddressDeleteDialogTitle')}}</h1>
            <p>{{$t('profile.shippingAddressDeleteDialogMessage')}}</p>
        </template>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="danger" id="profile-btn-dialog-delete" class="dialog-footer-button button-default dialog-adaptive" @click="submit">{{$t('profile.shippingAddressDeleteDialogBtnDelete')}}</el-button>
                <div class="flex-center-12"></div>
                <el-button id="profile-btn-dialog-cancel" class="dialog-footer-button button-default dialog-adaptive" @click="cancel">{{$t('profile.shippingAddressDeleteDialogBtnBack')}}</el-button>
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
        /*.dialog-footer {*/
        /*    display: block;*/
        /*    .dialog-footer-button {*/
        /*        width: 100%;*/
        /*        + .dialog-footer-button {*/
        /*            margin: 12px 0 0;*/
        /*        }*/
        /*    }*/
        /*}*/
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
        p {
            color: #475467;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            margin-top: 4px;
        }
    }
    .el-dialog__body {
        padding: 0 24px;
    }
    .el-dialog__footer {
        padding: 32px 24px 24px;
    }
    .dialog-footer {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
        .dialog-footer-button {
            flex: 1;
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
