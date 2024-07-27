<template>
  <div class="container">
    <!-- 头部聊天内容 -->
    <div class="container-header">
       <div ref="mathContainer">
      $$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$
    </div>
    <button @click="rerenderMath">Re-render Math</button>
    <div id="math-container">
      <!-- 这里使用双花括号来避免 Vue 解析，直接展示 LaTeX 代码 -->
      <span v-html="mathCode"></span>
    </div>
      <!-- 初始欢迎语 -->
      <div class="ask">
        <div class="ask-answer">
          <span class="ask-answer-icon"></span>
          <span class="ask-answer-content">
            <div class="inner-content inner-content-pre">
              <span style="display: block;">Hi，我是AI小助，欢迎来到知识的世界！</span>
              <span style="display: block;">请勇敢地提出你的问题，分享你的想法，让我们一起在学习的道路上共同成长，共同进步。</span>
            </div>
          </span>
        </div>
      </div>
      <!-- 一轮问答模板 -->
      <div class="ask">
        <div class="ask-questions">
          <span class="ask-questions-content">
            <div class="inner-content">
              很抱歉，您仍然没有提供具体的输入内容，所以我无法给出回复。请提供您想要讨论或问的具体内容，这样我才能给出相应的回复或建议。如果您有任何问题或疑惑，请告诉我，我会尽力解答并提供帮助。请随时告诉我您的需求，我会尽快回复您。
            </div>
          </span>
          <span class="ask-questions-icon"></span>
        </div>
        <div class="ask-answer">
          <span class="ask-answer-icon"></span>
          <span class="ask-answer-content">
            <div class="inner-content">
              很抱歉，您仍然没有提供具体的输入内容，所以我无法给出回复。请提供您想要讨论或问的具体内容，这样我才能给出相应的回复或建议。如果您有任何问题或疑惑，请告诉我，我会尽力解答并提供帮助。请随时告诉我您的需求，我会尽快回复您。
            </div>
            <div class="inner-icon">
              <img class="inner-icon-image" :src="hoverImage ? defaultImageState : hoverImageState"
                @mouseover="hoverImage = true" @mouseleave="hoverImage = false" mode="scaleToFill" />
            </div>
          </span>
        </div>
      </div>
      <div class="ask">
        <div class="ask-questions">
          <span class="ask-questions-content">
            <div class="inner-content">
              很抱歉，您仍然没有提供具体的输入内容，所以我无法给出回复。请提供您想要讨论或问的具体内容，这样我才能给出相应的回复或建议。如果您有任何问题或疑惑，请告诉我，我会尽力解答并提供帮助。请随时告诉我您的需求，我会尽快回复您。
            </div>
          </span>
          <span class="ask-questions-icon"></span>
        </div>
        <div class="ask-answer">
          <span class="ask-answer-icon"></span>
          <span class="ask-answer-content">
            <div class="inner-content">
              很抱歉，您仍然没有提供具体的输入内容，所以我无法给出回复。请提供您想要讨论或问的具体内容，这样我才能给出相应的回复或建议。如果您有任何问题或疑惑，请告诉我，我会尽力解答并提供帮助。请随时告诉我您的需求，我会尽快回复您。
            </div>
            <div class="inner-icon">
              <img class="inner-icon-image" :src="hoverImage ? defaultImageState : hoverImageState"
                @mouseover="hoverImage = true" @mouseleave="hoverImage = false" mode="scaleToFill" />
            </div>
          </span>
        </div>
      </div>
      <!-- 暂停内容 -->
    </div>
    <div class="stop">
      <img src="./images/stop-icon.png" class="stop-icon">
      停止生成
    </div>
   
    <!-- 数据输入框 -->
    <div class="container-bottom" ref="containerBottom">
      <a-textarea v-model:value="messageContent" class="textarea-content" placeholder="请输入内容，换行请用Shift+回车"
        :auto-size="{ minRows: 1, maxRows: 5 }" />
      <div class="container-bottom-button">
        <button :class="buttonClass ? 'action-button' : 'action-button-loading'" @click="sendMessage">发送</button>
        <div class="clear-btn" v-show="clearButtonState" @click="onClearMessage"></div>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
