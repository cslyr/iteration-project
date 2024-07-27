module.exports = function (file,callback) {
  const CryptoJS = require('crypto-js')
  const WebSocket = require('ws')
  var fs = require('fs')
  // 系统配置 
  const config = {
    // 请求地址
    hostUrl: "wss://iat-api.xfyun.cn/v2/iat",
    host: "iat-api.xfyun.cn",
    //在控制台-我的应用-语音听写（流式版）获取
    appid: '84c77c66',
    //在控制台-我的应用-语音听写（流式版）获取
    apiSecret: 'ZmVlNWZlZTcxZjUwOWMzYzE4YjBiYjg5',
    //在控制台-我的应用-语音听写（流式版）获取
    apiKey: '000badcbcf0545d9591ab6937ad4d628',
    file , //请填写您的音频文件路径
    uri: "/v2/iat",
    highWaterMark: 1280
  }

  // 帧定义
  const FRAME = {
    STATUS_FIRST_FRAME: 0,
    STATUS_CONTINUE_FRAME: 1,
    STATUS_LAST_FRAME: 2
  }

  // 获取当前时间 RFC1123格式
  let date = (new Date().toUTCString())
  // 设置当前临时状态为初始化
  let status = FRAME.STATUS_FIRST_FRAME
  // 记录本次识别用sid
  let currentSid = ""
  // 识别结果
  let iatResult = []

  let wssUrl = config.hostUrl + "?authorization=" + getAuthStr(date) + "&date=" + date + "&host=" + config.host
  let ws = new WebSocket(wssUrl)

  // 连接建立完毕，读取数据进行识别
  ws.on('open', (event) => {
    console.log("websocket connect!")
    var readerStream = fs.createReadStream(config.file, {
      highWaterMark: config.highWaterMark
    });
    readerStream.on('data', function (chunk) {
      send(chunk)
    });
    // 最终帧发送结束
    readerStream.on('end', function () {
      status = FRAME.STATUS_LAST_FRAME
      send("")
    });
  })

  let str = ""
  // 得到识别结果后进行处理，仅供参考，具体业务具体对待
  ws.on('message', (data, err) => {
    if (err) {
      console.log(`err:${err}`)
      return
    }
    res = JSON.parse(data)
    if (res.code != 0) {
      return
    }

    if (res.data.status == 2) {
      // res.data.status ==2 说明数据全部返回完毕，可以关闭连接，释放资源
      str += "最终识别结果"
      currentSid = res.sid
      ws.close()
    } else {
      str += "中间识别结果"
    }
    iatResult[res.data.result.sn] = res.data.result
    if (res.data.result.pgs == 'rpl') {
      res.data.result.rg.forEach(i => {
        iatResult[i] = null
      })
      str += "【动态修正】"
    }
    str += "："
    iatResult.forEach(i => {
      if (i != null) {
        i.ws.forEach(j => {
          j.cw.forEach(k => {
            str += k.w
          })
        })
      }
    })
    // ... do something
    callback(str)
  })

  // 资源释放
  ws.on('close', () => {
    // console.log(`本次识别sid：${currentSid}`)
    console.log('connect close!')
  })

  // 建连错误
  ws.on('error', (err) => {
    console.log("websocket connect err: " + err)
  })

  // 鉴权签名
  function getAuthStr (date) {
    let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
    let signature = CryptoJS.enc.Base64.stringify(signatureSha)
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
    return authStr
  }

  // 传输数据
  function send (data) {
    let frame = "";
    let frameDataSection = {
      "status": status,
      "format": "audio/L16;rate=16000",
      "audio": data.toString('base64'),
      "encoding": "raw"
    }
    switch (status) {
      case FRAME.STATUS_FIRST_FRAME:
        frame = {
          // 填充common
          common: {
            app_id: config.appid
          },
          //填充business
          business: {
            language: "zh_cn",
            domain: "iat",
            accent: "mandarin",
            dwa: "wpgs" // 可选参数，动态修正
          },
          //填充data
          data: frameDataSection
        }
        status = FRAME.STATUS_CONTINUE_FRAME;
        break;
      case FRAME.STATUS_CONTINUE_FRAME:
      case FRAME.STATUS_LAST_FRAME:
        //填充frame
        frame = {
          data: frameDataSection
        }
        break;
    }
    ws.send(JSON.stringify(frame))
  }
}

