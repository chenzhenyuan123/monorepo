<script setup name="pagination">
import SvgArrowLeft from './svg/ArrowLeft.vue'
import SvgArrowRight from './svg/ArrowRight.vue'

const isMobile = useIsMobile()

const props = defineProps({
  pagerCount: {
    type: Number,
    default: 5
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100, 200]
  }
})

const paginationLayout = isMobile ? 'prev, pager, next' : 'prev, pager, next, sizes'
</script>

<template>
  <div class="flylinking-pagination">
    <el-pagination
      v-bind="$attrs"
      :page-sizes="pageSizes"
      :layout="paginationLayout"
      :pager-count="pagerCount"
      :prev-icon="SvgArrowLeft"
      :next-icon="SvgArrowRight"
    />
  </div>
  
</template>

<style lang="scss">
.flylinking-pagination{
  display: flex;
  justify-content: center;
  .el-pagination{
    color: #667085;
    button{
      height: 40px;
      min-width: 40px;
      border: 1px solid #D0D5DD;
      box-sizing: border-box;
      color: #344054;
      &:hover{
        background-color: #F2F4F7;
      }
      &:disabled{
        background-color: #fff;
        .el-icon{
          color: #98A2B3;
        }
      }
    }
    .btn-prev{
      border-radius: 8px 0 0 8px;
    }
    .btn-next {
      border-radius: 0 8px 8px 0;
    }
    .btn-next .el-icon, .btn-prev .el-icon{
      font-size: 20px;
    }
    .el-pager {
      li{
        color: #667085;
        font-weight: 600;
        height: 40px;
        min-width: 40px;
        margin: 0;
        border-top: 1px solid #D0D5DD;
        border-bottom: 1px solid #D0D5DD;
        box-sizing: border-box;
        border-radius: 0;
        &+li{
          border-left: 1px solid #D0D5DD;
        }
        &:hover, &.is-active{
          background-color: #F2F4F7;
          color: #182230;
        }
      }
    }
    .el-pagination__sizes .el-select{
      width: auto;
      min-width: 114px;
      .el-select__wrapper{
        min-height: 40px;
        border-radius: 8px;
        box-shadow: 0 0 0 1px #D0D5DD inset;
        &.is-focused{
          box-shadow: 0 0 0 1px #776CFF inset;
        }
        .el-icon {
          color: #000000;
          font-weight: 600;
          font-size: 16px;
        }
      }
      .el-select__placeholder{
        text-align: center;
        color: #344054;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
}
</style>
