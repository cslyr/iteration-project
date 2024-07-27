<template>
  <video id="video" autoplay width="200" height="200"></video>
  <canvas id="canvas" width="200" height="200"></canvas>
  <button @click="btnHandler">拍照</button>
  <button @click="btnHandler2">录制</button>录制时间({{ times }})
  <button @click="btnHandler3">暂停录制</button><br>
  <canvas width="380" height="200" id="backgroundImg" style="border: 1px solid black;"></canvas>
  <video width="380" height="200" id="real-video" autoplay style="border: 1px solid black;"></video>
</template>

<script setup>
import { ref, onMounted } from "vue"


let canvas, ctx, video, localStream, mediaRecorder, realVideo;
const btnHandler = () => {
  ctx.drawImage(video, 0, 0, 200, 200)
  console.log(canvas.toDataURL('image/png'));
}


const dataChunks = ref([])
let times = ref(0)
const btnHandler2 = () => {
  const options = {
    audioBitsPerSecond: 128000,
    // 指定视频的比特率。
    videoBitsPerSecond: 2500000,
    mimeType: 'video/webm; codecs="vp8,opus"',
  }
  mediaRecorder = new MediaRecorder(localStream, options)
  // 将媒体录制到一个多多个Blob对象中, mediaRecorder.start(timeslice),timeslice:间隔时间，每间隔该时间将数据统一返回。
  mediaRecorder.start(1000)

  mediaRecorder.ondataavailable = (e) => {
    console.log('ondataavailable', e);
    times.value += 1
    // 将录制的数据合并成一个 Blob 对象
    // const blob = new Blob([e.data], { type: e.data.type })

    // 我们不要把获取到的 e.data.type设置成 blob 的 type，而是直接改成 mp4
    dataChunks.value.push(e.data)
    console.log(e.data);
    // const blob = new Blob([e.data], { type: 'video/mp4' })
    // downloadBlob(blob)
  }
  mediaRecorder.onstop = (e) => {
    // 停止录制
    console.log('停止录制');
  }
}

const btnHandler3 = () => {
  mediaRecorder.stop()
  const blob = new Blob(dataChunks.value, { type: 'video/mp4' })
  downloadBlob(blob)
}

// 下载文件
const downloadBlob = (blob) => {
  // 将 Blob 对象转换成一个 URL 地址
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${new Date().getTime()}.${blob.type.split('/')[1]}`
  a.click()
  // 释放 URL 地址
  URL.revokeObjectURL(url)
}


// 向canvas绘制图片
const drawImageToCanvas = (elId, imgSrc, elWidth = 380, elHeight = 200) => {
  let elCanvas = document.querySelector(`#${elId}`)
  let elCtx = elCanvas.getContext('2d')

  const img = new Image()
  img.src = imgSrc

  img.onload = () => {
    elCtx.drawImage(img, 0, 0, elWidth, elHeight)
  }
}

onMounted(() => {
  video = document.querySelector('#video')
  realVideo = document.querySelector('#real-video')
  canvas = document.querySelector('#canvas')
  ctx = canvas.getContext('2d')
  navigator.mediaDevices.getUserMedia({
    video: {
      // 前置摄像头
      // facingMode: {
      //   exact: 'environment'
      // },
    }, audio: false
  }).then((stream) => {
    localStream = stream
    video.srcObject = localStream
    realVideo.srcObject = localStream
  }).catch(err => { console.log(err); })
  drawImageToCanvas('backgroundImg', '/2014061007022710.jpg')
})

</script>

<style lang="less" scoped></style>