<script setup>
    import {checkResponseData} from "@/util";

    const { withdrawApi } = useApi()
    const emit = defineEmits(["obtainedData", "select"])

    const currentAccountId = ref()
    /**
     * id: 1,
     * accountName: 'qwe',
     * accountNumber: '123123123123',
     * bankName: 'asdfsgsdg'
     */
    const successBankcardData = ref([
    ])

    // 查询提现成功卡列表
    const qryBankcard = async() => {
        const result = await withdrawApi.success_bankcard_listPage({
            pageNo: 1,
            pageSize: 10
        })
        const res = checkResponseData(result)
        successBankcardData.value = res.list || []
        if (successBankcardData.value.length) emit('obtainedData', true)
    }

    // 删除提现成功卡记录
    const delBankcard = async({ id }) => {
        const result = await withdrawApi.success_bankcard_delete(id)
        if (checkResponseData(result, 'NO_RETURN_DATA')) {
            qryBankcard()
        }
    }
    const selectBankcard = async({ id }) => {
        currentAccountId.value = id
        const result = await withdrawApi.success_bankcard_get(id)
        const res = checkResponseData(result)
        if (res) {
            emit('select', {
                accountName: res.accountName,
                accountNumber: res.accountNumber,
                bankName: res.bankName,
                swiftCode: res.swiftCode,
                openingBankCountry: res.openingBankCountry,
                openingBankCity: res.openingBankCity,
                openingBankAddress: res.openingBankAddress,
            })
        }
    }
    onMounted(()=>{
        qryBankcard()
    })
</script>

<template>
    <ul class="account-ul gap12">
        <AccountWithdrawAccountItem
                v-for="item in successBankcardData"
                :key="item.id"
                :successBankcardItem="item"
                :active="currentAccountId === item.id"
                @select="selectBankcard(item)"
                @delete="delBankcard(item)"
        ></AccountWithdrawAccountItem>
    </ul>
</template>

<style lang="scss" scoped>
    .account-ul {
        overflow-x: auto;
        display: flex;
        align-items: center;
        padding: 0 0 8px;
        &::-webkit-scrollbar {
            background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #ffffff;
        }
    }
</style>