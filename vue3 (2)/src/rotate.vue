<template>
  <div class="wapper">
    <div class="rotate-item" :class="{ active: item.id == currentId, gray: getItemList.indexOf(item.id) !== -1 }"
      @click="start(item.id)" v-for="item in rotateList" :key="item.id">
      <img :src="item.img">
    </div>
  </div>
  <a-modal v-model:visible="visible" :cancel-button-props="{ style: { display: 'none' } }" :closable="false" title="Title"
    @ok="handleOk">
    获得：<span>{{ itemInfo.id }}-{{ itemInfo.name }}</span>
  </a-modal>
  get ID:{{ getItemList }}<br>
  reset ID:{{ resetItemList }}<br>
  需要走的步数:{{ needStep }}
</template>

<script  setup>
import { message } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue"
let rotateList = ref([
  { id: 1, name: '$10', img: "/10rmb.png" },
  { id: 2, name: 'thank', img: "/thank.png" },
  { id: 3, name: '$10', img: "/10rmb.png" },
  { id: 4, name: 'thank', img: "/thank.png" },
  { id: 5, name: '', img: "/lottery-btn.png" },
  { id: 6, name: 'thank', img: "/thank.png" },
  { id: 7, name: '$10', img: "/10rmb.png" },
  { id: 8, name: 'thank', img: "/thank.png" },
  { id: 9, name: '$10', img: "/10rmb.png" }
])

// 已抽取到的物品id
let getItemList = ref([])
// 剩余的物品id
const resetItemList = computed(() => {
  let mapArr = rotateList.value.map(item => item.id)
  let resetArr = []
  mapArr.forEach((item, index) => {
    if (getItemList.value.length !== 0) {
      if (getItemList.value.indexOf(item) == -1) {
        resetArr.push(item)
      }
    } else {
      resetArr = mapArr
    }
  })
  let tempArr = resetArr.filter(item => item !== 5)
  return tempArr
})

let itemInfo = reactive({})
let currentId = ref(1)
let rotatePath = ref([1, 2, 3, 6, 9, 8, 7, 4])

// 需要走的步数
const needStep = computed(() => {
  return resetItemList.value.length
})

let step = ref(0)
// 当前圈数
let currentCircle = ref(1)
let timer
// 转动速度
let duration = ref(50)
// 获奖id
let endId = ref('')
// 转动圈数
let circle = ref(2)
const visible = ref(false)

const getEndId = () => {
  let max = resetItemList.value.length
  let min = 0
  let randomIndex = Math.floor(Math.random() * (max - min + min)) + min
  let endId = resetItemList.value[randomIndex]
  if (getItemList.value.indexOf(endId) !== -1) {
    getEndId()
  }
  return endId
}
const start = (id) => {
  if (id !== 5) return
  if (resetItemList.value.length == 0) return message.success("已全部获得")
  duration.value == 100
  endId.value = getEndId()
  let index = rotatePath.value.indexOf(endId.value)
  if (timer) setInterval(timer)
  timer = setInterval(() => {
    if (step.value == 8) {
      step.value = 0
      currentCircle.value += 1
      // if (currentCircle.value <= 2) {
      //   duration.value = 500
      // }
      // if (currentCircle.value > 2 && currentCircle.value <= 6) {
      //   duration.value = 200
      // }
      // if (currentCircle.value > 6) {
      //   duration.value = 500
      // }
      if (currentCircle.value == circle.value) {
        rotatePath.value = rotatePath.value.slice(0, index + 1)
      }
    }
    if (currentCircle.value <= circle.value) {
      currentId.value = rotatePath.value[step.value]
      step.value += 1
      // 转到获奖id
      if (currentId.value == endId.value && currentCircle.value == circle.value) {
        itemInfo = rotateList.value.find(item => item.id == endId.value)
        if (getItemList.value.indexOf(endId.value) == -1) getItemList.value.push(endId.value)
        clearInterval(timer)
        // rotatePath.value.splice(rotatePath.value, 1)
        visible.value = true
      }
    }
  }, duration.value)
}

const handleOk = () => {
  rotatePath.value = [1, 2, 3, 6, 9, 8, 7, 4]
  visible.value = false
  step.value = 0
  currentCircle.value = 1
  currentId.value = 1
}


onMounted(() => { })

</script>

<style lang="less" scoped>
.wapper {
  width: 450px;
  height: 450px;
  background: red;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;

  .rotate-item {
    width: 150px;
    height: 150px;
    box-sizing: border-box;
    padding: 0;
    background: skyblue;

    img {
      width: 145px;
      height: 145px;
      top: 0;
    }
  }

  .active {
    background: yellow;
  }

  .gray {
    background: green;
  }
}
</style>