<template>
  <div class="container">
    <div class="grid-item">
      <a-popover placement="top" style="margin-bottom: 20px;">
        <template #content>
          <div style="width: 560px">
            <span @click="emotionClick(item)" style="margin-right: 10px;cursor: pointer;" v-for="item in list">{{ item
            }}</span>
          </div>
        </template>
        <template #title>
          <span>emotion</span>
        </template>
        <img src="../asset/emotion.png" class="emotion">
      </a-popover>
    </div>
    <div class="grid-item" v-if="currentRoomType == 'private'">
      <a-popover placement="top" style="margin-bottom: 20px;">
        <template #content>
          <span>发起视频聊天</span>
        </template>
        <img src="../asset/video.png" @click="video" class="video">
      </a-popover>
    </div>
    <div class="grid-item" v-if="currentRoomType == 'private'">
      <a-popover placement="top" style="margin-bottom: 20px;">
        <template #content>
          <span>屏幕共享</span>
        </template>
        <img src="../asset/shareScreen.png" @click="shareScreen" class="shareScreen">
      </a-popover>
      <div class="grid-item" style="margin-left: -110px;margin-top: 12px;"  v-if="currentRoomType == 'private'">
        <a-popover placement="top" style="margin-bottom: 20px;">
          <template #content>
            <span>语音通话</span>
          </template>
          <img src="../asset/audio.png" @click="audio" class="audio">
        </a-popover>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import list from '../asset/emotion'
const emit = defineEmits(['selectEmotion', 'video', 'shareScreen', 'audio'])
const prop = defineProps({
  currentRoomType: {
    type: String,
    default: ''
  }
})

const emotionClick = (item) => {
  console.log(item);
  emit('selectEmotion', item)
}

const video = () => {
  emit('video')
}

const shareScreen = () => {
  emit('shareScreen')
}

const audio = () => {
  emit('audio')
}

</script>

<style lang="less" scoped>
.container {
  padding: 16px 8px ;
  width: 100%;
  height: 100%;
  display: flex;

  .grid-item {
    text-align: center;
    width: 33.3%;
    height: 30px;

    .emotion {
      cursor: pointer;
    }

    .video {
      cursor: pointer;
      transform: scale(0.7);
    }

    .shareScreen {
      font-weight: 600;
      cursor: pointer;
    }

    .audio {
      cursor: pointer;
    }
  }
}
</style>