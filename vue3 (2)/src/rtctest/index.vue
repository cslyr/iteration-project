<template>
  <div>
    <h1>webRTC实现通讯</h1>
    <a-modal centered :keyboard="false" :closable="false" v-model:visible="videoModalVisible" width="60%"
      :maskClosable="false" title="视频通话框" @cancel="hangUpVideo" okText="确定" @ok="acceptVideo" cancelText="挂断">
      <div class="video-container">
        <a-row>
          <a-col :span="12">
            <div class="mine">（我）</div>
            <video autoplay id="localVideo"></video>
          </a-col>
          <a-col :span="12">
            <!-- <div class="mine" v-if="isVideoRequesting">等待对方接听</div> -->
            <div class="mine">对方</div>
            <video autoplay id="remoteVideo"></video>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <a-button @click="joinRoom">点击加入房间</a-button>
    <a-button @click="createOffer">进入视频</a-button>
    <a-button @click="hangUpVideo">挂断</a-button>
    <!-- 左侧的视频框 -->
    <div style="position: absolute;width: 300px;height: 300px">
      <video style="width: 100%;height: 100%;" id="localVideo" autoplay playsinline muted></video>
    </div>
    <!-- 右侧的视频框 -->
    <div style="position: absolute;right: 0;width: 300px;height: 300px">
      <video style="width: 100%;height: 100%;" id="remoteVideo" autoplay playsinline muted></video>
    </div>
    <div class="chart"
      style="align-items:start ;background-color: black;width: 800px;height: 500px;position: absolute;left: 350px;">
      <div v-for="item in chartContentList" style="display: flex;flex-direction: column;">
        <div v-if="item.direction == 2"  class="chartLeft">{{ item.chartContent }}
        </div>
        <div v-else class="chartRight" style="margin-left: auto ;">{{ item.chartContent }}</div>
      </div>
    </div>
    <div style="position: absolute;bottom:0;background-color: aqua;width: 80%;">
      <a-textarea v-model:value="chartContent" :auto-size="{ minRows: 4, maxRows: 4 }" placeholder="请输入信息"
        style="width: 100%;" allow-clear @pressEnter="sendChart">
      </a-textarea>
      <a-button type="primary" @click="sendChart"
        style="position: absolute;bottom: 0;right: 0;z-index: 100;">发送</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import io from 'socket.io-client'
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue';
//视频框是否显示
const videoModalVisible = ref(false)
//视频通话本地媒体流
const videoState = reactive({
  localStream: <any>null,
  remoteStream: <any>null
})
//聊天内容
const chartContent = ref()
const chartContentList = ref<{ chartContent: any, direction: any }[]>([])


// 公共参数
let commonState = reactive<any>({
  // 视频/共享屏幕倒计时
  times: 0,
  // webRtc实例
  peer: '',
  // 配置stun服务器和turn服务器
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'turn:120.77.253.101:3478',
      'username': 'inter_user',
      'credential': 'power_turn'
    }
  ],
  offerSdp: '',
  answerSdp: ''
})
const socketId = ref()
let socket
// 随机一个用户名，后面你可以自己改成输入框让用户输入
const userId = Math.random().toString(36).substring(2)
// 房间号，这里随便写一个，后面你可以自己改成输入框让用户输入
const roomId = 123

//获取左侧的dom
const getDom1 = () => {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement//这里相当于加入了一个类型断言
  return videoEl
}
//获取右侧的dom
const getDom2 = () => {
  const videoE2 = document.getElementById('remoteVideo') as HTMLVideoElement//这里相当于加入了一个类型断言
  return videoE2
}
// 播放本地视频流
function playLocalStream(stream: MediaStream, videoEl: HTMLVideoElement) {
  videoEl.srcObject = stream
}
//播放远程视频流
function playRemoteVideoStream(stream: MediaStream, videoE2: HTMLVideoElement) {
  videoE2.srcObject = stream
}
// 加入房间
function joinRoom() {
  socket.emit('joinRoom',
    { userId, roomId: roomId, userName: '陈硕', avatar: null, socketId: socketId.value }
  )
  console.log("在客户端触发登陆房间的事件")
}
//建立socket连接
const connection = () => {
  socket = io('https://192.168.0.101:8888')
  // 监听建立连接
  socket.on('connect', () => { console.log('建立信令连接成功') })
  socket.on('socketId', (data) => socketId.value = data)
  // 监听断开连接
  socket.on('disconnect', () => console.log('断开与信令服务器的连接'))
  // 监听来自服务端的信息
  socket.on('message', () => {
  })
  // 监听用户加入房间成功
  socket.on('joinRoom', (data) => {
    console.log("在内部执行加入房间成功", socketId.value)
  })
  socket.on('offer', (data) => {
    videoModalVisible.value = true
    let { sdp } = data
    commonState.offerSdp = sdp
    // 接收到对方的offerSdp
  })
  socket.on('rejectVideo', (data) => {
    // console.log("data",data)
    message.warn(`${data}对方拒绝了你的请求`, 10,);
  })
  socket.on('acceptVideo', async (data) => {
    console.log("客户端B接收视频请求", data)
    console.log("commonState.peer", commonState.peer)
    const dom2 = getDom2()
    commonState.peer.ontrack = (event) => {
      dom2.srcObject = event.streams[0] //将远程流中的第一个流（通常是音视频流）赋值给remoteVideo.srcObject属性，这样就将远程流与remoteVideo元素进行绑定，从而在浏览器中播放远程对等方的音视频。
    }
    if (commonState.peer.signalingState != 'stable') {
      // console.log("对方接收了你的视频请求")
      await commonState.peer.setRemoteDescription(JSON.parse(data.sdp))//将接收端设置成为远程描述
      message.success('对方接收了你的视频请求', 10,);
    }
  })
  //接收到聊天的内容
  socket.on('sendExchange', (data: any) => {
    console.log("发送的内容", data)
    chartContentList.value.push({ chartContent: data, direction: 2 })
  })
}
connection()



