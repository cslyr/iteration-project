<template>
   <div id="text">
    <span v-for="item in list" v-html="item"></span>
  </div>
  
  <div v-html="html"> </div>
  <button @click="add">点击</button>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue"
import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render/auto-render'

const list = ref([
  '$7\\times4$ =28'
])
let html = ref()

console.log(MathJax);

const TypeSet = async function (elementId) {
  if (!window.MathJax) {
    return
  }
  window.MathJax.startup.promise = window.MathJax.startup.promise
    .then(() => {
      return window.MathJax.typesetPromise()
    })
    .catch((err) => console.log('Typeset failed: ' + err.message))
  return window.MathJax.startup.promise
}

const add = () => {
  list.value.push('<h1>标题</h1>$1\\div1$')

  nextTick(() => {
    TypeSet()
  })


  onMounted(() => {
    TypeSet()
  })
  // nextTick(() => {
  //   renderMathInElement(document.querySelector('#text'), {
  //     // customised options
  //     // • auto-render specific keys, e.g.:
  //     delimiters: [
  //       { left: '$$', right: '$$', display: true },
  //       { left: '$', right: '$', display: false },
  //       { left: '\\(', right: '\\)', display: false },
  //       { left: '\\[', right: '\\]', display: true },
  //     ],
  //     // • rendering keys, e.g.:
  //     throwOnError: false,
  //   });
  // })
  // let dom = document.getElementById('text')
  // renderMathInElement(document, renderOption)
  // console.log(dom?.innerHTML);
}

</script>

<style lang="less" scoped></style>