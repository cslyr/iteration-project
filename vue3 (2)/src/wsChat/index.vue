<template>
  <div class="tooltip">
    <!-- 头部 -->
    <a-row>
      <!-- {{ socketId }}-{{ currentRoomType }} -->
      <a-col :span="1" />
      <a-col :span="6">
        <span>userId：{{ userId }}</span>
        <span style="margin-left: 20px;">昵称：<span style="color: orangered;">{{ userName }}</span></span>
      </a-col>
      <a-col :span="4" />
      <a-col :span="9">
        <div style="display: flex; align-items: center;">
          房间id： <span><a-input v-model:value="roomId" @keyup.enter.native="joinRoom('')"></a-input></span>
          <a-button @click="joinRoom('')" style="margin-left: 10px;">加入房间</a-button>
        </div>
      </a-col>
      <!-- 在线人数 -->
      <a-row :span="4" v-if="currentRoomId && currentRoomType == 'public'">
        当前房间id：<span style="color: red;">{{ currentRoomId }}</span>
        <span style="margin-left: 20px;">房间在线人数：<span style="color:orangered">{{ userList.length }}</span></span>
        <span class="userList">
          <a-dropdown>
            <down-outlined style="color: orangered;margin-left: 10px;" />
            <template #overlay>
              <a-menu style="min-width: 100px">
                <a-menu-item v-for="(item) in userList" @click="privateChat(item)"
                  :disabled="(item as any).userId == userId">
                  <span v-if="(item as any).userId == userId"><user-outlined style="margin-right: 10px;" />{{ (item as
                    any).userName }}<span style="margin-left: 20px;">(我)</span></span>
                  <span v-else>
                    <a-tooltip placement="leftTop">
                      <template #title>
                        <span>点击私信{{ (item as any).userName }}</span>
                      </template>
                      <user-outlined style="margin-right: 10px;" />{{ (item as any).userName }}
                    </a-tooltip>
                  </span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </span>
      </a-row>
    </a-row>
  </div>
  <!-- 内容区域 -->
  <div class="content" ref="content">
    <div class="msgItem" v-for="(item, index) in messageList">
      <!-- 进入离开房间通知 -->
      <div class="sysNotice" v-if="item.type == 0">{{ item.message == 'join' ? `${item.userId ==
        userId ? '你' : (item as any).userName}进入了房间` :
        `${item.userId ==
          userId ? '你' : (item as any).userName}离开了房间` }}（{{ getFormatDate(item.date) }}）
      </div>
      <div v-else>
        <!-- 聊天信息 -->
        <div :class="{ my: item.userId == userId, other: item.userId != userId }">
          <div class="header" v-if="item.userId == userId">
            <span style="margin-right: 20px;color: gray;">{{ getFormatDate(item.date) }}</span>
            <span>我</span>
            <img :src="avatar">
          </div>
          <div class="header" v-else>
            <img :src="(item as any).avatar">
            <span style="margin-left: 20px;">{{ (item as any).userName }}</span>
            <span style="color: gray;">{{ getFormatDate(item.date) }}</span>
          </div>
          <div class="msg" v-if="item.type == '1'">{{ item.message }}</div>
          <div class="msg" v-if="item.type == '2'">
            <sound-outlined @click="playAudio(item, index)" style="font-size: 14px;margin-right: 5px;"
              :style="{ color: currentIndex == index ? 'yellowgreen' : 'gray' }" />
            {{ (item as any).speakTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 房间列表 -->
  <div class="room-list" v-if="roomList.length > 0 && currentRoomId">
    <div class="title">房间列表</div>
    <div class="room-item" v-for="item in roomList" :class="{ active: currentRoomId == (item as any).roomId }">
      <div class="room-header">
        <img :src="currentRoomId == (item as any).roomId ? '/public/首页.png' : '/public/首页 (1).png'">
      </div>
      <div class="room-desc">
        <div style="font-size: 20px;">{{ (item as any).includeUserList ? `和${getPrivateName(item.includeUserList)}的私聊` :
          (item as
            any).roomId
        }}<span v-if="currentRoomId == (item as any).roomId">（当前）</span></div>
        <a-button type="primary" @click="joinRoom('group', item)" style="margin-right: 20px;">{{ (item as
          any).includeUserList ? '私聊' : '加入聊天室' }}</a-button>
      </div>
    </div>
  </div>
  <!-- 底部 -->
  <div class="footer">
    <div class="tool">
      <ToolGrid :currentRoomType="currentRoomType" @selectEmotion="selectEmotion" @video="video"
        @shareScreen="shareScreen" @audio="audio"></ToolGrid>
    </div>
    <a-textarea v-model:value="msg" :auto-size="{ minRows: 4, maxRows: 4 }" placeholder="请输入信息" style="width: 1600px;"
      allow-clear @pressEnter="pressEnter" />
    <!-- 麦克风 -->
    <a-popover>
      <template #content>长按发送语音</template>
      <div class="microphone" @mousedown="mouseDown" @mouseup="mouseUp">
        <img @dragstart.prevent v-if="!isSpeaking" src="./asset/microphone.png">
        <img @dragstart.prevent v-else src="./asset/microphone-active.png">
      </div>
    </a-popover>
    <a-button @click="send" style="margin-left: 10px;">发送</a-button>
  </div>
  <!-- 私信请求中（请求方） -->
  <a-modal centered :closable="false" v-model:visible="privateRequesting"
    :ok-button-props="{ style: { display: 'none' } }" :cancel-button-props="{ style: { display: 'none' } }">
    <p>正在向{{ toId }}发起私信请求...</p>
  </a-modal>
  <!-- 私信通知（被请求方） -->
  <a-modal centered v-model:visible="privateVisible" :maskClosable="false" title="私信通知" @ok="acceptPrivate"
    @cancel="rejectPrivate" okText="同意" cancelText="拒绝">
    <p>{{ fromId }}想要向你发起私信，是否同意ta的私信请求？</p>
  </a-modal>
  <!-- 视频请求中(请求方)-->
  <a-modal centered v-model:visible="videoVisible" :maskClosable="false" title="视频通知" @ok="acceptVideo"
    @cancel="rejectVideo" okText="同意" cancelText="拒绝">
    <p>{{ fromId }}想要向你发起视频，是否同意ta的视频请求？</p>
  </a-modal>
  <!-- 视频框 -->
  <a-modal centered :keyboard="false" :closable="false" v-model:visible="videoModalVisible" width="60%"
    :maskClosable="false" title="视频通话框" @cancel="hangUpVideo" :ok-button-props="{ style: { display: 'none' } }"
    cancelText="挂断">
    <div class="video-container">
      <h3 class="resetTime">视频时长：{{ resetTime.hour }}:{{ resetTime.min }}:{{ resetTime.second }}</h3>
      <a-row>
        <a-col :span="12">
          <div class="mine">（我）</div>
          <video autoplay id="localVideo"></video>
        </a-col>
        <a-col :span="12">
          <div class="mine" v-if="isVideoRequesting">等待对方接听</div>
          <div class="mine" v-else>对方</div>
          <video autoplay id="remoteVideo"></video>
        </a-col>
      </a-row>
    </div>
  </a-modal>
  <!-- 视频通话反馈 -->
  <a-modal centered v-model:visible="videoRateVisible" :maskClosable="false" title="通话反馈"
    :ok-button-props="{ style: { display: 'none' } }" cancelText="确定" @cancel="rateCancel">
    <h3 class="resetTime">本次视频总时长时长：{{ resetTime.hour }}:{{ resetTime.min }}:{{ resetTime.second }}</h3>
    <p>你的评价：<a-rate v-model:value="rateValue" /></p>
  </a-modal>
  <!-- 共享屏幕请求中（请求方） -->
  <a-modal centered :closable="false" v-model:visible="shareRequesting" :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }">
    <p>正在向{{ toId }}发起共享屏幕请求...</p>
  </a-modal>
  <!-- 共享屏幕通知 -->
  <a-modal centered v-model:visible="shareVisible" :maskClosable="false" title="共享屏幕通知" @ok="acceptShare"
    @cancel="rejectShare" okText="同意" cancelText="拒绝">
    <p>{{ fromId }}想要向你共享屏幕，是否同意ta的共享屏幕请求？</p>
  </a-modal>
  <!-- 共享屏幕模态框 -->
  <a-modal centered :keyboard="false" :closable="false" v-model:visible="shareModalVisible" width="60%"
    :maskClosable="false" title="共享屏幕模态框" @cancel="hangUpShare" :ok-button-props="{ style: { display: 'none' } }"
    cancelText="挂断">
    <div class="video-container">
      <h3 class="resetTime">共享时长：{{ resetTime.hour }}:{{ resetTime.min }}:{{ resetTime.second }}</h3>
      <a-row>
        <a-col :span="1">
          <video autoplay id="localVideo" style="width: 1px;height: 1px;display: none;"></video>
        </a-col>
        <a-col :span="23">
          <video autoplay id="remoteShareVideo" style="border: none;height: 600px;"></video>
        </a-col>
      </a-row>
    </div>
  </a-modal>
  <!-- 语音通话通知-->
  <a-modal centered v-model:visible="audioVisible" :maskClosable="false" title="语音通知" @ok="acceptAudio"
    @cancel="rejectAudio" okText="同意" cancelText="拒绝">
    <p>{{ fromId }}想要向你发起语音通话，是否同意ta的语音通话请求？</p>
  </a-modal>
  <!-- 语音通话模态框 -->
  <a-modal centered :keyboard="false" :closable="false" v-model:visible="audioModalVisible" width="25%"
    :maskClosable="false" :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }">
    <div class="audio-container">
      <div class="avatar">
        <img src="/public/goods12.jpg">
      </div>
      <h2 v-if="audioRequesting">等待对方接听中...</h2>
      <div class="userName">useName-{{ toId }}</div>
      <div class="time" v-if="!audioRequesting">{{ resetTime.hour }}:{{ resetTime.min }}:{{ resetTime.second }}</div>
      <div class="hangUpAudio" @click="hangUpAudio"></div>
    </div>
    <audio id="localAudio"></audio>
    <audio id="remoteAudio" autoplay></audio>
  </a-modal>
  <!-- 麦克风讲话中 -->
  <a-modal centered :closable="false" v-model:visible="isSpeaking" :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }">
    <div style="display: flex;align-items: center;">
      <img src="./asset/microphone.png" style="height: 30px;">
      <p style="text-align: center;margin-top: 20px;margin-left: 20px;">正在讲话中：{{ speakTime }}s</p>
    </div>
    <span style="color: #5f5f5f;font-size: 12px;margin-left: 50px;">(鼠标离开右下角麦克风松开取消发送)</span>
  </a-modal>
  <!-- 麦克风讲话结束选择发送 -->
  <a-modal centered title="选择发送" :closable="false" v-model:visible="isSelectSend"
    :ok-button-props="{ style: { display: 'none' } }" :cancel-button-props="{ style: { display: 'none' } }">
    <div v-if="!isBack">
      <SoundOutlined @click.stop="audition" style="cursor: pointer;margin-right: 5px"></SoundOutlined>(点击试听-{{ speakTime
      }}秒)
      <a-button @click="sendAudio" size="small">发送语音</a-button>
      <br>
      <div style="margin-top: 10px;">
        识别结果:{{ text }}
        <a-button @click="sendText" size="small">发送文字</a-button>
      </div>
    </div>
    <div v-else>
      等待语音识别中....
    </div>
  </a-modal>
  <userInfoModal @userInfo="userInfo" />
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, nextTick, watch, watchEffect } from "vue"
import io from 'socket.io-client'
import Recorder from 'js-audio-recorder'
import { message } from "ant-design-vue";
import { DownOutlined, UserOutlined, SoundOutlined } from '@ant-design/icons-vue';
import moment from 'moment'
import { audioToText } from '../api/index'
import ToolGrid from './modules/toolList.vue'
import userInfoModal from './modules/userInfoModal.vue'
type Id = number | string