// import { MathJax } from 'mathjax-vue3'
// import { initMathJax, renderByMathjax } from 'mathjax-vue3';
const mathContainer = ref(null);
// const mathCode = ref('$$\\int_0^\\infty e^{-x^2} dx=\\frac{\\sqrt{\\pi}}{2}$$');

// onMounted(() => {
//   initMathJax({}, () => {
//     const el = document.getElementById('math-container');
//     renderByMathjax(el);
//   });
// });
const MathJax=ref(null)
function initMathJax() {
  // 检查window对象上是否已经存在MathJax对象，避免重复加载
  if (!MathJax.value) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      MathJax.value.Hub.Config({
        skipStartupTypeset: true,
        showProcessingMessages: false,
        messageStyle: "none",
        tex2jax: {
          inlineMath: [["$", "$"], ["\\(", "\\)"]],
          displayMath: [['$$', '$$'], ["\\[", "\\]"]],
          processEscapes: true
        },
        SVG: {
          linebreaks: {
            automatic: true,
            width: "container"
          }
        }
      });
      MathJax.value.Ajax.config.path["mhchem"] = "/mhchem";
      MathJax.value.Hub.Config({
        TeX: {
          extensions: ["[mhchem]/mhchem.js"]
        }
      });
    };
  } else {
    // 如果MathJax已经存在，则只需要重新排版页面中的数学内容
    MathJax.value.Hub.Queue(["Typeset", MathJax.value.Hub]);
  }
}


// function injectMathJax() {
//   if (!window.MathJax) {
//     const script = document.createElement('script');
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML';
//     script.async = true;
//     document.head.appendChild(script);
//   }
// }

// function initMathJax() {

//   injectMathJax();
//   window.MathJax = {
//     tex: {
//       inlineMath: [['$', '$']],
//       displayMath: [['$$', '$$']],
//       processEnvironments: true,
//       processRefs: true,
//     },
//     options: {
//       skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
//       ignoreHtmlClass: 'tex2jax_ignore',
//     },
    
//     svg: {
//       fontCache: 'global',
//     },
//   };
//   console.log(window.MathJax)
// }



onMounted(() => {
  initMathJax();
});





//当鼠标悬浮到复制imag当中的时候
const hoverImage = ref<boolean>(true)
const hoverImageState = '../src/images/copy-static.png';
const defaultImageState = '../src/images/copy-active.png';
//输入框
const containerBottom = ref(null)
//输入框高度
const containerBottomHeight = ref(null)

//内容展示区域
//当窗口发生变化的时候及时调整高度
function adjustHeights(height) {
  const containerHeader = document.querySelector('.container-header');
  containerHeader.style.height = `calc(100vh - ${height}px)`; // 设置container-header的高度
}

