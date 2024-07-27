<template>
  <input id="uploadIpt" type="file" />
  进度：<a-progress style="width:30%"
    :percent="isNaN(loaded / state.totalChunk) ? 0 : (loaded / state.totalChunk) * 100"></a-progress>
  <a-button @click="handle">{{ isUploading ? '暂停' : '继续' }}上传</a-button>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';

const chunkSize = 10 * 1024 * 1024;
let state = reactive({
  chunkList: [],
  totalChunk: 0,
});
const isUploading = ref(false);
const loaded = ref(0);

let controller = new AbortController();
const worker = new Worker('../../public/hash.js'); // 确保这是正确的路径

const handle = () => {
  isUploading.value = !isUploading.value;
  if (!isUploading.value) {
    controller.abort();
  } else {
    upload();
  }
}

const createChunkList = (file,fileHash) => {
  let totalChunk = Math.ceil(file.size / chunkSize);
  let chunkList = [];
  for (let i = 0; i < totalChunk; i++) {
    chunkList.push({
      id: 'id-' + fileHash + '-' + i,
      index: i,
      name: file.name,
      file: file.slice(i * chunkSize, i * chunkSize + chunkSize)
    });
  }
  return chunkList;
}

const uploadChunks = async (chunkList) => {
  const ret = [];
  const executing = [];
  const maxRequestCount = 5;

  for (const item of chunkList) {
    const formData = new FormData();
    formData.append('filename', item.name);
    formData.append('id', item.id);
    formData.append('index', item.index);
    formData.append('file', item.file);
    formData.append('totalChunk', chunkList.length);

    const uploadRequest = () => axios({
      url: 'http://localhost:3000/upload',
      method: 'post',
      data: formData,
      headers: { "Content-Type": 'multipart/form-data' }
    }).then(response => {
      loaded.value += 1;
      return response;
    });

    const p = Promise.resolve().then(uploadRequest);
    ret.push(p);

    if (maxRequestCount <= chunkList.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= maxRequestCount) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

const upload = async () => {
  isUploading.value = true;
  await uploadChunks(state.chunkList);
  isUploading.value = false;
}

onMounted(() => {
  let uploadIpt = document.querySelector('#uploadIpt');
  uploadIpt.addEventListener('change', (e) => {
    let file = e.target.files[0];
    worker.postMessage({ file }); // 发送整个文件给worker计算哈希
    worker.onmessage = (e) => {
      console.log('Hash:', e.data.hash); // 接收计算得到的哈希值
      state.chunkList = createChunkList(file, e.data.hash);
      state.totalChunk = state.chunkList.length;
      upload();
    }
  });

  controller.signal.addEventListener("abort", () => {
    console.log("请求已终止");
  });
})
</script>