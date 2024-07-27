<template>
  <div class="main">
    <!-- <div class="moduleSelect">
      <a-card class="card" :border="false">
        <h3 style="font-weight: 600;">模块选择</h3>
      </a-card>
    </div> -->
    <div class="content">
      <a-card class="edit" :border="false">
        <appTest v-if="testDestory"></appTest>
      </a-card>
      <a-card class="preview" :border="false">
        <a-button @click="testData">test</a-button>
        <div class="container">
          <div class="item item-1" style="width: 200px;">1</div>
          <div class="item item-2" style="width: 200px;">2</div>
          <div class="item item-3" style="width: 200px;">3</div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, provide, computed, onBeforeMount, onMounted, nextTick } from 'vue';
import appTest from './App15.vue'
let clickData = ref(1)
let testDestory = ref(true)

const result = reactive({
  code: [1, 2, 3],
  postcode: '15165165',
  value: ["a", "s", "s"]
})

let getResult = ref({
  test1: '',
  test2: '',
  test3: ''
})

window.addEventListener("message", (event) => {
  if (event.origin === 'http://127.0.0.1:5174') {
    console.log('来自合法发送者的消息：', event.data);
    // 进行其他操作
  } else {
    console.log('来自非法发送者的消息：', event.data);
    // 忽略或处理非法消息
  }
});
const [test1, test2, test3] = result.code;

console.log(Object.assign(getResult.value, { test1, test2, test3 }))


console.log("created")
onBeforeMount(() => {
  console.log("onBeforeMount")

})
onMounted(() => {
  console.log("onMounted")

})
provide('clickData', computed(() => clickData.value))
const testData = () => {
  clickData.value++
  console.log("clickData", clickData.value)
  testDestory.value = true

}
nextTick(() => {
  testData()
  console.log("数据发生重置")
  // testDestory.value=false
})
const moduleList = ref([
  {
    moduleName: "基本信息",
    moduleType: 'info',
    moduleItemList: [
      {
        moduleItemName: '',
        formItemList: [
          { key: 'name', label: '姓名', value: '' },
          { key: 'phone', label: '电话', value: '' },
          { key: 'email', label: '姓名', value: '' },
          { key: 'avatar', label: '头像', value: '' }
        ]
      },
      {
        moduleItemName: '求职意向',
        formItemList: [
          { key: 'name', label: '姓名', value: '' },
          { key: 'phone', label: '电话', value: '' },
          { key: 'email', label: '姓名', value: '' },
          { key: 'avatar', label: '头像', value: '' }
        ]
      }
    ]
  },
  { moduleName: "教育经历", moduleType: 'education' },
  { moduleName: "专业技能", moduleType: 'skill' },
  { moduleName: "工作经历", moduleType: 'job' },
  { moduleName: "个人作品", moduleType: 'work' },
  { moduleName: "荣誉奖项", moduleType: 'award' },
  { moduleName: "其他经历", moduleType: 'other' },
  { moduleName: "研究经历", moduleType: 'research' },
  { moduleName: "个人简介", moduleType: 'about' },
])

</script>
<style scoped lang='less'>
.container {
  display: flex;
  width: 300px;
  height: 200px;
  border: 2px solid #000;
}

.item {
  height: 100px;
  margin: 10px;
  background-color: #f0f0f0;
}

.item-1 {
  flex-shrink: 2;
}

.item-2 {
  flex-shrink: 1;
  align-self: flex-end;
}

.item-3 {
  flex-shrink: 3;
}

.card {
  height: 90%;
  width: 100%;
  border-radius: 0 15px 15px 0;
}

.main {
  width: 100%;
  height: 100vh;
  display: flex;
  background: rgb(235, 238, 240);

  .moduleSelect {
    width: 12%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .content {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    min-width: 1200px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .edit {
      width: 49.5%;
      height: 90%;
      border-radius: 18px;
    }

    .preview {
      width: 49.5%;
      height: 90%;
      border-radius: 18px;
    }
  }
}
</style>