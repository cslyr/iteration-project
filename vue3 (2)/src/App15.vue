<template>
  <div style="width: 80%;margin: 20px auto;">
    密码：<a-input v-model:value="password"></a-input>
    <a-button @click="click">校验</a-button>
    <div>
      注：密码需满足以下规则：<br>
      1：8-16个字符<br>
      2：含以下选项中的3类即可：<br>
      a) 英文大写字母 ( A - Z )<br>
      b) 英文小写字母 ( a - z )<br>
      c) 数字 ( 0 - 9 )<br>
      d) 非字母数字符 ( ! $ # % _ @ )<br>
      3：不能有连续5位数字比如12345,56789<br>
      4：不能出现用户名在密码里<br>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from 'vue';
const password = ref('')
//连续
function upDownSpecial (str) {
  str += ''
  let re = /\d/g;
  let re1 = /(\(.*\))\1{4,}/g;
  // 判断是否递增
  let increment = str.replace(re, function (x1, idx) {
    return `(${x1 - idx})`
  })
  let isIncrement = re1.test(increment)
  // 判断是否递减
  let decrement = str.replace(re, function (x1, idx) {
    return `(${idx - x1})`
  })
  let isDecrement = re1.test(decrement)

  return isIncrement || isDecrement
}

// 相同
// function isSpecial (str) {
//   // let re = new RegExp('(\\d)\\1{' + (len - 1) + ',}', 'g');
//   let re = /(\d)\1{5,}/g;
//   str += ''
//   return re.test(str)
// }

function validatePassword (password, username) {
  // 密码长度为8-16个字符
  var lengthRegex = /^.{8,16}$/;
  if (!lengthRegex.test(password)) {
    console.log(1);
    return false;
  }

  let count = 0
  var charRegex1 = /[A-Z]/;
  var charRegex2 = /[a-z]/;
  var charRegex3 = /[0-9]/;
  var charRegex4 = /[!$#%_@]/;
  if (charRegex1.test(password)) {
    console.log('a');
    count += 1
  }
  if (charRegex2.test(password)) {
    console.log('b');
    count += 1
  }
  if (charRegex3.test(password)) {
    console.log('c');
    count += 1

  }
  if (charRegex4.test(password)) {
    console.log('d');
    count += 1
  }

  // 判断是否包含特定字符外的其它字符
  var charRegex = /^[a-zA-Z0-9!$#%_@]+$/;
  if (!charRegex.test(password)) {
    console.log(2);
    return false;
  }

  // 判断符合的条件数
  if (count < 3) {
    console.log('count<3');
    return false;
  }

  // 不包含连续5位数字
  if (upDownSpecial(password)) {
    console.log(3);
    return false;
  }

  // 用户名不在密码中
  if (password.includes(username)) {
    console.log(4);
    return false;
  }

  return true;
}
const click = () => {
  let res = validatePassword(password.value, 'jhmu3')
  console.log('function', res);
  // console.log('rgx', rgx.test(password.value));
  // console.log('upDownSpecial(password.value)', upDownSpecial(password.value));
  // console.log('isSpecial(password.value)', isSpecial(password.value));

}

</script>
<style scoped lang='less'></style>