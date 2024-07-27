<template>
  <button @click="add">点击增加</button>
  {{ num }}
</template>
<script setup>
import { ref } from 'vue';
window.addEventListener('message', (event) => {
  console.log("event",event)
  if (event.data) {
    console.log('Received handshake message:', event.data.data);
    // 回复握手消息
    event.source.postMessage({ type: 'handshake', data: 'hi' }, event.origin);
  }
});
let num = ref(0)
const add = () => {
  num.value++
}
</script>
<style lang="less">

</style>