// 采集用户信息
const userInfo = (data) => {
  userName.value = data.userName
  avatar.value = data.avatar
  console.log(userName.value, avatar.value);
}
// 模拟用户id
let userId = (Math.random() * 100).toFixed(2)
// 用户昵称
let userName = ref('')
// 用户头像
let avatar = ref('')
// 模拟用户的socketId
let socketId = ref<Id>('')
// 房间id
let roomId = ref<Id>('')
// 当前房间id
let currentRoomId = ref<Id>('')
// 当前房间类型
let currentRoomType = ref<string>('public')
// 发起方的id
let fromId = ref<Id>('')
// 发起方的socketId
let fromSocketId = ref<Id>('')
// 接收方的id
let toId = ref<Id>('')
// 接收方socketId
let toSocketId = ref<Id>('')
// 视频反馈分数
let rateValue = ref('')
// 录音实例
let recorder = ref<any>(undefined)
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
interface IMessageInfo {
  // roomId: unknown,
  type: string | number,
  // 用户房间聊天
  userId?: any,
  // 用于私信聊天
  toId?: any,
  fromId?: any,
  message: string,
  date: string,
}
/**
 * 0：系统消息
 * 1：用户消息
 */
let messageList = ref<IMessageInfo[]>([])
// 房间列表
const roomList = ref<any>([])
// 用户列表
const userList = computed((): Array<string | number> => {
  let list = []
  roomList.value.forEach((item: any) => {
    if (item.roomId == currentRoomId.value) list = item.userList
  })
  return list
})

