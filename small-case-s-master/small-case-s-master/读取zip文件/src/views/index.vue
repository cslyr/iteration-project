<template>
  上传文件(可多选)
  <input type="file" @change="handleFileUpload" accept=".zip" multiple>
  <div style="display: flex;">
    <a-menu v-model:selectedKeys="currentFileKey" mode="inline"  :items="fileList" @click="menuClick"
      style="width: 20%;" />
    {{ Object.keys(currentFile).length == 0 ? '' : currentFile }}
  </div>
</template>
<script setup>
import { ref, h } from 'vue'
import JSZip from 'jszip'
import { FileZipOutlined, PictureOutlined, LoadingOutlined, FilePptOutlined, FileWordOutlined, LeftOutlined, FolderOutlined, FilePdfOutlined, CloudDownloadOutlined, FileExcelOutlined, FileOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';
import { fileZipType, wordType, excelType, pptType, txtType, pictureType } from '../data/baseData'
import axios from 'axios';

const handleFileUpload = (e) => {
  let { files } = e.target
  // 上传的压缩包
  let uploadFiles = Array.from(files)
  // 生成最外层目录
  uploadFiles.forEach((file, index) => {
    fileList.value.push({
      key: index,
      icon: h(FileZipOutlined),
      title: file.name,
      label: file.name,
      url: URL.createObjectURL(file),
      type: 'zip'
    })
  })

  // 对上传的文件进行递归读取文件
  fileList.value.forEach(item => {
    item.icon = h(LoadingOutlined)
    axios({ url: item.url, responseType: 'arraybuffer' }).then((res) => {
      // 创建zip实例挂在到item
      item.zip = new JSZip()
      // 加载压缩包内的文件
      item.zip.loadAsync(res.data).then((zipRes) => {
        item.icon = h(FileZipOutlined)
        let zipData = zipRes.files
        console.log(zipData);
        item.children = []
        generateMenu(zipData, item)
      })
    })
  })
}

// 附件列表
const fileList = ref([])
// 当前选中附件的key
const currentFileKey = ref([]);
// 当前选中的文件
let currentFile = ref({})
// 菜单点击
const menuClick = (record) => {
  // 存在onlyOffice实例则销毁
  let { keyPath } = record
  let { dir, key, type, title, label, filePath, zipUrl } = record.item.originItemValue
  currentFileKey.value = [key]
  // 压缩包文件处理
  // 找到压缩包zip实例
  let zip = fileList.value.find(item => item.key == keyPath[0]).zip
  // 读取文件内容
  zip
    .file(filePath)
    .async("blob").then((content) => {
      let obj = { key, type: title.split('.').pop(), label, title, url: URL.createObjectURL(content), zipUrl }
      currentFile.value = obj
    })
}

// 递归查询点击的节点信息
const getNode = (arr, key) => {
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    if (item.key == key) return item
    if (item.children && item.children.length > 0) {
      let result = getNode(item.children, key)
      if (result) return result
    }
  }
}
// 生成zip文件菜单
const generateMenu = (obj, record) => {
  let arr = record.children
  let allFolders = []
  // 对传入的文件进行遍历(key为文件名称)
  for (let key in obj) {
    let item = obj[key]
    // 文件夹处理 
    if (key.includes('/') && item.dir) {
      allFolders.push({ name: key.split('/')[0], filePath: item.name })
    }
    // 文件处理
    if (!key.includes('/')) {
      arr.push({ key: Math.random(), label: key, title: key, dir: false, icon: h(FileOutlined), filePath: item.name })
    }
  }
  // 去重，获取目录下全部文件夹名称
  let filterFolders = removeDuplicate(allFolders, 'name')
  // 如果目录下存在文件夹
  if (filterFolders.length > 0) {
    filterFolders.forEach((item) => {
      let row = {
        key: Math.random(),
        label: item.name,
        title: item.name,
        dir: true,
        icon: h(FolderOutlined),
        filePath: item.filePath,
        children: [],
        zip: record.zip,
      }
      arr.push(row)
      // 保存目录下的文件信息
      let data = {}
      row.zip.folder(row.filePath).forEach((key, file) => { data[key] = file })
      generateMenu(data, row)
    })
  }
}
// 数组去重
const removeDuplicate = (arr, key) => {
  let newArr = []
  arr.forEach((item) => {
    if (!newArr.some(i => i[key] == item[key])) {
      newArr.push(item)
    }
  })
  return newArr;
}

</script>
<style></style>