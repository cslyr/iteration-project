<template>
  <div style="display: flex;">
    <div class="container" :style="{
      backgroundImage: `url('/public/vite.svg')`,
      backgroundSize: 'cover'
    }">
      <div class="dragEl"></div>
    </div>
    <div class="preview">
      <img class="img" src="/public/vite.svg" style="width: 800px;height: 800px;position: absolute;" alt="">
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
let state = reactive({
  isDragging: false,
  offsetX: 0,
  offsetY: 0
})
onMounted(() => {
  let container = document.querySelector('.container')
  let dragEl = document.querySelector('.dragEl')
  let img = document.querySelector('.img')
  // 拖动元素的宽、高
  let dragWidth = dragEl.offsetWidth
  let dragHeight = dragEl.offsetHeight
  dragEl.addEventListener('mousedown', (e) => {
    e.target.style.cursor = 'move';
    state.isDragging = true
    state.offsetX = e.offsetX
    state.offsetY = e.offsetY
    //   // e.target.style.cursor = 'pointer';
  })
  container.addEventListener('mousemove', (e) => {
    if (state.isDragging) {
      // console.log(e.target);
      // 新的X和Y轴的位置
      let newX = e.clientX - container.offsetLeft - state.offsetX
      let newY = e.clientY - container.offsetTop - state.offsetY
      // console.log('123', e.target.offsetLeft, e.target.offsetTop);
      // 顶层超出处理
      if (newY <= 0) newY = 0
      // 左侧超出处理
      if (newX <= 0) newX = 0
      // // 右侧超出处理
      if (newX >= container.offsetWidth - dragWidth) newX = container.offsetWidth - dragWidth
      // 底部超出处理
      if (newY >= container.offsetHeight - dragHeight) newY = container.offsetHeight - dragHeight
      // 顶部超出处理
      dragEl.style.left = newX + 'px'
      dragEl.style.top = newY + 'px'
      img.style.left = - 2 * newX + 'px'
      img.style.top = - 2 * newY + 'px'
    }
  }, true)
  window.addEventListener('mouseup', (e) => {
    state.isDragging = false
    e.target.style.cursor = 'default';
    console.log('mouseup', e.target);
  })
})
</script>
<style scoped>
.box {
  width: 100px;
  height: 100px;
  background: skyblue;
  position: absolute;
}

.box2 {
  background: yellowgreen;
  position: absolute;
  top: 120px;
}

*,
body,
html {
  padding: 0;
  margin: 0;
}

.container {
  width: 400px;
  height: 400px;
  /* background: skyblue; */
  border: 1px solid yellow;
  position: relative;
}

.dragEl {
  width: 200px;
  height: 200px;
  background: rgb(243, 241, 241);
  opacity: 0.6;
  position: absolute;
}

.preview {
  width: 400px;
  height: 400px;
  /* background: red; */
  border: 1px solid yellowgreen;
  position: relative;
  overflow: hidden;
}
</style>