let socket
// 加入房间
function joinRoom(type?: string, item?: any) {
  if (type == '' && (roomId.value == '' || (roomId.value as any).split(' ').join('') == '')) return message.warning('请输入房间id')
  if (type && currentRoomId.value == item.roomId) return message.warning('当前已在该房间')
  // 是否为私聊房间
  if (type && item.type == 'private') {
    let { includeUserList, roomId } = item
    toId.value = getPrivateName(includeUserList)
    toSocketId.value = getPrivateSocketId(roomId)
  }
  socket.emit('leave', { userId, roomId: currentRoomId.value, type: currentRoomType.value })
  socket.emit('joinRoom',
    { userId, roomId: type ? item.roomId : roomId.value, userName: userName.value, avatar: avatar.value }
  )
  currentRoomId.value = JSON.parse(JSON.stringify(type ? item.roomId : roomId.value))
  currentRoomType.value = type ? item.type : 'public'
  roomId.value = ''
  // console.log('currentRoomId.value', currentRoomId.value);
}

// 初始话录音实例
recorder.value = new Recorder()
// 字符串转arrayBuffer数组
const strToAb = (str: any) => {
  const buffer = new ArrayBuffer(str.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return buffer;
}
// arrayBuffer数组转字符串 
const abToStr = (buffer: any) => {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return str;
}
let speakTimer: any = null
// 讲话时间
const speakTime = ref(0)
// 当前播放的音频索引
const currentIndex = ref(-1)
// 是否正在讲话
const isSpeaking = ref(false)
// 是否显示发送选择
const isSelectSend = ref(false)
// 语音转文字结果是否返回
const isBack = ref(false)
// 语音识别的文字
let text = ref('')
// 语音arrayBuffer数据
let audioData = ref([])
// 麦克风鼠标按下
const mouseDown = () => {
  speakTime.value = 0
  isSpeaking.value = true
  if (recorder.value) recorder.value.destroy()
  recorder.value = null
  recorder.value = new Recorder()
  // 开始录制
  recorder.value.start()
  if (speakTimer) clearInterval(speakTimer)
  speakTimer = setInterval(() => { speakTime.value += 1 }, 1000)
  console.log('mouseDown', recorder.value);
}
// 麦克风鼠标松开
const mouseUp = () => {
  isSpeaking.value = false
  recorder.value.stop()
  const formData = new FormData()
  const blob = recorder.value.getWAVBlob()// 获取wav格式音频数据
  // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
  const newBlob = new Blob([blob], { type: 'audio/wav' })
  const fileOfBlob = new File([newBlob], new Date().getTime() + '.wav')
  formData.append('audioFile', fileOfBlob)
  if (speakTimer) clearInterval(speakTimer)
  // 把格式转为arrayBuffer格式保存
  blob.arrayBuffer().then(async (arrayBuffer) => {
    // 销毁录音实例
    if (!currentRoomId.value) {
      message.error('请先加入房间')
    } else {
      isBack.value = true
      isSelectSend.value = true
      let { data: res } = await audioToText(formData)
      text.value = res.text == '' ? '语音识别失败' : res.text
      audioData.value = arrayBuffer
      isBack.value = false
    }
  })
}
// 试听
const audition = () => recorder.value.play(audioData.value)
// 发送文字
const sendText = () => {
  socket.emit('message', { roomId: currentRoomId.value, userId, message: text.value ? text.value : '语音识别结果未返回', userName: userName.value, avatar: avatar.value })
  isSelectSend.value = false
  recorder.value.destroy()
  recorder.value = null
}
// 发送语音
const sendAudio = () => {
  socket.emit('message', { roomId: currentRoomId.value, userId, message: abToStr(audioData.value), speakTime: speakTime.value, userName: userName.value, avatar: avatar.value })
  isSelectSend.value = false
  recorder.value.destroy()
  recorder.value = null
}
// 不在麦克风区域松开表示不发送
let body = document.body
body.addEventListener('mouseup', () => {
  if (isSpeaking.value) {
    isSpeaking.value = false
    if (speakTimer) clearInterval(speakTimer)
    speakTime.value = 0
    recorder.value.stop()
    // 销毁录音实例
    recorder.value.destroy()
    recorder.value = null
    console.log('松开');
  }
})
// 播放arrayBuffer类型的音频
async function play(arrayBuffer) {
  const audioCtx = new window.AudioContext();
  const decodedData = await audioCtx.decodeAudioData(arrayBuffer);
  const source = audioCtx.createBufferSource();
  source.buffer = decodedData;
  source.connect(audioCtx.destination);
  source.start(0);
}
// 播放语音
const playAudio = (item, index) => {
  currentIndex.value = index
  play(strToAb(item.message))
  setTimeout(() => {
    currentIndex.value = -1
  }, item.speakTime * 1000)
}
// 发送消息
const msg = ref('')
const send = () => {
  if (!currentRoomId.value) return message.error('请先加入房间')
  // console.log(msg.value);
  socket.emit('message', { roomId: currentRoomId.value, userId, message: msg.value, userName: userName.value, avatar: avatar.value })
  msg.value = ''
}

// 发起私聊
const privateChat = (item) => {
  toId.value = item.userId
  toSocketId.value = item.socketId
  privateRequesting.value = true
  // console.log(item);
  socket.emit('private', { fromId: userId, fromSocketId: socketId.value, toId: item.userId, toSocketId: item.socketId })
}
// 私信通知框
const privateVisible = ref(false)
// 是否正在请求私信
const privateRequesting = ref(false)
// 同意私信请求
const acceptPrivate = () => {
  socket.emit('acceptPrivate', { fromId: fromId.value, fromSocketId: fromSocketId.value, toId: userId, toSocketId: socketId.value })
  privateVisible.value = false
}
// 拒绝私信请求
const rejectPrivate = () => {
  socket.emit('rejectPrivate', { fromSocketId: fromSocketId.value, toId: userId, toSocketId: socketId.value })
  fromId.value = ''
  fromSocketId.value = ''
}

// 是否正在请求视频通话
const isVideoRequesting = ref(false)
// 视频通知框的显示与隐藏
const videoVisible = ref(false)
// 视频通话框的显示与隐藏
const videoModalVisible = ref(false)
// 视频通话评价的显示与隐藏
const videoRateVisible = ref(false)
// 定时器
let timer: any = null
// 视频通话的相关参数
const videoCallState = reactive<any>({
  localVideo: document.querySelector('#localVideo') || null,
  remoteVideo: document.querySelector('#remoteVideo') || null,
  localStream: null,
  remoteStream: null,
  // 身份(视频通话发起者或者接收者,sender和receiver)
  identity: '',
})
// 获取本地视频媒体流并根据参数设置播放视频
const getLocalStream = (localVideoEl: HTMLAudioElement, callback: any) => {
  navigator.mediaDevices.getUserMedia({
    video: {
      // 前置摄像头
      // facingMode: {
      //   exact: 'environment'
      // },
    }, audio: true
  }).then((stream) => {
    videoCallState.localStream = stream
    if (localVideoEl) {
      localVideoEl.srcObject = stream
      // 获取到本地视频流后的回调函数
      callback()
    }
  }).catch(err => { console.log(err); })
}
// 把秒转换为小时:分钟:秒
const resetTime = computed(() => {
  type timeType = number | string
  let hour: timeType = parseInt((commonState.times / 3600 % 24) + '')
  let min: timeType = parseInt((commonState.times / 60 % 60) + '')
  let second: timeType = parseInt((commonState.times % 60) + '')
  hour = hour < 10 ? '0' + hour : hour
  min = min < 10 ? '0' + min : min
  second = second < 10 ? '0' + second : second
  return { hour, min, second }
})
// 视频请求
const video = () => {
  videoCallState.identity = 'sender'
  isVideoRequesting.value = true
  videoModalVisible.value = true
  nextTick(() => {
    videoCallState.localVideo = document.querySelector('#localVideo')
    videoCallState.remoteVideo = document.querySelector('#remoteVideo')
    // 创建rtc实例
    commonState.peer = new RTCPeerConnection({ iceServers: commonState.iceServers })
    getLocalStream(videoCallState.localVideo, async () => {
      // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
      videoCallState.localStream.getTracks().forEach((track) => {
        commonState.peer.addTrack(track, videoCallState.localStream)
      })
      createOffer(() => {
        socket.emit('video', { fromId: userId, fromSocketId: socketId.value, toId: toId.value, toSocketId: toSocketId.value, offerSdp: commonState.offerSdp })
      }, videoCallState.remoteVideo)
    })
  })
}
// 同意视频请求
const acceptVideo = () => {
  videoCallState.identity = 'receiver'
  videoVisible.value = false
  videoModalVisible.value = true
  // 创建rtc实例
  nextTick(() => {
    videoCallState.localVideo = document.querySelector('#localVideo')
    videoCallState.remoteVideo = document.querySelector('#remoteVideo')
    // 创建rtc实例
    commonState.peer = new RTCPeerConnection({ iceServers: commonState.iceServers })
    // 这里主要用于生成添加本地媒体流到webRtc实例用于answerSdp
    getLocalStream(videoCallState.localVideo, async () => {
      // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
      videoCallState.localStream.getTracks().forEach((track) => {
        commonState.peer.addTrack(track, videoCallState.localStream)
        if (timer) clearInterval(timer)
        timer = setInterval(() => {
          commonState.times += 1
        }, 1000)
      })
      createAnswer(() => {
        socket.emit('acceptVideo', { fromId: fromId.value, fromSocketId: fromSocketId.value, toId: userId, toSocketId: socketId.value, answerSdp: commonState.answerSdp })
      }, videoCallState.remoteVideo)
    })
  })
}
// 拒绝视频请求
const rejectVideo = () => socket.emit('rejectVideo', { fromSocketId: fromSocketId.value, toId: userId, toSocketId: socketId.value })
// 挂断视频
const hangUpVideo = () => {
  // console.log("挂断者的身份", videoCallState.identity);
  let data = {
    identity: videoCallState.identity,
    userId,
    socketId: videoCallState.identity == 'sender' ? toSocketId.value : fromSocketId.value
  }
  socket.emit('hangUpVideo', data)
  // 关闭对等连接
  commonState.peer.close()
  videoRateVisible.value = true
  clearInterval(timer)
  commonState.peer = null
}
// 关闭视频评价
const rateCancel = () => {
  videoRateVisible.value = false
  commonState.times = 0
}

// 是否正在请求共享屏幕
let shareVisible = ref(false)
// 是否显示共享屏幕模态框
let shareModalVisible = ref(false)
// 是否正在请求共享屏幕中
let shareRequesting = ref(false)
// 共享屏幕参数
let shareScreenState = reactive<any>({
  localStream: '',
  remoteVideo: '',
  localVideo: '',
})
// 获取本地屏幕共享媒体流
const getDisplayLocalStream = (callback: any) => {
  navigator.mediaDevices.getDisplayMedia(({ video: true, audio: true })).then((stream) => {
    shareScreenState.localStream = stream
    //监听手动点击“停止分享”
    stream.getVideoTracks()[0].onended = () => {
      commonState.peer.close()
      commonState.peer = null
      socket.emit('hangUpShare', { toSocketId: toSocketId.value, fromId: userId })
    }
    callback()
  }).catch(err => { console.log(err); })
}
// 屏幕共享
const shareScreen = () => {
  // 创建rtc实例
  commonState.peer = new RTCPeerConnection({ iceServers: commonState.iceServers })
  getDisplayLocalStream(async () => {
    shareScreenState.localStream.getTracks().forEach((track) => {
      commonState.peer.addTrack(track, shareScreenState.localStream)
    })
    createOffer(() => {
      socket.emit('shareScreen', { fromId: userId, fromSocketId: socketId.value, toId: toId.value, toSocketId: toSocketId.value, offerSdp: commonState.offerSdp })
    })
  })
}
// 同意屏幕共享
const acceptShare = () => {
  shareModalVisible.value = true
  shareRequesting.value = false
  shareVisible.value = false
  nextTick(async () => {
    shareScreenState.remoteVideo = document.querySelector('#remoteShareVideo')
    shareScreenState.localVideo = document.querySelector('#localVideo')
    // 创建rtc实例
    commonState.peer = new RTCPeerConnection({ iceServers: commonState.iceServers })
    getLocalStream(shareScreenState.localVideo, async () => {
      // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
      videoCallState.localStream.getTracks().forEach((track) => {
        commonState.peer.addTrack(track, videoCallState.localStream)
      })
      if (timer) clearInterval(timer)
      timer = setInterval(() => {
        commonState.times += 1
      }, 1000)
      createAnswer(() => {
        socket.emit('acceptShareScreen', { fromId: fromId.value, fromSocketId: fromSocketId.value, toId: userId, toSocketId: socketId.value, answerSdp: commonState.answerSdp })
      }, shareScreenState.remoteVideo)
    })
  })
}
// 拒绝屏幕共享
const rejectShare = () => socket.emit('rejectShareScreen', { toId: userId, fromSocketId: fromSocketId.value })
// 挂断屏幕共享
const hangUpShare = () => {
  clearInterval(timer)
  timer = null
  commonState.peer.close()
  commonState.peer = null
  commonState.times = 0
  socket.emit('hangUpShare', { fromSocketId: fromSocketId.value, toId: userId })
}

// 是否显示语音通话模态框
const audioVisible = ref(false)
// 是否正在请求语音通话
const audioRequesting = ref(false)
// 是否显示语音通话模态框
const audioModalVisible = ref(false)
// 语音通话相关参数
const audioState = reactive<any>({
  localAudio: document.querySelector('#localAudio') || '',
  remoteAudio: document.querySelector('#remoteAudio') || '',
  localStream: '',
  remoteStream: ''
})
// 获取本地语音媒体流
const getLocalAudioStream = (localVideoEl, callback: () => void) => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    localVideoEl.srcObject = stream
    audioState.localStream = stream
    console.log('audioState.localStream', audioState.localStream);
    callback()
  })
}
// 语音通话
const audio = () => {
  audioRequesting.value = true
  audioModalVisible.value = true
  // 创建rtc实例
  commonState.peer = new RTCPeerConnection({ iceServers: commonState.iceServers })
  nextTick(() => {
    audioState.localAudio = document.querySelector('#localAudio')
    audioState.remoteAudio = document.querySelector('#remoteAudio')
    getLocalAudioStream(audioState.localAudio, () => {
      // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
      audioState.localStream.getTracks().forEach((track) => {
        commonState.peer.addTrack(track, audioState.localStream)
      })
      createOffer(() => {
        socket.emit('audio', { fromId: userId, fromSocketId: socketId.value, toId: toId.value, toSocketId: toSocketId.value, offerSdp: commonState.offerSdp })
      }, audioState.remoteAudio)
    })
  })
}
// 同意语音通话
const acceptAudio = () => {
  audioVisible.value = false
  audioModalVisible.value = true
  // 创建rtc实例
  commonState.peer = new RTCPeerConnection({ iceServers: commonState.iceServers })
  nextTick(() => {
    audioState.localAudio = document.querySelector('#localAudio')
    audioState.remoteAudio = document.querySelector('#remoteAudio')
    getLocalAudioStream(audioState.localAudio, () => {
      // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
      audioState.localStream.getTracks().forEach((track) => {
        commonState.peer.addTrack(track, audioState.localStream)
      })
      createAnswer(() => {
        if (timer) clearInterval(timer)
        timer = setInterval(() => {
          commonState.times += 1
        }, 1000)
        socket.emit('acceptAudio', { fromId: fromId.value, fromSocketId: fromSocketId.value, toId: userId, toSocketId: socketId.value, answerSdp: commonState.answerSdp })
      }, audioState.remoteAudio)
    })
  })
}
// 拒绝语音通话
const rejectAudio = () => {
  socket.emit('rejectAudio', { fromSocketId: fromSocketId.value, toId: userId })
  audioVisible.value = false
}
//挂断语音通话
const hangUpAudio = () => {
  audioModalVisible.value = false
  clearInterval(timer)
  timer = null
  commonState.peer.close()
  commonState.peer = null
  commonState.times = 0
  socket.emit('hangUpAudio', { fromSocketId: fromSocketId.value, toId: userId })
}

