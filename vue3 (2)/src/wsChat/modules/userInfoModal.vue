<template>
  <a-modal v-model:visible="visible" :keyboard="false" title="个人信息" width="50%" wrap-class-name="full-modal"
    :cancel-button-props="{ style: { display: 'none' } }" okText="确定" @ok="handleOk">
    <div style="height: 400px;padding: 20px;">
      <a-row>
        <a-col :span="3">
          <span
            style="line-height: 78px;font-size: 20px;text-shadow: 0 2px 4px rgba(0, 0, 0, .5);color: rgba(0, 0, 0, 0.5);">用户昵称:</span>
        </a-col>
        <a-col :span="10">
          <div class="inputGroup">
            <input type="text" required autocomplete="off" v-model="userName">
            <label for="name">Name</label>
          </div>
          <!-- <a-input style="margin-top: -8px;margin-left: 8px;" v-model:value="userName"></a-input> -->
        </a-col>
      </a-row>
      <div class="avatar" style="font-size: 20px;text-shadow: 0 2px 4px rgba(0, 0, 0, .5);color: rgba(0, 0, 0, 0.5);">
        用户头像:
        <img class="currentImg" :src="currentImg">
      </div>
      <div class="avatarList">
        <img class="avatarItem" :class="{ active: item == currentImg }" v-for="item in avatarList" :src="item"
          @click="imageSelect(item)" />
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import avatarList from '../asset/avatar'
import { message } from "ant-design-vue";
const emit = defineEmits(['userInfo'])
const visible = ref(true)
const userName = ref('')
const currentImg = ref(avatarList[0])
const handleOk = () => {
  if (userName.value == '' || userName.value.split('').join('') == '') return message.error('请输入用户昵称')
  emit('userInfo', { userName: userName.value, avatar: currentImg.value })
  visible.value = false
}
const imageSelect = (item) => currentImg.value = item

</script>

<style lang="less" scoped>
.inputGroup {
  font-family: 'Segoe UI', sans-serif;
  margin: 1em 0 1em 0;
  max-width: 290px;
  position: relative;
}

.inputGroup input {
  font-size: 100%;
  padding: 0.8em;
  outline: none;
  border: 2px solid rgb(200, 200, 200);
  background-color: transparent;
  border-radius: 20px;
  width: 100%;
}

.inputGroup label {
  font-size: 100%;
  position: absolute;
  left: 0;
  padding: 0.8em;
  margin-left: 0.5em;
  pointer-events: none;
  transition: all 0.3s ease;
  color: rgb(100, 100, 100);
}

.inputGroup :is(input:focus, input:valid)~label {
  transform: translateY(-50%) scale(.9);
  margin: 0em;
  margin-left: 1.3em;
  padding: 0.4em;
  background-color: white;
}

.inputGroup :is(input:focus, input:valid) {
  border-color: rgb(150, 150, 200);
}

.avatar {
  margin-top: 20px;

  .currentImg {
    width: 75px;
    height: 75px;
    box-shadow: rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px;
    margin-left: 18PX;
    border-radius: 50%;
  }
}

.avatarList {
  width: 65%;
  margin-top: 30px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

  .avatarItem {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    margin: 16px;
  }

  .avatarItem:hover {
    cursor: pointer;
    box-shadow: rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px;
    animation: rotate 1s linear;
  }

  .active {
    box-shadow: rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0) scale(1);
    }

    25% {
      transform: rotate(120deg) scale(0.8);
    }

    50% {
      transform: rotate(240deg) scale(0.6);
    }

    75%,
    100% {
      transform: scale(1) rotate(360deg);
    }
  }
}
</style>