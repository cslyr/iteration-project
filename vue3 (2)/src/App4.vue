<template>
  <div class="wapper">
    <canvas class="canvas1" ref="canvas1" width="500" height="300"></canvas>
    <canvas class="canvas2" ref="canvas2" width="500" height="300"></canvas>
    <div class="silder" ref="silder">
      <div class="silderBlock" ref="silderBlock"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
const canvas1 = ref(null)
const canvas2 = ref(null)
let ctx1 = ref(null)
let ctx2 = ref(null)

let whiteBlockLeft = ref(0)
const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
}


const initCanvas = (ctx, type, _x = 50,) => {
  ctx = ctx
  const img = new Image()
  img.src = '/public/goods12.jpg'
  img.onload = function () {
    ctx.drawImage(img, 0, 0, 500, 300);
  }

  // 绘制空白
  ctx.beginPath();
  ctx.moveTo(_x, 50);
  ctx.arc(_x + 50 / 2, 45, 10, 0.8 * Math.PI, 2.2 * Math.PI);
  ctx.lineTo(_x + 50, 50);
  ctx.arc(_x + 50 + 5, 75, 10, 1.3 * Math.PI, 2.7 * Math.PI);
  ctx.lineTo(_x + 50, 100);
  ctx.lineTo(_x, 100);
  ctx.arc(_x + 5, 75, 10, 2.7 * Math.PI, 1.3 * Math.PI, true);
  ctx.lineTo(_x, 50);
  ctx.globalCompositeOperation = 'destination-over'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.strokeStyle = 'red'
  // 绘制or剪切
  type == 'fill' ? ctx.fill() : ctx.clip()
  ctx.stroke();
}

const silderBlock = ref(null)
const silder = ref(null)
const isDown = ref(false)

onMounted(() => {
  whiteBlockLeft.value = Math.round(getRandomArbitrary(200, 400))
  ctx1.value = canvas1.value.getContext('2d')
  ctx2.value = canvas2.value.getContext('2d')
  initCanvas(ctx1.value, 'fill', whiteBlockLeft.value)
  initCanvas(ctx2.value, 'clip')
  silderBlock.value.addEventListener('mousedown', () => {
    isDown.value = true
  })
  silder.value.addEventListener('mousemove', (e) => {
    if (isDown.value) {
      if (silderBlock.value.style.left.split('px')[0] > 450) {
        silderBlock.value.style.left = 450 + 'px'
        canvas2.value.style.left = 390 + 'px'
      } else {
        silderBlock.value.style.left = e.pageX + 'px'
        canvas2.value.style.left = e.pageX - 50 + 'px'
      }
    }
  })
  silderBlock.value.addEventListener('mouseup', () => {
    isDown.value = false
    if (whiteBlockLeft.value - 10 < parseInt(canvas2.value.style.left.split('px')[0]) + 50 || parseInt(canvas2.value.style.left.split('px')[0]) + 50 > whiteBlockLeft.value + 10) alert('验证成功')
  })
})

</script>

<style lang="less" scoped>
.wapper {
  position: relative;
}

.canvas1 {
  border: 1px solid red;
}

.canvas2 {
  position: absolute;
  left: -50px;
  top: 0
}

.silder {
  width: 500px;
  height: 50px;
  background: grey;
  position: relative;

  .silderBlock {
    width: 50px;
    height: 50px;
    background: skyblue;
    position: absolute;
    cursor: pointer;
  }
}
</style>