// 建立socket连接并监听消息
const connection = () => {
  socket = io('https://192.168.0.102:8888')
  // 监听建立连接
  socket.on('connect', () => { console.log('建立信令连接成功') })
  socket.on('socketId', (data) => socketId.value = data)
  // 监听断开连接
  socket.on('disconnect', () => console.log('断开与信令服务器的连接'))
  // 监听来自服务端的信息
  socket.on('message', (data) => {
    // console.log('messageList', data);
    // 如果为私有房间过滤掉系统消息
    if (currentRoomType.value == 'private') {
      data = data.filter(item => item.type !== 0)
    }
    messageList.value = data
    // console.log('message', messageList.value);
    scrollBottom()
  })
  // 监听用户加入房间成功
  socket.on('joinRoom', (data) => {
    // console.log('joinRoom', data);
    // 如果为私有房间过滤掉系统消息
    if (currentRoomType.value == 'private') {
      data = data.filter(item => item.type == 1)
    }
    messageList.value = data
    scrollBottom()
  })
  // 监听房间列表的变化
  socket.on('roomList', (data) => {
    // 过滤公共房间和私信房间
    let publicRoomList = data.filter(item => item.type == 'public')
    let privateRoomList = data.filter(item => item.type == 'private')
    // 用户可见的私信房间
    let visibleArr: any = []
    if (privateRoomList.length > 0) {
      privateRoomList.forEach(item => {
        if (item.includeUserList.indexOf(userId) !== -1) visibleArr.push(item)
      })
    }
    roomList.value = [...publicRoomList, ...visibleArr]
    scrollBottom()
  })
  // 监听到私聊请求
  socket.on('private', (data) => {
    fromId.value = data.fromId
    fromSocketId.value = data.fromSocketId
    privateVisible.value = true
    // console.log('private', data);
  })
  // 监听接收私信请求
  socket.on('acceptPrivate', (data) => {
    privateRequesting.value = false
    message.success(data + '接受了你的私信请求')
  })
  // 监听拒绝私信请求
  socket.on('rejectPrivate', (data) => {
    privateRequesting.value = false
    message.error(data + '拒绝了你的私信请求')
    // 退出加入的房间
    socket.emit('leave', { userId, roomId: socketId.value + ',' + toSocketId.value, type: 'private' })
  })
  // 监听客户端加入房间
  socket.on('joinPrivate', (data) => joinRoom('group', data))
  // 监听视频请求
  socket.on('video', (data) => {
    let { offerSdp } = data
    // 接收到对方的offerSdp
    commonState.offerSdp = offerSdp
    fromId.value = data.fromId
    fromSocketId.value = data.fromSocketId
    videoVisible.value = true
  })
  // 监听接收视频请求
  socket.on('acceptVideo', async (data) => {
    isVideoRequesting.value = false
    message.success(data.toId + '接受了你的视频请求')
    // console.log('commonState.peer', commonState.peer);
    await commonState.peer.setRemoteDescription(JSON.parse(data.answerSdp))
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      commonState.times += 1
    }, 1000)
  })
  // 监听拒绝视频请求
  socket.on('rejectVideo', (data) => {
    // console.log('rejectVideo', data); 
    isVideoRequesting.value = false
    videoModalVisible.value = false
    message.error(data + '拒绝了你的视频请求')
  })
  // 监听视频通话挂断
  socket.on('hangUpVideo', (data) => {
    commonState.peer.close()
    videoRateVisible.value = true
    clearInterval(timer)
    commonState.peer = null
    message.warning(data + '挂断了与你的视频通话')
    videoModalVisible.value = false
  })
  // 监听共享屏幕
  socket.on('shareScreen', (data) => {
    fromId.value = data.fromId
    commonState.offerSdp = data.offerSdp
    fromSocketId.value = data.fromSocketId
    shareVisible.value = true
  })
  // 监听同意共享屏幕
  socket.on('acceptShareScreen', async (data) => {
    message.success(data.toId + '接受了你的屏幕共享请求')
    shareRequesting.value = false
    await commonState.peer.setRemoteDescription(JSON.parse(data.answerSdp))
  })
  // 监听拒绝共享屏幕
  socket.on('rejectShareScreen', (data) => {
    shareRequesting.value = false
    // 通过js关闭共享媒体流
    shareScreenState.localStream.getTracks().forEach(track => track.stop())
    message.error(data.toId + '拒绝了你的屏幕共享请求')
  })
  // 监听挂断屏幕共享
  socket.on('hangUpShare', (data) => {
    commonState.peer.close()
    commonState.peer = null
    let n = data.toId ? '挂断了你的' : '停止了'
    message.error(`${data.toId ?? data.fromId}${n}屏幕共享`)
    shareScreenState.localStream.getTracks().forEach(track => track.stop())
    if (data.fromId) shareModalVisible.value = false
  })
  // 监听语音通话请求
  socket.on('audio', (data) => {
    audioVisible.value = true
    fromId.value = data.fromId
    fromSocketId.value = data.fromSocketId
    commonState.offerSdp = data.offerSdp
  })
  // 监听同意语音通话
  socket.on('acceptAudio', async (data) => {
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      commonState.times += 1
    }, 1000)
    console.log('acceptAudio', data);
    message.success(data.toId + '接受了你的语音通话请求')
    audioRequesting.value = false
    await commonState.peer.setRemoteDescription(JSON.parse(data.answerSdp))
  })
  // 监听拒绝语音通话
  socket.on('rejectAudio', (data) => {
    message.error(data.toId + '拒绝了你的语音通话请求')
    audioState.localStream.getTracks().forEach(track => track.stop())
    audioModalVisible.value = false
    console.log('acceptAudio', data);
  })
  // 监听挂断语音通话
  socket.on('hangUpAudio', (data) => {
    commonState.peer.close()
    commonState.peer = null
    message.error(`对方挂断的语音通话`)
    audioState.localStream.getTracks().forEach(track => track.stop())
    audioModalVisible.value = false
  })
}
connection()

