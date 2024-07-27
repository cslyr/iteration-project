<template>
  <div>
    <video id="localVideo" autoplay playsinline muted></video>
    <button @click="takePhoto">拍摄</button>
    <button @click="shareScreen">屏幕共享</button>
    <button @click="startRecord">录制5秒钟屏幕</button>
    <select>
      <option :value="item" v-for="item in supported">{{ item }}</option>
    </select>
    <div style="display: flex; flex-wrap: wrap;">
      <div v-for="(item, index) in imgList" :key="index" class="item">
        <img :src="item" alt="" />
      </div>
    </div>
    <!-- 虚拟背景 -->
    <canvas id="backgroundImg" width="480" height="300"></canvas>
    <video id="real-video" width="480" height="300" autoplay muted></video>
    <video id="virtual-video" width="480" height="300" autoplay muted></video>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
// 获取本地音视频流
async function getLocalStream(constraints: MediaStreamConstraints) {//这个是加入了一个类型的注释
  // 获取媒体流 
  //navigator.mediaDevices 是一个对象，提供了访问媒体设备的方法和属性
  //getUserMedia(constraints) 是 navigator.mediaDevices 对象的一个方法，用于请求用户授权并获取指定的媒体流。
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  playLocalStream(stream)
}
getLocalStream({
  audio: false,
  video: true,
})

// 播放本地视频流
function playLocalStream(stream: MediaStream) {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement//这里相当于加入了一个类型断言
  videoEl.srcObject = stream
}
// ---------通过上述功能就能实现出现摄像头-----------------

//实现拍照功能
const imgList = ref([])
// 拍照
function takePhoto() {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  const canvas = document.createElement('canvas')
  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
  // - videoEl：要绘制的视频元素，通常是一个 <video> 元素。
  // - 0, 0：绘制视频帧的起始坐标，这里是左上角的坐标。
  // - canvas.width, canvas.height：绘制视频帧的宽度和高度，这里使用了画布的宽度和高度。
  imgList.value.push(canvas.toDataURL('image/png'))//方法将 canvas 上的内容转换为一个 base64 编码的 PNG 图片的数据URL。这个数据URL可以直接用于显示图片或者保存图片。
  console.log('🚀🚀🚀 / imgList', imgList)

  // 添加滤镜
  const filterList = [
    'blur(5px)', // 模糊
    'brightness(0.5)', // 亮度
    'contrast(200%)', // 对比度
    'grayscale(100%)', // 灰度
    'hue-rotate(90deg)', // 色相旋转
    'invert(100%)', // 反色
    'opacity(90%)', // 透明度
    'saturate(200%)', // 饱和度
    'saturate(20%)', // 饱和度
    'sepia(100%)', // 褐色
    'drop-shadow(4px 4px 8px blue)', // 阴影
  ]

  for (let i = 0; i < filterList.length; i++) {
    ctx.filter = filterList[i] //设置不同的滤镜效果   ctx.filter是Canvas 2D上下文对象的属性之一，用于设置绘制内容的滤镜效果。
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    imgList.value.push(canvas.toDataURL('image/png'))
  }
}

/* ---------通过上述功能可以实现拍照并且对照片进行处理，加上滤镜的效果 --------------------

*/

// 获取所有视频输入设备
async function getDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices()//会返回一个Promise对象，该Promise对象在解析时会返回一个包含媒体设备信息的数组。
  console.log('🚀🚀🚀 / 获取所有的摄像头设备', devices)
  let videoDevices = devices.filter((device) => device.kind === 'videoinput')//从 devices 数组中筛选出所有的视频输入设备，并将它们存储在 videoDevices 数组中。
}

// 切换设备
async function handleDeviceChange(deviceId: string) {

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      deviceId: { exact: deviceId },//获取指定id的视频流
    },
  })
}
//--------通过上述内容可以实现视频输入设备的切换-------------------------
// 切换前后摄像头
function switchCamera(val: number) {
  let constraints = {
    video: true, // 开启默认摄像头
    audio: true,//开启音频流
  }
  constraints.video = {
    // 强制切换前后摄像头时，当摄像头不支持时，会报一个OverconstrainedError［无法满足要求的错误］
    facingMode: { exact: val === 1 ? 'user' : 'environment' },
    // 也可以这样当前后摄像头不支持切换时，会继续使用当前摄像头，好处是不会报错
    // facingMode: val === 1 ? 'user' : 'environment',
    //facingMode 的值将被设置为 'user'，表示使用前置摄像头。当是environment 设置的是后置摄像头
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      ElMessage.success('切换成功')
      playLocalStream(stream)
    })
    .catch((err) => {
      ElMessage.error('你的设备不支持切换前后摄像头')
    })
}

