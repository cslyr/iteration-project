<template>
  <a-select v-model:value="formState.kcId" show-search placeholder="请选择所属课程" option-filter-prop="label"
    :filter-option="filterOption" @change="changeKcId" style="width: 100px;">
    <a-select-option v-for="(item, index) in kcs" :key="index" :value="item.id" :label="item.mc" >
      {{ item.mc }}
    </a-select-option>
  </a-select>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const formState = ref({
      kcId: ''
    });

    // const kcs = ref([
    //   { id: 1, mc: 'a1' },
    //   { id: 2, mc: 'b2' },
    //   { id: 3, mc: 'c3' }
    // ]);
    const kcs = ref([...Array(10)].map((_, i) => ({ id: i, mc: (i + 10).toString(36) + (i + 1) })));
    [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))
    const filterOption = (input, option) => {
      console.log('option',option)
      return option.label.toLowerCase().includes(input.toLowerCase());
    };

    const changeKcId = (value) => {
      console.log('课程ID改变:', value);
    };

    return {
      formState,
      kcs,
      filterOption,
      changeKcId
    };
  }
});
</script>
<!-- 
options: [
{ "value": "a1" },
{ "value": "b2" },
{ "value": "c3" },
{ "value": "d4" },
{ "value": "e5" }
], -->



<!-- <template>
  <a-select
    v-model:value="value"
    show-search
    placeholder="Select a person"
    style="width: 200px"
    :options="options"
    :filter-option="filterOption"
    @focus="handleFocus"
    @blur="handleBlur"
    @change="handleChange"
  ></a-select>
</template>
<script lang="ts">
import type { SelectProps } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const options = ref<SelectProps['options']>([
      { value: 'jack', label: 'Jack' },
      { value: 'lucy', label: 'Lucy' },
      { value: 'tom', label: 'Tom' },
    ]);
    const handleChange = (value: string) => {
      console.log(`selected ${value}`);
    };
    const handleBlur = () => {
      console.log('blur');
    };
    const handleFocus = () => {
      console.log('focus');
    };
    const filterOption = (input: string, option: any) => {
      console.log('input',input)
      console.log('option',option)
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    return {
      value: ref<string | undefined>(undefined),
      filterOption,
      handleBlur,
      handleFocus,
      handleChange,
      options,
    };
  },
});
</script> -->