// 滚动到底部
const content = ref(null)
const scrollBottom = () => {
  if (content.value) nextTick(() => { (content.value as any).scrollTop = (content.value as any).scrollHeight })
}
// 按下回车
const pressEnter = e => {
  if (e.ctrlKey && e.keyCode == 13) {
    msg.value += '\n';
  } else {
    e.preventDefault();
    send();
  }
};
// 选择表情
const selectEmotion = val => msg.value += val
// 获取格式化后的时间
const getFormatDate = (str: string): string => moment(str).format('YYYY-MM-DD HH:mm:ss')
// 处理私信房间名称(获取对方id)
const getPrivateName = (list: Array<string>): string => {
  let tempArr = list.filter(item => item !== userId)
  return tempArr[0]
}
// 获取对方SocketId
const getPrivateSocketId = (socketStr: string): string => {
  let socketIdArr = socketStr.split(',')
  let temArr = socketIdArr.filter(item => item != socketId.value)
  return temArr[0]
}
// 创建offerSdp
const createOffer = async (icecandidateCallback, el?) => {
  // 接收到远程的媒体流
  commonState.peer.ontrack = (e) => { if (el) el.srcObject = e.streams[0] }
  // 监听 RTCPeerConnection 的 onicecandidate 事件，当 ICE 服务器返回一个新的候选地址时，就会触发该事件
  commonState.peer.onicecandidate = async (event: any) => {
    if (event.candidate) {
      commonState.offerSdp = JSON.stringify(commonState.peer.localDescription)
      if (commonState.offerSdp) icecandidateCallback()
    }
  }
  // 本地创建offer并设为本地描述
  const offer = await commonState.peer.createOffer()
  await commonState.peer.setLocalDescription(offer)
}
// 创建answerSdp
const createAnswer = async (icecandidateCallback, el?) => {
  // 接收到远程的媒体流
  commonState.peer.ontrack = (e) => { if (el) el.srcObject = e.streams[0] }
  commonState.peer.onicecandidate = async (event: any) => {
    if (event.candidate) {
      commonState.answerSdp = JSON.stringify(commonState.peer.localDescription)
      if (commonState.answerSdp) icecandidateCallback()
    }
  }
  await commonState.peer.setRemoteDescription(JSON.parse(commonState.offerSdp))
  const answer = await commonState.peer.createAnswer()
  await commonState.peer.setLocalDescription(answer)
}

