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
    loading: {
        type: Boolean,
        default: false
    },
    isShowPage: {
        type: Boolean,
        default: true
    }
});
const isMobile = useIsMobile()
const emit = defineEmits(['pageChange', 'pageSizeChange'])

const pageChange = (pageNo) => {
    emit('pageChange', pageNo)
}

const pageSizeChange = (pageSize) => {
    emit('pageSizeChange', pageSize)
}

</script>

<template>
<article
        v-loading="loading"
        class="order-list-container"
>
    <template v-if="tableData.total > 0">
        <section class="order-list">
            <OrderItem
                    v-for="item in tableData.list"
                    :key="item.id"
                    :orderData="item"
                    class="order-list-item"
            >
            </OrderItem>
        </section>

        <Pagination
                v-if="isShowPage"
                class="pagination"
                :current-page="tableData.pageNo"
                :page-size="tableData.pageSize"
                :total="tableData.total"
                :page-sizes="[5, 10, 20, 50, 100, 200]"
                :pager-count="pageData.pageSize"
                @update:page-size="pageSizeChange"
                @update:current-page="pageChange"
        />
    </template>

    <empty-data v-else-if="!loading"></empty-data>
</article>
</template>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.order-list-container {
    min-height: 50vh;
    padding-bottom: 48px;
}
.order-list {
    padding: 20px 32px;
    border-top: 1px solid #E4E7EC;
    background-color: #F9FAFB;
    .order-list-item {
        margin-bottom: 12px;
        &:last-child {
            margin-bottom: 0;
        }
    }
}

.pagination {
    padding: 12px 24px 16px;
}

.m {
    .order-list-container {
        padding-bottom: 0;
    }
    .order-list {
        padding: 20px 8px;
        .order-list-item {
            margin-bottom: 12px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .pagination {
        padding: 12px 16px;
    }
}
</style>
