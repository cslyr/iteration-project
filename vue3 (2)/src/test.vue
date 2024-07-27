<template>
  <Test v-model:str="str"></Test>
  father:{{ str }}<br>
  <button @click="change">++</button>
</template>

<script setup>

import { ref, toRef } from 'vue'
import Test from '../src/components/testComponent.vue'
let originStr = 'str'
let str = ref(originStr)
const change = ()=>{
  str.value += '!'
  // console.log('originStr',originStr);
  // console.log('str',str);
}
</script>