onMounted(async () => {
  // 浏览器销毁退出房间
  window.addEventListener("beforeunload", (e) => socket.emit('leave', { userId, roomId: currentRoomId.value, currentRoomType: currentRoomType.value, userName: userName.value, avatar: avatar.value }));
})

</script>

<style lang="less" scoped>
.tooltip {
  font-weight: 600;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: rgba(48, 156, 255);
}

.content {
  width: 100%;
  height: 800px;
  padding: 0 0 0 500px;
  overflow: auto;
  background-image: url('/public/2014061007022710.jpg');
  background-size: cover;

  .msgItem {
    width: 100%;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;

    .sysNotice {
      width: 100%;
      font-weight: 600;
      color: gray;
      text-align: center;
    }

    .other {
      .header {
        height: 30px;
        line-height: 30px;
        font-weight: 600;

        span {
          margin-left: 10px;
        }

        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }

      .msg {
        width: 80%;
        background: #F5F5F5;
        min-height: 10px;
        border-radius: 5px;
        padding: 10px;
        margin-left: 40px;

      }
    }

    .my {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-end;

      .header {
        height: 30px;
        line-height: 30px;
        font-weight: 600;

        span {
          margin-right: 10px;
        }

        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }

      .msg {
        width: 80%;
        background: rgb(151, 225, 252);
        min-height: 10px;
        border-radius: 5px;
        padding: 10px;
        margin-right: 40px;
        white-space: pre-wrap;
      }
    }
  }
}

