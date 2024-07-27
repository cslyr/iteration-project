<template>
  <div class="main" ref="main">
    <div id="virtualDom" ref="virtualDom"></div>
    <div class="showView" ref="showView">
      <li class="el" v-for="item in showData">{{ item.title }}</li>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
let main = ref()
let virtualDom = ref()
const showView = ref()
// 模拟后端返回的总数居
const totalData = ref([]);
// 可视区域渲染的数据
let showData = ref([])
// 全局数据
const state = reactive({
  // 可用高度
  visibleHeight: 0,
  // 单条元素高度
  elHeight: 100,
  // 展示的数据量
  elCount: 0,
  // 虚拟容器高度
  virtualDomHeight: 0,
  // 需要展示数据的初始索引
  startIndex: 0,
  // 需要展示数据的结束所用
  endIndex: 0
})

// 初始化
function init () {
  for (let i = 0; i < 1000; i++)  totalData.value.push({ title: 'this is title' + i, id: i + 1 });
  virtualDom.value.style.height = state.elHeight * totalData.value.length + 'px';
  state.virtualDomHeight = state.elHeight * totalData.value.length;
  state.visibleHeight = document.documentElement.clientHeight
  state.elCount = Math.ceil(state.visibleHeight / state.elHeight)
  state.endIndex = state.startIndex + state.elCount
  showData.value = totalData.value.slice(state.startIndex, state.endIndex)
}

onMounted(() => {
  init()
  main.value.addEventListener('scroll', (e) => {
    state.startIndex = Math.floor(e.target.scrollTop / state.elHeight)
    state.endIndex = state.startIndex + state.elCount
    showData.value = totalData.value.slice(state.startIndex, state.endIndex)
    // 计算偏移量
    showView.value.style.top = e.target.scrollTop -(e.target.scrollTop % state.elHeight)  +'px'
    console.log(showData.value);
  })
})
</script>
<style scoped lang='less'>
.main {
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: relative;
  overscroll-behavior: contain;
}

#virtualDom {
  width: 100%;
  position: absolute;
  top: 0;
}

.showView {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;

  .el {
    height: 100px;
    box-sizing: border-box;
    border: 1px solid green;
  }
}
</style>