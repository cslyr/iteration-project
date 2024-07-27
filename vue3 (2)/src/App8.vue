<template>
  <div id="text">
    <span v-for="item in list" v-html="item"></span>
  </div>
  <button @click="add">点击</button>
  <!-- <div v-html="html"></div> -->
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue"

// const renderOption = {
//   delimiters: [
//     { left: '$$', right: '$$', display: true },
//     { left: '$', right: '$', display: false },
//     { left: '\\(', right: '\\)', display: false },
//     { left: '\\[', right: '\\]', display: true }
//   ],
//   throwOnError: false
// }

// var html = katex.renderToString(String.raw`$1+1$`, {
//     throwOnError: false,
//     delimiters: 
// 	[
// 		{left: "$$", right: "$$", display: true},
//   		{left: "$", right: "$", display: false}
// 	]
// });

// console.log(html);


// // 引入katex下的自动渲染函数
// import renderMathInElement from 'katex/contrib/auto-render/auto-render'

// // 定义自动渲染的配置参数,这些参数根据你的需求进行修改，下面的参数是官网上抄下来的
// const renderOption = {
//   delimiters: [
//     { left: '$$', right: '$$', display: true },
//     { left: '$', right: '$', display: false },
//     { left: '\\(', right: '\\)', display: false },
//     { left: '\\[', right: '\\]', display: true }
//   ],
//   throwOnError: false
// }

const list = ref([
  '$7\\times4$ =28'
])

const add = () => {
  console.log(MathJax);

  list.value.push('$1+1$')
  // let dom = document.getElementById('text')
  // renderMathInElement(document, renderOption)
  // console.log(dom?.innerHTML);
  nextTick(() => {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById('app')]);
  })
}
onMounted(() => {
  MathJax.Hub.Config({ tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] } });
})


</script>

<style scoped>
::v-deep .CtxtMenu_MenuFrame {
  background: red;
}
</style>