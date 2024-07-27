<template>
  <a-modal visible>
    <a-tree-select v-model:value="value" show-search style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
      tree-default-expand-all :tree-data="treeData" tree-node-filter-prop="label">
    </a-tree-select>
    <a-input v-model="text"></a-input>
  </a-modal>
</template>
<script lang="ts">
import type { TreeSelectProps } from 'ant-design-vue';
import { defineComponent, onMounted, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<string>();
    const treeData = ref<TreeSelectProps['treeData']>([]);
    watch(value, () => {
      console.log(value.value);
    });
    const text = ref('')
    onMounted(() => {
      for (let i = 0; i < 80000; i++) {
        treeData.value.push({
          label: 'parent 1' + i,
          value: 'parent 1' + i,
        })
      }
    })
    return {
      value,
      treeData,
      text
    };
  },
});
</script>