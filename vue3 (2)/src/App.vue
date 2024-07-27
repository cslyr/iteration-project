<template>
  <div>
    <a-input v-model:value="text" placeholder="add content" style="width: 85%;" />
    <a-button type="primary" @click="addMessage">+ 添加</a-button>
    <div class="container">
      <div class="sideNavBar" ref="sideNavBar">
        <li class="navItem" v-for="(item, index) in navBarList" :key="item.id" :class="{ active: index == currentIndex }"
          @click="navHandler(item, index)">{{ item.name }}
        </li>
        <a-input id="navIpt" v-model:value="navTitle" placeholder="add group" style="width: 85%;" v-if="isAddNav"
          ref="iptNav" />
        <button @click="addNav" style="width: 85%;margin: 0 auto;text-align: center;" v-else>+ 添加</button>
      </div>
      <div class="svg" ref="svg">
        <svg @click="showHandler" v-if="isShow" t="1679390473516" class="icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="3946" width="16" height="16">
          <path
            d="M588.760756 774.738983c-12.232602 0-24.325012-5.54939-32.263821-16.071024L384.879276 531.125593c-11.063987-14.667048-10.836813-34.969443 0.592494-49.382711l171.616636-216.645179c13.837146-17.485233 39.244816-20.425192 56.729026-6.578836 17.466814 13.845333 20.415982 39.251979 6.578836 56.729026L468.147748 507.419681l152.824641 202.616674c13.43601 17.798365 9.875928 43.134403-7.922437 56.55404C605.774245 772.086573 597.222475 774.738983 588.760756 774.738983L588.760756 774.738983zM588.760756 774.738983"
            fill="#272636" p-id="3947"></path>
          <path
            d="M511.999488 958.708971c-60.288085 0-118.779244-11.813047-173.885306-35.124985-53.203736-22.49227-100.963483-54.704926-141.986805-95.710852-41.024345-41.006949-73.219605-88.784092-95.710852-141.987828C77.103564 630.79664 65.290517 572.288085 65.290517 512s11.813047-118.788453 35.126009-173.894516c22.491247-53.194526 54.686507-100.962459 95.710852-141.978618 41.023322-41.015136 88.783069-73.218582 141.986805-95.719038 55.106062-23.303752 113.597221-35.116799 173.885306-35.116799s118.79664 11.813047 173.901679 35.116799c53.187363 22.500457 100.963483 54.703903 141.970432 95.719038 41.005926 41.016159 73.218582 88.784092 95.709829 141.978618 23.312962 55.106062 35.126009 113.606431 35.126009 173.894516s-11.813047 118.79664-35.126009 173.885306c-22.491247 53.203736-54.703903 100.980879-95.709829 141.987828-41.006949 41.005926-88.784092 73.218582-141.970432 95.710852C630.796128 946.895925 572.287573 958.708971 511.999488 958.708971L511.999488 958.708971zM511.999488 146.056494c-201.786773 0-365.93532 164.156734-365.93532 365.943506s164.147524 365.952716 365.93532 365.952716 365.93532-164.165943 365.93532-365.952716S713.786261 146.056494 511.999488 146.056494L511.999488 146.056494zM511.999488 146.056494"
            fill="#272636" p-id="3948"></path>
        </svg>
        <svg @click="showHandler" v-else t="1679390453149" class="icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="2945" width="16" height="16">
          <path
            d="M435.23822 774.738983c-8.462742 0-17.013489-2.65241-24.289196-8.149611-17.799388-13.418614-21.358447-38.755676-7.922437-56.55404L555.850206 507.419681l-152.247496-192.171788c-13.837146-17.476023-10.889001-42.88267 6.578836-56.729026 17.48421-13.846356 42.890856-10.906397 56.729026 6.578836L638.526183 481.742882c11.429307 14.413268 11.656481 34.715663 0.592494 49.382711l-171.616636 227.542366C459.564255 769.189593 447.470823 774.738983 435.23822 774.738983L435.23822 774.738983zM435.23822 774.738983"
            fill="#272636" p-id="2946"></path>
          <path
            d="M511.999488 958.708971c-60.288085 0-118.79664-11.813047-173.901679-35.124985-53.187363-22.49227-100.963483-54.704926-141.970432-95.710852-41.005926-41.006949-73.218582-88.784092-95.709829-141.987828C77.103564 630.79664 65.290517 572.288085 65.290517 512s11.813047-118.788453 35.126009-173.894516c22.491247-53.194526 54.703903-100.962459 95.709829-141.978618 41.006949-41.015136 88.784092-73.218582 141.970432-95.719038 55.106062-23.303752 113.613594-35.116799 173.901679-35.116799S630.778732 77.104075 685.884794 100.407827c53.203736 22.500457 100.963483 54.703903 141.986805 95.719038 41.024345 41.016159 73.219605 88.784092 95.710852 141.978618 23.312962 55.106062 35.126009 113.606431 35.126009 173.894516s-11.813047 118.79664-35.126009 173.885306c-22.491247 53.203736-54.686507 100.980879-95.710852 141.987828-41.023322 41.005926-88.783069 73.218582-141.986805 95.710852C630.778732 946.895925 572.287573 958.708971 511.999488 958.708971L511.999488 958.708971zM511.999488 146.056494c-201.786773 0-365.93532 164.156734-365.93532 365.943506s164.147524 365.952716 365.93532 365.952716 365.93532-164.165943 365.93532-365.952716S713.786261 146.056494 511.999488 146.056494L511.999488 146.056494zM511.999488 146.056494"
            fill="#272636" p-id="2947"></path>
        </svg>
      </div>
      <div class="rightContent" v-if="navBarList.length > 0">
        <div v-for="(item, index) in navBarList[currentIndex].chatContent" :key="index">
          <div>
            <div class="chatItem user">{{ item[0].content }}<span style="color:orangered">&nbsp;:User&nbsp;</span></div>
            <div class="chatItem" v-if="item.length > 1"><span style="color:orange;position: absolute;top: 0;">Ai&nbsp;:&nbsp;</span>
              <span style="margin-top: 20px;">{{ item[1].content }}</span>
            </div>
          </div>
        </div>
        <div class="chatItem" v-if="isLoading"><span style="color:orange">Ai&nbsp;:&nbsp;</span>....加载中</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
