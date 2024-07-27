const express = require('express');
const app = express()
const fs = require('fs')
const path = require('path')
const audioToText = require('./iat-ws-node')
const multer = require("./multer/multer-audio.js");
const cors = require('cors')
//https证书key
// const options = {
//   cert: fs.readFileSync(path.join(__dirname, '/assets/localhost+3.pem')),
//   key: fs.readFileSync(path.join(__dirname, '/assets/localhost+3-key.pem')),
// }

const socketIO = require('socket.io')
// const httpServe = require('https').createServer(options, app);
const httpServe = require('http').createServer(app);


const regex = /.*最终识别结果：.*/

// audioToText("./16k_10.pcm", (str) => {
//   console.log("waibu", regex.test(str));
// })

// 运行跨域请求
app.use(cors())
// 解析body的中间件
app.use(express.urlencoded({ extended: false }));
app.post('/audioToText', multer.single("audioFile"), (req, res) => {
  console.log(req.file.filename);
  audioToText(`./audio/${req.file.filename}`, (str) => {
    console.log(str);
    if (regex.test(str)) {
      return res.send({
        code: 200,
        text: str.split('最终识别结果：')[1] ?? 'error'
      })
    }
  })
})


/*
interface roomList
roomId:房间id,
type:房间类型(public:群聊,private:私聊),
userList:房间用户列表(在线列表),
includeUserList//房间适用于哪些用户(用于私聊筛选需要展示的房间)
messageList:消息列表

interface messageList
userId:用户id,
userName:用户昵称,
avatar:头像,
type:消息类型(0:系统消息,1:用户消息,2:用户语音消息),
message:消息内容,
date:日期,
speakTime:用户发送的语音消息时长
*/

// 房间列表
const roomList = []

// 创建信令服务器
const io = socketIO(httpServe, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'], // 允许的请求方式
    allowedHeaders: '*', // 允许的请求头
    credentials: true, // 允许携带cookie
    allowEIO3: true, // 是否启用与Socket.IO v2客户端的兼容性
    transport: ['websocket'], // 仅允许websocket,["polling", "websocket"]
  }
})

// 查找房间是否存在并指定操作
const RoomIsExitsAndHandle = (roomId, existCallback, unExistCallback) => {
  // 房间列表为空
  if (roomList.length == 0) { unExistCallback() }
  else {
    // 判断房间是否存在
    let isExistRoom = false
    for (let i = 0; i < roomList.length; i++) {
      let item = roomList[i]
      if (item.roomId == roomId) isExistRoom = true
    }
    if (isExistRoom) {
      existCallback()
    } else {
      unExistCallback()
    }
  }
}

