<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div ref="items"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{ height: itemSize + 'px',lineHeight: itemSize + 'px' }"
      >{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';

const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  itemSize: {
    type: Number,
    default: 200
  }
});

const list = ref(null);
const screenHeight = ref(0);
const start = ref(0);
const end = ref(0);
const startOffset = ref(0);

const listHeight = computed(() => {
  return props.listData.length * props.itemSize;
});

const visibleCount = computed(() => {
  return Math.ceil(screenHeight.value / props.itemSize);
});

const getTransform = computed(() => {
  return `translate3d(0,${startOffset.value}px,0)`;
});

const visibleData = computed(() => {
  return props.listData.slice(start.value, Math.min(end.value, props.listData.length));
});

onMounted(() => {
  screenHeight.value = list.value.clientHeight;
  end.value = start.value + visibleCount.value;
  list.value.addEventListener('scroll', scrollEvent);
});

const scrollEvent = () => {
  const scrollTop = list.value.scrollTop;
  start.value = Math.floor(scrollTop / props.itemSize);
  end.value = start.value + visibleCount.value;
  startOffset.value = scrollTop - (scrollTop % props.itemSize);
};

// 确保移除事件监听器
onUnmounted(() => {
  list.value.removeEventListener('scroll', scrollEvent);
});
</script>