<template>
  <div class="main">
    <div class="moduleSelect">
      <a-card class="card" :border="false">
        <h3 style="font-weight: 600;">模块选择</h3>
      </a-card>
    </div>
    <div class="content">
      <a-card class="edit" :border="false">123</a-card>
      <a-card class="preview" :border="false">123</a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
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