.room-list {
  width: 450px;
  height: 600px;
  overflow: auto;
  position: absolute;
  top: 100px;
  background: #FFFFFF;
  border-radius: 15px;

  .title {
    text-align: center;
    border-bottom: 1px solid rgb(219, 218, 218);
    padding: 10px;
  }

  .room-item {
    cursor: pointer;
    width: 100%;
    height: 80px;
    background: white;
    display: flex;
    align-items: center;
    border-bottom: 1px solid orange;

    &:hover {
      background: #e2e4e6;
    }

    .room-header {
      padding-left: 10px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }

    .room-desc {
      font-weight: 600;
      transition: all .3s;
      margin-left: 3px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }

  .active {
    background: #e2e4e6;
    color: #1296db;
  }
}

.footer {
  background-image: url('/public/2014061007022710.jpg');
  box-sizing: border-box;
  padding-bottom: 8px;
  padding-right: 20px;
  border-top: 1px solid gray;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  height: calc(100vh - 850px);
  display: flex;
  position: relative;


  .tool {
    width: 200px;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 0;
    top: 0;
  }

  .microphone {
    position: absolute;
    z-index: 999999;
    right: 110px;
    bottom: 20px;
    cursor: pointer;

    img {
      width: 25px;
      height: 25px;
    }
  }

}

.video-container {
  width: 100%;
  min-height: 100px;

  .resetTime {
    width: 100%;
    text-align: center;
    color: rgb(79, 194, 240);
    text-shadow: 0 0 2px skyblue;
  }

  .mine {
    height: 20px;
    text-align: center;
    font-weight: 600;
  }

  video {
    width: 95%;
    height: 400px;
    border: 1px solid blue;
  }
}

.audio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 500px;
  background-image: url('/public/2014061007022710.jpg');
  background-size: cover;
  padding-top: 20px;
  border-radius: 5px;

  .avatar {
    text-align: center;

    img {
      width: 75px;
      height: 75px;
      border-radius: 75px;
    }
  }

  .userName,
  .time {
    font-size: 18px;
    font-weight: 600;
    margin-top: 20px;
  }

  .time {
    font-weight: 400;
    margin-top: 5px;
    font-size: 14px;
  }

  .hangUpAudio {
    cursor: pointer;
    margin-top: 250px;
    background-image: url('./asset/hangUp.png');
    background-size: cover;
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }

  .hangUpAudio:hover {
    transition: all .3s;
    opacity: 0.8;
  }
}
</style>