//--------------上述内容切换前置摄像头和后置摄像头------------------------




//-------------------共享屏幕------------------
//getDisplayMedia 来获取屏幕共享的媒体流
// 获取屏幕共享的媒体流
async function shareScreen() {
  let localStream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  })
  // console.log("录制屏幕",localStream)
  // 播放本地视频流
  playStream(localStream)
}

// 在视频标签中播放视频流
function playStream(stream: MediaStream) {
  const video = document.querySelector('#localVideo') as HTMLVideoElement
  video.srcObject = stream
}


//-------------------实现录制功能--------------------------
//recorder   录音机
//们使用 MediaRecorder 来进行录制


/* 1.首选需要获取浏览器支持的媒体类型
浏览器支持的 MIME 类型包括但不限于以下几种：
- text/html：HTML 文档
- text/plain：纯文本
- text/css：CSS 样式表
- application/javascript：JavaScript 脚本
- image/jpeg：JPEG 图像
- image/png：PNG 图像
- audio/mpeg：MP3 音频
- video/mp4：MP4 视频 */
// 获取支持的媒体类型
const supported: string[] = reactive([])

function getSupportedMimeTypes() {
  const media = 'video'
  // 常用的视频格式
  const types = [
    'webm',
    'mp4',
    'ogg',
    'mov',
    'avi',
    'wmv',
    'flv',
    'mkv',
    'ts',
    'x-matroska',
  ]
  // 常用的视频编码
  const codecs = ['vp9', 'vp9.0', 'vp8', 'vp8.0', 'avc1', 'av1', 'h265', 'h264']
  // 支持的媒体类型
  const isSupported = MediaRecorder.isTypeSupported
  // 遍历判断所有的媒体类型
  types.forEach((type: string) => {
    const mimeType = `${media}/${type}`
    codecs.forEach((codec: string) =>
      [
        `${mimeType};codecs=${codec}`,
        `${mimeType};codecs=${codec.toUpperCase()}`,
      ].forEach((variation) => {
        if (isSupported(variation)) supported.push(variation)   //   样式  video/webm;codecs=vp9
      }),
    )
    if (isSupported(mimeType)) supported.push(mimeType)     //  样式  video/webm
  })
  return supported   //将浏览器支持的样式全部都放到supported这个数组当中
}

console.log(getSupportedMimeTypes())

//  2.实现媒体流的录制功能
// 录制媒体流
async function startRecord() {

  const options = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    mimeType: 'video/webm; codecs="vp8,opus"',
  }
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  const mediaRecorder = new MediaRecorder(localStream, options)
  mediaRecorder.start()

  mediaRecorder.ondataavailable = (e) => {
    // 将录制的数据合并成一个 Blob 对象
    // const blob = new Blob([e.data], { type: e.data.type })
    // 🌸重点是这个地方，我们不要把获取到的 e.data.type设置成 blob 的 type，而是直接改成 mp4
    const blob = new Blob([e.data], { type: 'video/mp4' })
    downloadBlob(blob)      //对录制的内容进行下载的操作
  }
  mediaRecorder.onstop = (e: Event) => {   //停止录制的操作
    // 停止录制
    console.log("已经停止录制")
  }
  // 停止录制
  setTimeout(() => {
    mediaRecorder.stop()
  }, 5000) // 5秒后停止录制
}
//具体的下载操作
function downloadBlob(blob: Blob) {
  // 将 Blob 对象转换成一个 URL 地址
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  // 设置 a 标签的 href 属性为刚刚生成的 URL 地址
  a.href = url
  // 设置 a 标签的 download 属性为文件名
  a.download = `${new Date().getTime()}.${blob.type.split('/')[1]}`
  // 模拟点击 a 标签
  a.click()
  // 释放 URL 地址
  URL.revokeObjectURL(url)
}


//--------------------------虚拟化背景-----------------------
//通过使用canvas将视频的每一帧绘制到画布上，然后根据设定的背景色（默认为绿色）与画布中的像素进行比较。当差值超过设定的阈值时，将该像素替换为预先准备好的背景图像数据。
//实际上实现的效果就是真实的视频每隔 40ms 一次 画到画布上。
// 虚拟背景的 canvas中的图片数据
let backgroundImageData: ImageData
// 获取背景图像数据
function getBackgroundImageData() {
  const backgroundCanvas = document.querySelector(
    '#backgroundImg',
  ) as HTMLCanvasElement
  const backgroundCtx = backgroundCanvas.getContext('2d')!
  const img = new Image()
  img.src = '../../public/text8.jpg'
  img.onload = () => {
    backgroundCtx.drawImage(
      img,
      0,
      0,
      backgroundCanvas.width,
      backgroundCanvas.height,
    )

    backgroundImageData = backgroundCtx.getImageData(
      0,
      0,
      backgroundCanvas.width,
      backgroundCanvas.height,
    )
  }
}
//呈现真实视频
async function virtualGetLocalStream(options: MediaStreamConstraints) {
  const stream = await navigator.mediaDevices.getUserMedia(options)
  playRealVideo(stream)
}
function playRealVideo(stream: MediaStream) {
  let realVideo = document.querySelector('#real-video') as HTMLVideoElement
  realVideo.srcObject = stream
  drawVideoToCanvas(realVideo)
}
virtualGetLocalStream({
  audio: false,
  video: true,
})



