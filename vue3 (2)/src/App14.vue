<template>
  <div>
    <div>父组件-{{ msg }}</div>
    <button @click="msg += '~'">点击我</button>
    <hr />
    <PropsChild :msg="msg" />
  </div>
</template>

<script setup>
import { ref, reactive, } from 'vue';
import PropsChild from '../src/components/propsChild.vue'

let msg = ref('今天星期四')
</script>
<style scoped lang='less'></style>