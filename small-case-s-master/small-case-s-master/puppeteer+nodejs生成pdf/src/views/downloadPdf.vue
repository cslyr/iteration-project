<template>
  <!-- 专门用于下载pdf的页面 -->
  <div class="main">
    <div class="content">
      <div class="preview" :border="false" id="preview">
        <div v-for="(item, index) in moduleList.filter(row => row.switch) " :key="item.id">
          <!-- 基本信息模块布局 -->
          <div class="baseInfoModule" id="draggableEl" v-if="item.id == 1">
            <div class="avatar"><img :src="state.baseInfoModule.formItemList[0].value" /></div>
            <div style="display: flex;flex-direction: column;width: 80%;">
              <div v-for="moduleItemArray in item.moduleItemList">
                <div class="baseInfo" v-for="moduleItem in moduleItemArray">
                  <span v-for="formItem in moduleItem.formItemList">
                    <h2 v-if="formItem.key == 'name'" style="margin-bottom: 0;font-weight: 600;">{{ formItem.value }}
                    </h2>
                    <span v-if="formItem.key != 'avatar' && formItem.key != 'name'" style="margin-right: 8px;">
                      <!-- <img style="width: 12px;margin-right: 2px;margin-top: -3px;" :src="formItem.icon"
                        v-if="formItem.showIcon" /> -->
                      {{ formItem.icon }}
                      {{ formItem.value }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 其余模块布局 -->
          <div class="otherModule" id="draggableEl" v-else data-background="1">

            <div class="moduleName">{{ item.moduleName }}</div>
            <div v-for="(moduleItemArray, arrayIndex) in item.moduleItemList" class="moduleItem">
              <div class="arrayItem" v-for="arrayItem in moduleItemArray">
                <div class="formItem" v-for="formItem in arrayItem.formItemList">
                  <div :class="{ bolder: formItem.class == 'bolder', gray: formItem.class == 'gray' }"
                    v-if="formItem.type == 'input' || formItem.type == 'select'">
                    {{ formItem.value }}
                  </div>
                  <div v-if="formItem.type == 'date' && formItem.value" class="date">
                    {{ formItem.value[0] }} ~ {{ formItem.value[1] }}
                  </div>
                  <div v-if="formItem.type == 'richText'" v-html="formItem.value"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
console.log("触发下载操作")
const route = useRoute()
// 全局状态
const state = reactive({
  // 基本信息模块信息
  baseInfoModule: {},
})
// 模块列表
const moduleList = ref([])

onMounted(async () => {
  let { resume_id } = route.params
  let { data: res } = await axios({ url: `http://127.0.0.1:3000/getResumeInfo/${resume_id}`, method: "post" })
  if (res.code == 200) {
    moduleList.value = JSON.parse(res.data.resume_content)
    // 基础信息（方便展示头像）
    state.baseInfoModule = moduleList.value.find(item => item.id == 1).moduleItemList[0][0]
  } else {
    message.error(res.message)
  }

})
</script>
<style scoped lang='less'>
.bolder {
  font-size: 16px;
  font-weight: bolder;
}

.date {
  position: absolute;
  right: 20px;
  color: rgba(0, 0, 0, 0.45);
}

.gray {
  color: rgba(0, 0, 0, 0.45);
}

.main {
  font-size: 14px;
  width: 100%;
  min-height: 100vh;
  background: #ffffff;

  .content {
    min-width: 800px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .preview {
      overflow: hidden;
      width: 800px;
      min-height: auto;
      background: #ffffff;
      padding: 20px;
      position: relative;


      .baseInfoModule {
        display: flex;
        align-items: center;
        width: 100%;
        // cursor: grab;

        .avatar {
          width: 20%;

          img {
            width: 100px;
            height: 100px;
          }
        }

        .baseInfo {
          padding: 0 10px;
          width: 100%;
          text-align: center;
          margin: 1px 0;
        }
      }

      .otherModule {
        position: relative;
        // cursor: grab;

        .moduleName {
          height: 27px;
          line-height: 27px;
          font-size: 18px;
          color: rgb(70, 114, 242);
          font-weight: bold;
          margin: 16px 0 12px;
          padding-left: 12px;
          position: relative;

          &::before {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            width: 8px;
            height: 100%;
            background: #4672FF;
          }
        }

        &:hover {
          transition: all .3s;
          background: whitesmoke;
        }

        .moduleItem {
          position: relative;

          .arrayItem {
            margin-bottom: 5px;
            display: flex;

            .formItem {
              margin-right: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }


    .preview::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>