io.on('connection', (socket) => {
  // 向客户端发送socketId
  socket.emit('socketId', socket.id)
  // 加入房间
  socket.on('joinRoom', (data) => {
    let { userId, roomId, userName, avatar } = data
    // 返回的信息列表
    let messageList = []
    RoomIsExitsAndHandle(roomId, () => {
      // 加入房间
      for (let i = 0; i < roomList.length; i++) {
        let item = roomList[i]
        if (item.roomId == roomId) {
          roomList[i].messageList.push({ type: '0', userId: userId, message: 'join', date: new Date(), userName, avatar })
          // 该用户在改房间是否存在
          let isExist = false
          for (let u = 0; u < roomList[i].userList.length; u++) {
            let item = roomList[i].userList[u]
            if (item.userId == userId)
              isExist = true
          }
          if (!isExist) roomList[i].userList.push({ userId, socketId: socket.id, userName, avatar })
          messageList = roomList[i].messageList
        }
      }
    }, () => {
      roomList.push({
        roomId,
        type: 'public',
        userList: [{ userId, socketId: socket.id, userName, avatar }],
        messageList: [{ type: '0', userId, message: 'join', date: new Date(), userName, avatar }]
      })
      messageList = [{ type: '0', userId, message: 'join', date: new Date(), userName, avatar }]
    })
    socket.join(roomId)
    // console.log('rooms',socket.rooms);
    io.to(roomId).emit('joinRoom', messageList)
    io.emit('roomList', roomList)
  })
  // 发送信息
  socket.on('message', (data) => {
    // console.log(roomList);
    // 需要返回的信息
    let list = []
    let { roomId, userId, message, userName, avatar } = data
    for (let i = 0; i < roomList.length; i++) {
      let item = roomList[i]
      if (item.roomId == roomId) {
        roomList[i].messageList.push({ type: data.speakTime ? '2' : '1', userId, message, date: new Date(), speakTime: data.speakTime ?? null, userName, avatar })
        list = roomList[i].messageList
      }
    }
    // console.log(data);
    // console.log(list);
    io.to(roomId).emit('message', list)
  })
  // 离开房间
  socket.on('leave', (data) => {
    socket.leave(data.roomId)
    // 退出公共聊天室返回提示信息
    if (data.type == 'public') {
      // 需要返回的信息
      let list = []
      let { userId, roomId, userName, avatar } = data
      // console.log('user leave', userId);
      for (let i = 0; i < roomList.length; i++) {
        let item = roomList[i]
        if (item.roomId == roomId) {
          roomList[i].messageList.push({ type: '0', userId, message: 'leave', date: new Date(), userName, avatar })
          roomList[i].userList = roomList[i].userList.filter(row => row.userId !== userId)
          list = roomList[i].messageList
        }
      }
      io.emit('roomList', roomList)
      io.to(roomId).emit('message', list)
    }
  })
  // 私聊请求
  socket.on('private', (data) => {
    let { fromId, fromSocketId, toId, toSocketId } = data
    // console.log('private', data);
    let roomId = fromSocketId + ',' + toSocketId
    socket.join(roomId)
    // 请求方加入私聊房间
    roomList.push({
      roomId,
      type: 'private',
      includeUserList: [fromId, toId],
      userList: [{ userId: fromId, socketId: fromSocketId }, { userId: toId, socketId: toSocketId }],
      messageList: [],
    })
    io.to(toSocketId).emit('private', { fromId, fromSocketId })
    // console.log('private', roomList);
  })
  // 同意私信请求
  socket.on('acceptPrivate', (data) => {
    let { fromId, fromSocketId, toId, toSocketId } = data
    let roomId = fromSocketId + ',' + toSocketId
    socket.join(roomId)
    io.to(roomId).emit('roomList', roomList)
    // 通知客户端房间的用户在客户端加入房间
    io.to(roomId).emit('joinPrivate', roomList.find(item => item.roomId == roomId))
    socket.to(data.fromSocketId).emit('acceptPrivate', data.toId)
  })
  // 拒绝私信请求
  socket.on('rejectPrivate', (data) => {
    let { toSocketId, fromSocketId, toId } = data
    // console.log('reject', data);
    // console.log(toSocketId, fromSocketId, toId);
    let roomId = fromSocketId + ',' + toSocketId
    for (let i = 0; i < roomList.length; i++) {
      let item = roomList[i]
      if (item.roomId == roomId) roomList.splice(i, 1)
    }
    // 删除房间信息
    // console.log('rejectPrivate', roomList);
    socket.to(data.fromSocketId).emit('rejectPrivate', data.toId)
  })
  // 视频请求
  socket.on('video', (data) => {
    // console.log('video', data);
    let { fromId, fromSocketId, toId, toSocketId, offerSdp } = data
    socket.to(toSocketId).emit('video', { fromId, fromSocketId, offerSdp })
  })
  // 同意视频请求
  socket.on('acceptVideo', (data) => {
    socket.to(data.fromSocketId).emit('acceptVideo', data)
  })
  // 拒绝视频请求
  socket.on('rejectVideo', (data) => {
    socket.to(data.fromSocketId).emit('rejectVideo', data.toId)
  })
  // 监听视频通话挂断
  socket.on('hangUpVideo', (data) => {
    socket.to(data.socketId).emit('hangUpVideo', data.userId)
  })
  // 监听共享屏幕
  socket.on('shareScreen', (data) => {
    socket.to(data.toSocketId).emit('shareScreen', data)
  })
  // 监听同意共享屏幕
  socket.on('acceptShareScreen', (data) => {
    socket.to(data.fromSocketId).emit('acceptShareScreen', data)
  })
  // 监听拒绝共享屏幕
  socket.on('rejectShareScreen', (data) => {
    socket.to(data.fromSocketId).emit('rejectShareScreen', data)
  })
  // 监听挂断屏幕共享
  socket.on('hangUpShare', (data) => {
    socket.to(data.fromSocketId ?? data.toSocketId).emit('hangUpShare', data)
  })
  // 监听语音通话请求
  socket.on('audio', (data) => {
    socket.to(data.toSocketId).emit('audio', data)
  })
  // 监听同意语音通话
  socket.on('acceptAudio', (data) => {
    socket.to(data.fromSocketId).emit('acceptAudio', data)
  })
  // 监听拒绝语音通话
  socket.on('rejectAudio', (data) => {
    socket.to(data.fromSocketId).emit('rejectAudio', data)
  })
  // 监听挂断语音通话
  socket.on('hangUpAudio', (data) => {
    socket.to(data.fromSocketId ?? data.toSocketId).emit('hangUpAudio', data)
  })

  io.on('disconnect', (socket) => {
    // console.log(socket.id+'断开了连接');
  })
})

httpServe.listen(8888, '192.168.0.111', () => {
  var host = httpServe.address().address;
  var port = httpServe.address().port;
  console.log("serve is running https://%s:%s", host, port);
})