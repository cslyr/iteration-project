<template>
  <div>provide</div>
  <HelloWorld></HelloWorld>
</template>

<script setup>
import { ref, reactive, provide, computed } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
provide('syncData', '同步数据')
let a = ref('')
// setTimeout(() => {
//   provide('asyncData', '异步数据')
// }, 0)
setTimeout(()=>{
    a.value = 'res'
  })
provide('asyncData', a)
</script>
<style scoped lang='less'></style>