const text = ref('')
const navTitle = ref('')
const isAddNav = ref(false)
const iptNav = ref(null)
let sideNavBar = ref(null)
let svg = ref(null)
const isLoading = ref(false)
const currentIndex = ref(0)
const isShow = ref(true)
let navBarList = reactive([{ id: 1, name: 'title', chatContent: [] }])
const addMessage = () => {
  if (text.value == '') return
  isLoading.value = true
  let currentChatContent = navBarList[currentIndex.value].chatContent
  currentChatContent.push([{ by: 'user', content: text.value }])
  let timer;
  setTimeout(() => {
    let str ='i am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from darki am ai from dark'
    let index = 0
    currentChatContent[currentChatContent.length - 1].push({ by: 'ai', content: ''})
    timer = setInterval(() => {
      if (currentChatContent[currentChatContent.length - 1][1].content.length < str.length) {
        currentChatContent[currentChatContent.length - 1][1].content += str[index]
        index += 1
      } else {
        clearInterval(timer)
      }
    }, 10)
    isLoading.value = false
  }, 500)
  text.value = ''
}
const addNav = () => {
  isAddNav.value = true
  nextTick(() => {
    iptNav.value.focus()
    document.querySelector('#navIpt').addEventListener("blur", function () {
      if (navTitle.value == '') return
      navBarList.push({ id: navBarList[navBarList.length - 1].id + 1, name: navTitle.value, chatContent: [] })
      isAddNav.value = false
      navTitle.value = ''
    })
  })
}
const navHandler = (item, index) => {
  if (currentIndex.value === index) return false
  currentIndex.value = index
}

const showHandler = () => {
  if (isShow.value) {
    console.log(sideNavBar.value);
    sideNavBar.value.style.width = 0
    svg.value.style.left = 0 + 'px'
    isShow.value = false
  } else {
    sideNavBar.value.style.width = 200 + 'px'
    isShow.value = true
    svg.value.style.left = 193 + 'px'
  }
}

onMounted(() => {

})
</script>

<style  lang="less">
.container {
  width: 85vw;
  height: 90vh;
  display: flex;
  border: 1px solid silver;

  .sideNavBar {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    background: skyblue;
    position: relative;

    .navItem {
      list-style: none;
      width: 90%;
      background: silver;
      margin: 10px auto;
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      cursor: pointer;
    }

    .active {
      background: greenyellow;
    }

  }

  .svg {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 193px;
    transform: translateY(-50%);
    z-index: 999;
  }

  .rightContent {
    display: flex;
    flex-direction: column;
    flex: 1;
    background: rgb(235, 232, 232);
    min-height: 100%;


    .chatItem {
      position: relative;
      display: flex;
      align-items: center;
      width: 90%;
      box-sizing: border-box;
      margin: 10px auto;
      min-height: 50px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      // overflow-wrap: anywhere
    }

    .user {
      display: flex;
      justify-content: flex-end;
    }
  }


}
</style>