const WIDTH = 480 // 视频宽度
const HEIGHT = 300 // 视频高度
// // 将视频写到 canvas 中
function drawVideoToCanvas(realVideo: HTMLVideoElement) {
  //创造新的画布实现2d效果
  const realVideoCanvas = document.createElement('canvas') as HTMLCanvasElement
  let realVideoCtx = realVideoCanvas.getContext('2d')!
  //创建一个虚拟背景的画布
  const virtualVideoCanvas = document.createElement('canvas') as HTMLCanvasElement
  let virtualVideoCtx = virtualVideoCanvas.getContext('2d')!

  realVideoCanvas.width = virtualVideoCanvas.width = WIDTH
  realVideoCanvas.height = virtualVideoCanvas.height = HEIGHT

  // 每隔 100ms 将真实的视频写到 canvas 中，并获取视频的图像数据
  setInterval(() => {
    realVideoCtx.drawImage(
      realVideo,
      0,
      0,
      realVideoCanvas.width,
      realVideoCanvas.height,
    )
    // 获取 realVideoCanvas 中的图像数据  可以通过访问 imageData.data 数组来获取每个像素的颜色信息
   let realVideoImageData = realVideoCtx.getImageData(
      0,
      0,
      realVideoCanvas.width,
      realVideoCanvas.height,
    )
    // 处理真实视频的图像数据，将其写到虚拟视频的 canvas 中
    processFrameDrawToVirtualVideo(realVideoImageData,virtualVideoCtx)
  }, 40)
  // 从 VirtualVideoCanvas 中获取视频流并在 virtualVideo 中播放
  getStreamFromVirtualVideoCanvas(virtualVideoCanvas)
}

// // 处理真实视频的图像数据，将其写到虚拟视频的 canvas 中
function processFrameDrawToVirtualVideo(realVideoImageData,virtualVideoCtx) {
  // 逐像素计算与要处理的目标颜色的差值，如果差值小于阈值，则将该像素设置为背景图片中的对应像素
  for (let i = 0; i < realVideoImageData.data.length; i += 4) {
    const r = realVideoImageData.data[i]
    const g = realVideoImageData.data[i + 1]
    const b = realVideoImageData.data[i + 2]
    const a = realVideoImageData.data[i + 3]
    const bgR = backgroundImageData.data[i]
    const bgG = backgroundImageData.data[i + 1]
    const bgB = backgroundImageData.data[i + 2]
    const bgA = backgroundImageData.data[i + 3]

    // 计算与背景色的差值
    const diff = colorDiff([r, g, b], [bgR,bgG,bgB])
    // 当差值小于设定的阈值，则将该像素设置为背景图片中的对应像素
    if (diff < 80) {
      realVideoImageData.data[i] = bgR
      realVideoImageData.data[i + 1] = bgG
      realVideoImageData.data[i + 2] = bgB
      realVideoImageData.data[i + 3] = bgA
    }
  }
  // 将处理后的图像数据写到虚拟视频的 canvas 中
  virtualVideoCtx.putImageData(realVideoImageData, 0, 0)
}

// 从 VirtualVideoCanvas 中获取视频流并在 virtualVideo 中播放
function getStreamFromVirtualVideoCanvas(virtualVideoCanvas) {
 const virtualVideo = document.querySelector('#virtual-video') as HTMLVideoElement
  const stream = virtualVideoCanvas.captureStream(30)  //会将虚拟视频画布中的内容作为视频流进行捕获,以每秒30帧的速度进行传输。
  virtualVideo.srcObject = stream
}

// 计算颜色差异
function colorDiff(rgba1: number[], rgba2: number[]) {
  let d = 0
  for (let i = 0; i < rgba1.length; i++) {
    d += (rgba1[i] - rgba2[i]) ** 2
  }
  return Math.sqrt(d)
}



onMounted(() => {
  // console.log("111111")
  getBackgroundImageData()//获取背景照片
})
</script>

<style  lang="less"></style>
