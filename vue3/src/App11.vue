<template>
  <a-table :dataSource="dataSource" :columns="columns" :bordered="true" style="width: 80%;margin: 20px auto;">
    <template v-slot:bodyCell="{ text, record, index, column }">
      <span v-if="record.key == 1">{{ text }}11</span>
    </template>
  </a-table>
</template>
<script setup>
const dataSource = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '翻斗乐园2号',
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    address: '米奇妙妙屋',
  },
]

const columns = [
  {
    title: '姓名',
    className: 'column-money',
    dataIndex: 'name',
    key: 'name',
    // customCell: (record, rowIndex, column) => {
    //   return {
    //     style: { "background-color": 'red','color':'yellow','border':'1px solid black' }
    //   }
    // }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
]
</script>
<style lang="less"></style>