// 创建 offer

//发起视频聊天
async function createOffer() {
  commonState.peer = new RTCPeerConnection({ iceServers: commonState.iceServers })
  var constraints = {
    video: true, //传输视频
    audio: true  //传输音频
  }
  //获取本地媒体流
  videoState.localStream = await navigator.mediaDevices.getUserMedia(constraints)
  console.log(" 设置本地媒体流", videoState.localStream)
  const dom = await getDom1()
  playLocalStream(videoState.localStream, dom)//视频展示

  // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
  videoState.localStream.getTracks().forEach((track) => {
    commonState.peer.addTrack(track, videoState.localStream)
  })
  const offer = await commonState.peer.createOffer()   //创建一个SDP
  await commonState.peer.setLocalDescription(offer)    //将刚刚创建的SDP offer设置为本地描述

  // 当设备发现一个新的ICE候选者时 ICE候选人被创建时触发事件
  commonState.peer.onicecandidate = async (event) => {
    console.log("监听到候选者")
    if (event.candidate) {//如果存在新的ice候选者    ICE候选者的作用是在建立对等连接的过程中，通过交换和比较彼此的候选者，找到最佳的网络路径来进行通信。
      commonState.offerSdp = JSON.stringify(commonState.peer.localDescription)  //当前对象的本地描述   个包含有关本地设备和连接的信息的对象。
      // 发送 offer
      if (commonState.offerSdp) {
        socket.emit('offer', {
          userId,
          roomId: roomId,
          sdp: commonState.offerSdp,
          socketId: socketId.value,
        })
      }
    }
  }
}
//同意视频请求
async function acceptVideo() {
  videoModalVisible.value = false
  commonState.peer = new RTCPeerConnection({ iceServers: commonState.iceServers })
  var constraints = {
    video: true, //传输视频
    audio: true  //传输音频
  }
  //获取本地媒体流
  videoState.localStream = await navigator.mediaDevices.getUserMedia(constraints)
  const dom = await getDom2()
  const dom1 = await getDom1()
  playRemoteVideoStream(videoState.localStream, dom)//在接收端上展示视频
  commonState.peer.ontrack = (event) => {
    dom1.srcObject = event.streams[0] //将远程流中的第一个流（通常是音视频流）赋值给remoteVideo.srcObject属性，这样就将远程流与remoteVideo元素进行绑定，从而在浏览器中播放远程对等方的音视频。
  }
  // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
  videoState.localStream.getTracks().forEach((track) => {
    commonState.peer.addTrack(track, videoState.localStream)
  })

  //将刚才接收到的发送段的SDP设置成为远程描述
  await commonState.peer.setRemoteDescription(JSON.parse(commonState.offerSdp))//设置远程描述

  const answer = await commonState.peer.createAnswer()//设置应答和本地描述
  await commonState.peer.setLocalDescription(answer)//创建SDP答复，这个答复是对另一端（即发起通信的那一端）所创建的SDP提议的响应。
  commonState.peer.onicecandidate = async (event) => {
    console.log("应答的时候检测到ICE候选者")
    // 当一个新的 answer ICE candidate 被创建时
    if (event.candidate) {
      socket.emit('acceptVideo', {
        fromSocketId: userId,
        roomId: roomId,
        sdp: JSON.stringify(commonState.peer.localDescription),
      })
    }
  }


}

//当点击挂断的时候
const hangUpVideo = async () => {
  socket.emit('rejectVideo', {
    toId: userId,
    fromSocketId: roomId,
  })
  // videoModalVisible.value=false
  var constraints = {
    video: true, //传输视频
    audio: true  //传输音频
  }

  stopMediaStreamTracks(videoState.localStream)
}

//发送信息
const sendChart = (event) => {
  event.preventDefault();
  console.log("开始发送小心")

  socket.emit('chartExchange', {
    chartContent: chartContent.value,
    roomId: roomId
  })
  chartContentList.value.push(
    {
      chartContent: chartContent.value,
      direction: 1
    }
  )
  chartContent.value = ''
}

//关闭摄像头和麦克风
function stopMediaStreamTracks(stream) {
  // console.log("stream.getTracks()",stream.getTracks())

  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

}
</script>
<style lang="less" scoped>
.chartLeft {
  margin-top: 20px;
  width: fit-content;
  max-width: 200px;
  height: fit-content;
  color: #fff;
  background-color: skyblue;
  word-wrap: break-word;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-left: 10px;
  text-align: left;
  padding: 5px;
}

.chartRight {
  margin-top: 20px;
  width: fit-content;
  max-width: 200px;
  height: fit-content;
  color: #fff;
  background-color: #5e9955;
  word-wrap: break-word;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  text-align: left;
  padding: 5px;
}
</style>