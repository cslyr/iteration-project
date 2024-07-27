<template>
  <div class="container-header">

  </div>
 <div class="container-button">
    <input type="text" class="input-box" placeholder="请输入内容，换行请用Shift+回车">
   
    <button class="action-button">发送</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'


</script>



<style scoped>
.container-header{
  background-color: aqua;
  height: 80%;
  width: 100%;
}
.container-button {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 30px;
  width: 80%;
  height: 20%;
  margin: 20px;
}

.input-box {
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
}

.action-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 20px;
}
</style>
