export default function useIat() {
  const recorder = new RecorderManager('../dist');
  recorder.onStart = () => {
    console.log('开始录音');
  };
  let iatWS;
  let resultText = '';
  let resultTextTemp = '';
  let countdownInterval;

  /**
   * 获取websocket url
   * 该接口需要后端提供，这里为了方便前端处理
   */
  function getWebSocketUrl() {
    // 请求地址根据语种不同变化
    var url = 'wss://iat-api.xfyun.cn/v2/iat';
    var host = 'iat-api.xfyun.cn';
    var apiKey = '000badcbcf0545d9591ab6937ad4d628';
    var apiSecret = 'ZmVlNWZlZTcxZjUwOWMzYzE4YjBiYjg5';
    var date = new Date().toGMTString();
    var algorithm = 'hmac-sha256';
    var headers = 'host date request-line';
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    var signature = CryptoJS.enc.Base64.stringify(signatureSha);
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    var authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    return url;
  }

  function toBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function result(resultData) {
    // 识别结束
    let jsonData = JSON.parse(resultData);
    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result;
      let str = '';
      let ws = data.ws;
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w;
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs) {
        if (data.pgs === 'apd') {
          // 将resultTextTemp同步给resultText
          resultText = resultTextTemp;
        }
        // 将结果存储在resultTextTemp中
        resultTextTemp = resultText + str;
      } else {
        resultText = resultText + str;
      }
      console.log('转换结果', resultTextTemp || resultText || '');
      return resultTextTemp || resultText || '';
    }
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      iatWS.close();
    }
    if (jsonData.code !== 0) {
      iatWS.close();
      console.error(jsonData);
    }
  }
  var wsConnectStatus;

  function connectWebSocket() {
    if (wsConnectStatus) return;
    const websocketUrl = getWebSocketUrl();
    let connectStatus;
    iatWS = new WebSocket(websocketUrl);
    iatWS.onopen = e => {
      console.log('语音听写ws服务器连接成功');
      wsConnectStatus = true;
      startAudio();
      connectStatus == 200;
    };
    iatWS.onmessage = e => {
      console.log(JSON.parse(e.data));
      result(e.data);
    };
    iatWS.onerror = e => {
      console.error(e);
      recorder.stop();
      console.log('语音听写ws服务器连接因错误而关闭');
    };
    iatWS.onclose = e => {
      recorder.stop();
      resultText = '';
      resultTextTemp = '';
      wsConnectStatus = false;
      console.log('语音听写ws服务器连接关闭');
    };
    return connectStatus;
  }

  recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }) => {
    if (iatWS.readyState === iatWS.OPEN) {
      iatWS.send(
        JSON.stringify({
          data: {
            status: isLastFrame ? 2 : 1,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: toBase64(frameBuffer),
          },
        })
      );
      if (isLastFrame) {
        console.log('error');
      }
    }
  };
  // connectWebSocket();
  recorder.onStop = () => {
    clearInterval(countdownInterval);
  };
  // 手机音频
  const startAudio = () => {
    // 开始录音
    recorder.start({
      sampleRate: 16000,
      frameSize: 1280,
    });
    var params = {
      common: {
        app_id: '84c77c66',
      },
      business: {
        language: 'zh_cn',
        domain: 'iat',
        accent: 'mandarin',
        vad_eos: 5000,
        dwa: 'wpgs',
      },
      data: {
        status: 0,
        format: 'audio/L16;rate=16000',
        encoding: 'raw',
      },
    };
    iatWS.send(JSON.stringify(params));
  };
  const stopAudio = () => {
    recorder.stop();
    return resultTextTemp || resultText || '';
  };
  const getText = () => {
    return resultTextTemp || resultText || '';
  };
  return { connectWebSocket, getText, stopAudio };
}
