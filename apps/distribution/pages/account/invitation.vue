<script setup>
  import { Search } from '@element-plus/icons-vue';
import { checkResponseData } from "@/util/index.js"
import { formatDate } from "@/util/dateUtil.js"
import { useI18n } from "vue-i18n";
  import {arrToDict} from "@flylinking/core/utils/common";

const { t } = useI18n();
const isMobile = useIsMobile()
const { clientApi } = useApi()


const isShowInviteGialog = ref(false)


const formData = ref({})
const sharePatternData = computed(() => {
  return [
    { value: 'parent', label: t('invitation.RewardTypeDataHierarchical') },
    { value: 'peer', label: t('invitation.RewardTypeDataPeer') },
  ]
})
const sharePatternToLabel = computed(() => {
  return arrToDict(sharePatternData.value)
})
const table = ref()
const hasTableData = ref(false)
const reload = () => table.value.reload()
const query = () => table.value.query()
const reset = () => {
  formData.value = {}
  query()
}

// 获取表格数据
const request = async({ pageNo, pageSize }) => {
  const result = await clientApi.invitation_listInvitation({
    ...formData.value,
    pageNo,
    pageSize
  })

  const res = checkResponseData(result)

  if (res) {
    const { total, list = [] } = res
    if(total > 0) hasTableData.value = true
    return {
      list,
      pageSize,
      total,
      pageNo
    }
  }
}
</script>

<template>
  <div :class="{ 'page': true, 'm': isMobile }">
    <div class="title-container">
      <h1>{{$t('invitation.title')}}</h1>
      <p>{{$t('invitation.titleMessage')}}</p>
      <p>{{$t('invitation.titleMessage1')}}</p>
      <p>{{$t('invitation.titleMessage2')}}</p>
    </div>
    <el-button id="invitation-btn-invite" type="primary" class="invitation-button button-has-icon" @click="isShowInviteGialog = true">
      <template #icon>+</template>
      {{$t('invitation.invite')}}
    </el-button>
    <h2 class="mb4">{{$t('invitation.history')}}</h2>
    <div class="tertiary-span f16 mb16">{{$t('invitation.historyMessage')}}</div>
    <TableForm class="table-container" :is-empty="!hasTableData">
      <el-form v-if="!isMobile && hasTableData" ref="formRef" :model="formData" :inline="true" label-position="top" novalidate>
        <el-form-item :label="$t('invitation.formLabelID')" style="width: 220px;">
          <el-input
            v-model="formData.storeId"
            clearable
            :placeholder="$t('invitation.formLabelID')"
            :suffix-icon="Search"
            @keyup.enter.native="query"
            @clear="query"
          />
        </el-form-item>
        <el-form-item :label="$t('invitation.formLabelType')" style="width: 220px;">
          <el-select
            v-model="formData.sharePattern"
            clearable
            :placeholder="$t('invitation.formLabelType')"
            @change="query"
          >
            <el-option v-for="item in sharePatternData" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
<!--        <div class="flex-1"></div>-->
<!--        <el-form-item label=" " class="button-container">-->
<!--          <el-button @click="query">{{$t('invitation.formButtonFilter')}}</el-button>-->
<!--          <el-button link @click="reset">{{$t('invitation.formButtonReset')}}</el-button>-->
<!--        </el-form-item>-->
      </el-form>
      <pro-table
        ref="table"
        :request="request"
        :is-show-empty="true"
      >
        <el-table-column prop="storeName" :label="$t('invitation.tableLabelStoreName')" min-width="320">
          <template #default="{ row }">
            {{ row.storeName }}（{{row.storeId}}）
          </template>
        </el-table-column>
        <el-table-column prop="email" :label="$t('invitation.tableLabelEmail')" min-width="320"/>
        <el-table-column prop="userName" :label="$t('invitation.tableLabelName')" min-width="320"/>
        <el-table-column prop="sharePattern" :label="$t('invitation.tableLabelType')" min-width="200">
          <template #default="{ row }">
            {{ sharePatternToLabel[row.sharePattern] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('invitation.tableLabelDate')" min-width="200">
          <template #default="{ row }">
            <span class="direction-ltr direction-inline-block">{{ formatDate(row.createTime) }}</span>
          </template>
        </el-table-column>
      </pro-table>
    </TableForm>
    <AccountInvitationInviteDialog
      v-if="isShowInviteGialog"
      v-model="isShowInviteGialog"
    ></AccountInvitationInviteDialog>
  </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
* {
    box-sizing: border-box;
}
.tertiary-span {
  color: #475467;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.f16 {
    font-size: 16px;
    line-height: 24px;
  }
}
.page {
    &.m {
        padding: 0 16px;
        .title-container {
            margin: 0 0 24px;
            h1 {
                font-size: 24px;
                line-height: 32px;
            }
        }
        .invitation-button {
            margin-bottom: 24px;
        }
        .table-container {
            margin-bottom: 24px;
        }
    }
    > h2 {
        color: #101828;
        font-size: 18px;
        font-weight: 600;
        line-height: 28px; /* 155.556% */
    }
}
.title-container {
    margin: 32px 0;
    h1 {
        color: #101828;
        font-size: 30px;
        font-weight: 600;
        line-height: 38px; /* 126.667% */
        margin: 0 0 4px;
    }
    p {
        color: #475467;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px; /* 150% */
    }
}
.invitation-button {
    margin-bottom: 32px;
}
.table-container {
    margin-bottom: 32px;
}
</style>