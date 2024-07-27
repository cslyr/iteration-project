<template>
  <h1>parents</h1>
  <hr>
  <slotCpn>
    <template v-slot:bodyCell="{ row }">
      <div style="background: red;">
        {{ row.name }}
      </div>
    </template>
  </slotCpn>
</template>
<script setup>
import slotCpn from './components/slotCpn.vue';

</script>
<style lang="less"></style>