window.addEventListener('resize', () => adjustHeights(containerBottomHeight.value)); // 监听窗口变化
//输入框输入的内容
const messageContent = ref<string>('');
//发送按钮的样式
let buttonClass = ref<boolean>(true)
//清空内容按钮的样式
let clearButtonState = ref<boolean>(true)
//设置清空
clearButtonState = computed(() => messageContent.value.trim() !== '');
const sendMessage = () => {
  setTimeout(() => {
    buttonClass.value = !buttonClass.value;
  }, 1000);
}
//点击清空按钮清空输入框当中的内容
const onClearMessage = () => {
  messageContent.value = ''
}
onMounted(() => {
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { height } = entry.contentRect;
      containerBottomHeight.value = height
      adjustHeights(height)
      console.log(containerBottomHeight.value, 'value')
      console.log(`Element's height: ${height}px`, containerBottom.value.style);
    }
  });
  if (containerBottom.value) {
    resizeObserver.observe(containerBottom.value);
  }


})
</script>
<style scoped lang="less">
/* 上面的样式 */
.container-header {
  /* position: relative; */
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.container {
  height: 100vh;
  width: 100vw;
  /* display: flex; */
  position: relative;
  flex-direction: column;

  .container-bottom {
    position: absolute;
    width: 100%;
    bottom: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: end;
    padding: 5px 20px 10px 10px;
    border: 2px solid #ccc;
    border-radius: 30px;
    min-height: 60px;
  }

  .container-bottom::before {
    content: "";
    position: absolute;
    top: -52px;
    left: 0;
    width: 100%;
    height: 52px;
    pointer-events: none; //鼠标点击的时候穿透这个样式
    background: linear-gradient(180deg, hsla(0, 0%, 100%, 0), #fff); //从上到下实现渐变
    z-index: -1;
  }
}




.stop {
  position: absolute;
  bottom: 90px;
  padding: 10px;
  border-radius: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f9f9f9;
  cursor: pointer;

  // background-color: #0cd7a6;
}

.stop-icon {
  margin-right: 5px;
}

/* 聊天框整体样式 */
.ask {
  display: flex;
  flex-direction: column;
  /* max-width: 600px; */
  width: 100%;
  /* 控制聊天框的最大宽度 */
  margin: 20px 0;

  padding: 15px;
}

/* 问题部分样式 */
.ask-questions {
  display: flex;
  margin-bottom: 10px;
}

.ask-questions-icon {
  width: 36px;
  height: 36px;

  /* 圆形图标 */
  margin-left: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.ask-questions-content {
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 60px;
  flex: 1;
  /* 占满剩余空间 */
  font-size: 14px;
  color: #333;
  /* 深色文字 */
  padding-top: 16px;
  padding-bottom: 40px;
}

/* 回答部分样式 */
.ask-answer {
  display: flex;
}

.ask-answer-icon {
  width: 36px;
  height: 36px;
  margin-right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ask-answer-content {
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 120px;

  flex: 1;
  /* 占满剩余空间 */
  font-size: 14px;
  color: #333;
  padding-top: 16px;
}

.inner-content {
  line-height: 25px;
  font-size: 15px;
  margin: 0 30px 0 30px;
  text-align: left;
  overflow-y: hidden;
  overflow-x: auto;
  max-width: 100%;
  white-space: pre-wrap;
  display: inline-block;
  padding-bottom: 0;
  color: #1a1a1a;
  word-break: break-all;

}

.inner-content-pre {
  display: flex;
  flex-direction: column;
}

/* 添加额外的图标样式，如需要 */
.ask-questions-icon::before {
  content: '';
  border-radius: 14px;
  display: block;
  width: 100%;
  height: 100%;
  background: url('./images/customer.png') no-repeat center center;
  background-size: cover;
}

.ask-answer-icon::before {
  content: '';
  display: block;
  border-radius: 14px;
  width: 100%;
  height: 100%;
  background: url('./images/answer-block.png') no-repeat center center;
  background-size: cover;
}

.inner-icon {
  display: flex;
  justify-content: end;
  width: 100%;
  height: 40px;
}

.inner-icon-image {
  width: 24px;
  height: 24px;
  margin-right: 30px;
  cursor: pointer;
}

/* 下部的样式 */
:deep(.ant-input:focus) {
  border: none !important
}

:deep(.ant-input) {
  border: none !important
}

.textarea-content {
  font-size: 16px;
}

.textarea-content::placeholder {
  color: #a9a9a9 !important;
  font-weight: 500;
  font-size: 16px;
}



.container-bottom-button {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

.action-button {
  background-color: #0cd7a6;
  border: none;
  color: white;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 20px;
  outline: none;
}

.action-button-loading {
  background-color: #6de7ca;
  border: none;
  color: white;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 10px;
  border-radius: 20px;
  cursor: default;
  outline: none;
}

.clear-btn {
  margin-top: 10px;

  width: 35px;
  /* 设置按钮的宽度 */
  height: 35px;
  /* 设置按钮的高度 */
  opacity: 0.6;
  /* 初始透明度 */
  position: relative;
  /* 用于定位内部的线条 */
  cursor: pointer;
  /* 鼠标悬停时的指针样式 */
}

/* 鼠标悬停时改变透明度 */
.clear-btn:hover {
  opacity: 1;
}

/* 创建两条交叉的线条 */
.clear-btn:before,
.clear-btn:after {
  content: ' ';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  /* 线条的长度 */
  height: 2px;
  /* 线条的厚度 */
  background-color: #333;
  /* 线条的颜色 */
}

/* 将线条旋转形成X */
.clear-btn:before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.clear-btn:after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
