<template>
  <div>
    子组件 - {{ msg }} -{{ a }} - {{ obj }} - {{ name }} -{{ b }} - {{ str }}
    <button @click="obj.name += '*'">obj</button>
    <button @click="name += '*'">name</button>

  </div>
</template>

<script setup>
import { ref, reactive, toRef, watch, } from 'vue';
const props = defineProps({
  msg: {
    type: String,
    default: ''
  }
})
const obj = reactive({
  name: 'zs'
})

console.log(props);
let b = props.msg

let name = obj.name

let str = '111111111111'
str += 99999999

// console.log('namenamename',name);

// console.log('obj', obj);
// console.log('obj.name', obj.name);

// console.log('props', props);
// let a = toRef(props, 'msg')
// console.log('子组件', props.msg);
// console.log('toRef', a);
</script>
<style scoped lang='less'></style>