<template>
  <div class="main" ref="main">
    <!-- 这个dom的作用就是让滚动条反应实际数据的长度 -->
    <div id="virtualDom" ref="virtualDom"></div>
    <div class="showView" ref="showView">
      <li class="el" v-for="item in showData" :key="`id`+item.title">{{ item.title }}</li>
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
  // 页面视图的高度
  visibleHeight: 0,
  // 单条元素高度
  elHeight: 100,
  // 展示的数据量
  elCount: 0,
 
  // 需要展示数据的初始索引
  startIndex: 0,
  // 需要展示数据的结束所用
  endIndex: 0
})

// 初始化
function init () {
  for (let i = 0; i < 1000; i++)  totalData.value.push({ title: 'this is title' + i, id: i + 1 }); // 初始化数据操作
  virtualDom.value.style.height = state.elHeight * totalData.value.length + 'px'; // 总高度是多高
  state.visibleHeight = document.documentElement.clientHeight // 视图的高度
  state.elCount = Math.ceil(state.visibleHeight / state.elHeight)// 视图能够容纳多少的div
  state.endIndex = state.startIndex + state.elCount// 对应的索引是从哪里开始到哪里结束
  showData.value = totalData.value.slice(state.startIndex, state.endIndex)// 渲染课时区域的数据
}

onMounted(() => {
  init()
  main.value.addEventListener('scroll', (e) => {
    state.startIndex = Math.floor(e.target.scrollTop / state.elHeight)// 滚动条距离顶部的高度/没一个div的高度
    state.endIndex = state.startIndex + state.elCount // 开始的位置加上能容纳的大小
    showData.value = totalData.value.slice(state.startIndex, state.endIndex)// 展示的数据范围
    // 计算偏移量
    showView.value.style.top = e.target.scrollTop -(e.target.scrollTop % state.elHeight)  +'px'
    console.log('e.target.scrollTop',e.target.scrollTop)
    // console.log(showData.value);
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