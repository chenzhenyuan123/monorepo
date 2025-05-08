<script setup>
import { currencyFormat, previewImg } from "@/util/index.js"

const props = defineProps({
    pageData: {
        type: Object,
        default: () => ({
            pageSize: 5,
        })
    },
    tableData: {
        type: Object,
        default: () => ({
            list: []
        })
    },
    isShowPage: {
        type: Boolean,
        default: true
    }
});
const emit = defineEmits(['pageChange', 'pageSizeChange'])

const pageChange = (pageNo) => {
    emit('pageChange', pageNo)
}

const pageSizeChange = (pageSize) => {
    emit('pageSizeChange', pageSize)
}

</script>

<template>
<article>
    <section v-if="tableData.total > 0" class="order-list">
        <OrderItem
            v-for="item in tableData.list"
            :key="item.id"
            :orderData="item"
            class="order-list-item"
        >
        </OrderItem>

        <Pagination
                v-if="isShowPage"
                :current-page="tableData.pageNo"
                :page-size="tableData.pageSize"
                :total="tableData.total"
                :page-sizes="[5, 10, 20, 50, 100, 200]"
                :pager-count="pageData.pageSize"
                @update:page-size="pageSizeChange"
                @update:current-page="pageChange"
        />
    </section>
    <empty-data v-else></empty-data>
</article>
</template>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.order-list {
    min-height: 50vh;
}
</style>
