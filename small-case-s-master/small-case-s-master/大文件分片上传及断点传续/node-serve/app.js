const express = require('express')
let CORS = require('cors')
const multer = require('./utils/multer.js')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(CORS())
// 解析body的中间件
app.use(express.urlencoded({ extended: false }));
// 暴漏静态资源
app.use(express.static('./public'))

app.get('/text', (req, res) => {
  res.send({
    code: 200,
    message: 'success'
  })
})

let fileList = []
app.post('/upload', multer.single("file"), (req, res) => {
  console.log('接收到文件分片', fs.readFileSync(req.file.path));
  let chunkSsExist = fileList.some((item) => item.id == req.body.id)
  // 如果切片存在不添加
  if (!chunkSsExist) fileList.push({ ...req.body, file: req.file })
  // 文件分片上传完成
  console.log('req.body.totalChunk', req.body.totalChunk, 'fileList.length', fileList.length);
  if (fileList.length == req.body.totalChunk) {
    console.log('文件分片上传完成');
    // 根据文件切片排序
    fileList = fileList.sort((a, b) => Number(a.index - b.index))
    console.log('fileList', fileList);
    // 汇总文件的arrayBuffer数据
    let allBuffer = ''
    fileList.forEach(item => {
      let { path } = item.file
      allBuffer += fs.readFileSync(path)
      fs.unlinkSync(path, (err, item) => {
        if (err) {
          console.log('errorItem', item);
          console.log(err);
        }
      })
    })
    let fileName = fileList[0].filename
    let filePath = path.join(__dirname, '/public/' + fileName)
    // 写入文件（合并文件）
    fs.writeFile(filePath, allBuffer, (err, data) => {
      console.log(err, data);
    })
    res.send({ code: 2000, message: '文件上传完成', url: 'http://localhost:3000/' + fileName })
    fileList = []
  } else {
    res.send({ code: 200, message: '分片上传成功' })
  }
})

app.post('/uploadAll', multer.single("file"), (req, res) => {
  res.send({ code: 200, message: '上传成功' })
})

app.listen(3000, () => {
  console.log('serve is running in 3000');
})