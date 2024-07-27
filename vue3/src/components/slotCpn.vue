<template>
  <div class="main">
    <ul>
      <li style="width: 100%;background: pink;margin: 5px 0 ;" v-for="item in list">
        <slot name="bodyCell" :row="item"></slot>
      </li>
    </ul>
    <button @click="age += 1">++</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const list = [
  { id: 1, name: 'zs', age: 18 },
  { id: 2, name: 'ls', age: 20 },
]
let age = ref(18)

</script>
<style lang="less">
.main {
  width: 300px;
  height: 200px;
  border: 1px solid skyblue;
}
</style>