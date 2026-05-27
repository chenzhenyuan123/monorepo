<script setup>
import { checkResponseData } from "@/util/index.js"
import { formatDate } from "@/util/dateUtil.js"

const isMobile = useIsMobile()
const { clientApi } = useApi()
const dialogVisible = ref(false)
const currentRow = ref() // 当前操作的表格行
const table = ref()
const formData = reactive({})
const isShowInviteGialog = ref(false)

const reload = () => table.value.reload()
const query = () => table.value.query()

// 获取表格数据
const request = async({ pageNo, pageSize }) => {
  const result = await clientApi.invitation_listInvitation({
    ...formData,
    pageNo,
    pageSize
  })

  const res = checkResponseData(result)

  if (res) {
    const { total, list = [] } = res
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
        </div>
        <el-button id="invitation-btn-invite" type="primary" class="invitation-button button-has-icon" @click="isShowInviteGialog = true">
            <template #icon>+</template>
            {{$t('invitation.invite')}}
        </el-button>
        <h2>{{$t('invitation.history')}}</h2>
        <div class="table-container">
            <pro-table
                ref="table"
                :request="request"
                :is-show-empty="true"
            >
                <el-table-column prop="email" :label="$t('invitation.tableLabelEmail')"
                 min-width="320" />
                <el-table-column prop="userName" :label="$t('invitation.tableLabelName')"
                 min-width="320" />
                <el-table-column prop="createTime" :label="$t('invitation.tableLabelDate')"
                 min-width="200">
                    <template #default="{ row }">
                        <span class="direction-ltr direction-inline-block">{{ formatDate(row.createTime) }}</span>
                    </template>
                </el-table-column>
            </pro-table>
        </div>
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
        margin-bottom: 24px;
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