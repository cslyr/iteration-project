<template>
  <div class="test">
    <h1>这是标题</h1>
    <p>第一个段落。</p>
    <p>第二个段落。</p>
    <p>第三个段落。</p>
    <p>第四个段落。</p>
    <p>第五个段落。</p>
  </div>
</template>

<script>

export default {
  setup () {

  }
}
</script>
<style scoped lang="less">
p:nth-of-type(2) {
  background: #ff0000;
}
</style>