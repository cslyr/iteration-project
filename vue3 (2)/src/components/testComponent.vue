<template>
  <h1>children:- {{ cpd }}</h1>
  <input type="text" v-model="cpd">
</template>

<script setup>
import { ref, toRefs, toRef, computed, watch } from "vue";
let props = defineProps({
  str: {
    default: '',
    type: String
  }
})
const emit = defineEmits(['update:str'])

// console.log(props);
// const str = toRef(props,'str')
// console.log('sonStr',str);
// console.log('sonStr',typeof props.str);

const cpd = computed({
  get () {
    return props.str
  },
  set (value) {
    console.log(value);
    emit('update:str', value)
  }

})

watch(() => props.str, (val) => {
  console.log('watch', val);
})


</script>