<template>
  <div class="content" :class="rotateCount == 0 ? 'light' : 'dark'">
    <h1 style="margin-bottom: 20px;">主题切换</h1>
    <div class="wrap">
      <div class="img-wrap" ref="imgWrapRef" @click="themeChange">
        <img src="/public/太阳.png" />
        <img src="/public/月亮.png" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// 旋转的圈数
let rotateCount = ref(0)
const imgWrapRef = ref(null)
const themeChange = () => {
  rotateCount.value = rotateCount.value == 0 ? 1 : 0
  imgWrapRef.value.style.transform = `rotate(${rotateCount.value * 180}deg)`
  localStorage.setItem('rotateCount', rotateCount.value)
}

onMounted(()=>{
  rotateCount.value = Number(localStorage.getItem('rotateCount'))
  imgWrapRef.value.style.transform = `rotate(${rotateCount.value * 180}deg)`
})

</script>
<style scoped lang='less'>
.content {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: var(--backgroundColor);
  color: var(--primaryColor);
  transition: all .3s;

  .wrap {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 2px dashed gray;
    border-color: var(--borderColor);
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    transition: all .3s;
    overflow: hidden;

    &:hover {
      border: 2px dashed yellowgreen;
    }

    .img-wrap {
      height: 100px;
      transition: all .3s;
      transform-origin: center;

      img {
        width: 50px;
        height: 50px;
      }

      img:nth-child(2) {
        transform: scale(0.9) rotate(90deg);
      }
    }
  }
}
</style>