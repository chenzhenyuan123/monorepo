<!--
 * @Author: czy
 * @Description: 对应的功能or菜单名字
-->
<!--
 * @Author: czy
 * @Description: 密码框-密码校验
-->
<template>
  <div class="input-password-container">
    <ul v-if="data" class="password-validator-box">
      <li v-for="(item, index) in validatorData" :key="item.value">
        <el-icon :class="{'password-validator-box-icon': validatorFn(item.type, index)}"><SuccessFilled /></el-icon>
        <span>{{$t(item.label)}}</span>
      </li>
    </ul>
  </div>
</template>
<script setup name="login">
import { SuccessFilled } from '@element-plus/icons-vue';
import { specialCharacterstr } from '@/util/validate.js'

const flag = ref(false)
const props = defineProps({
  data: {
    type: String,
    default: ''
  }
})
// 密码校验数据，长度8，包含大写、小写、数字、特殊字符
const validatorData = ref([{
  value: 8,
  label: "signup.signupValidatePasswordLength",
  type: 'length',
  isTrue: false
}, {
  value: '[A-Z]',
  label: "signup.signupValidatePasswordUppercase",
  isTrue: false
}, {
  value: '[a-z]',
  label: "signup.signupValidatePasswordLowercase",
  isTrue: false
}, {
  value: '[0-9]',
  label: "signup.signupValidatePasswordNumber",
  isTrue: false
}, {
  value: specialCharacterstr,
  label: "signup.signupValidatePasswordSpecial",
  type: 'special',
  isTrue: false
}])
// 校验密码是否匹配对应的条件
// type: length 验证长度, 其他根据value字段验证正则
const validatorFn = (type, index) => {
  let isIf = false
  if (type === 'length') {
    isIf = props?.data?.length>=8
  } else {
    // 特殊字符
    if(type === 'special') {
      const pattern = specialCharacterstr.split('').find(item => props.data.includes(item))
      isIf = pattern ? true : false
    } else {
      const pattern = new RegExp(validatorData.value[index].value, 'g')
      isIf = pattern.test(props.data)
    }
  }
  if(isIf) {
    validatorData.value[index].isTrue = true
    return true
  } else {
    validatorData.value[index].isTrue = false
    return false
  }
}

</script>
<style lang="scss" scoped>
  .input-password-container {
    width: 100%;
    .password-validator-box {
      margin: 6px 0 0 0;
      margin: 6px 0 0 0;
      color: #475467;
      font-size: 14px;
      li{
        line-height: 20px;
        margin-bottom: 12px;
        overflow: hidden;
        .el-icon {
          float: left;
          margin-right: 8px;
          font-size: 20px;
          color: #D0D5DD;
          &.password-validator-box-icon {
            color: #079455;
          }
        }
        span {
          display: block;
          width: 330px;
          float: left;
          word-break: break-all;
          text-align: left;
        }
      }
    }
  }
</style>