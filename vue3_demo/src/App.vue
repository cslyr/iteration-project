<template>
  <div id="animatedDiv"></div>
</template>

<script lang="ts" setup>
import { defineProps, ref, reactive, onMounted } from 'vue';

let raf = (callback: FrameRequestCallback) => setTimeout(callback, 16) as any;
let caf = (num: number) => clearTimeout(num);

if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
  raf = (callback: FrameRequestCallback) => window.requestAnimationFrame(callback);
  caf = (handle: number) => window.cancelAnimationFrame(handle);
}

let rafUUID = 0;
const rafIds = new Map<number, number>();

function cleanup(id: number) {
  rafIds.delete(id);
}

function wrapperRaf(callback: () => void, times = 1): number {
  rafUUID += 1;
  const id = rafUUID;

  function callRef(leftTimes: number) {
    console.log('1111')
    if (leftTimes === 0) {
      // Clean up
      cleanup(id);

      // Trigger
      callback();
    } else {
      // Next raf
      const realId = raf(() => {
        callRef(leftTimes - 1);
      });

      // Bind real raf id
      rafIds.set(id, realId);
    }
  }

  callRef(times);

  return id;
}

wrapperRaf.cancel = (id: number) => {
  const realId = rafIds.get(id);
  cleanup(realId);
  return caf(realId);
};

onMounted(() => {
  const div = document.getElementById('animatedDiv');

  let currentLeft = 0;
  const moveDiv = () => {
    currentLeft += 100;
    div.style.left = `${currentLeft}px`;
  };
  wrapperRaf(moveDiv, 100);

  // 调用 wrapperRaf 来重复动画五次
})


</script>

<style>
#animatedDiv {
  width: 50px;
  height: 50px;
  background-color: red;
  position: absolute;
  left: 0px;
  top: 100px;
}
</style>