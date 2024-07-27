<template>
  <div>
    <button @click="screen">screenFull</button>
  </div>
</template>

<script setup>
import screenfull from 'screenfull'
import { onMounted, ref } from "vue"

const screen = () => {
  if (screenfull.isEnabled) {
    screenfull.request();
  }
}

screenfull.on('change', (e) => {
  if (screenfull.isFullscreen) {
    console.log('全屏');
  } else {
    e.preventDefault()
    console.log('请保持全屏');
  }
  console.log('change');
})

onMounted(() => {
  window.onbeforeunload = function (event) {
    event.preventDefault(); // 阻止默认行为
    return '请不要关闭此页面！'; // 返回一个提示信息
  };
  window.addEventListener('keydown', function (e) {
    console.log(111);
    console.log(e.key);
    if (e && e.key == 'F11') {
      e.preventDefault() // 阻止默认事件
    }
    if (e.altKey && e.key == "Tab") {
      console.log(9999999999999);
    }
  }, true)
})


// setInterval(() => {
//   if (screenfull.isFullscreen) {
//     console.log('全屏');
//   }
//   console.log(screenfull.isFullscreen);
// }, 1000)


</script>

<style lang="scss" scoped></style>