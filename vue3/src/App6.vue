<template>
  我的socketId：<span>{{ socketId }}</span>
  <a-input v-model:value="msg"></a-input>
  <a-button @click="send">发送</a-button>
  <br>
  用户列表
  <ul>
    <li v-for="item in userList" style="cursor: pointer;" @click="privite(item)">{{ item }}</li>
  </ul>
  消息列表
  <ul>
    <li v-for="item in msgList">{{ item.socketId }}-{{ item.msg }}</li>
  </ul>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { io } from "socket.io-client";
let msgList = ref([])
let priviteMsgList = ref([])
let anotherSocketId = ref('')
const msg = ref('')
const send = () => {
  if (anotherSocketId.value) {
    socket.emit('privite message', { anotherSocketId: anotherSocketId.value, msg: msg.value })
  } else {
    socket.emit('message', msg.value)
  }
}

const privite = (item) => {
  console.log('开启私聊');
  anotherSocketId.value = item
  console.log('对方id：', anotherSocketId.value);
}

let socketId = ref('')
let socket
onMounted(() => {
  socket = io('ws://127.0.0.1:9999')
  socket.on('connect', (data) => {
    socketId.value = socket.id
    socket.on('message', (data) => {
      msgList.value = data
      console.log(data, socket.id);
    })

    socket.on('privite message', (data) => {
      console.log(data);
    })
  })
})

const userList = computed(() => {
  let mapArr = msgList.value.map(item => item.socketId)
  return mapArr
})



</script>
<style></style>
