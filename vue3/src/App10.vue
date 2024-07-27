<template>
  <div>
    <button @click="startRecording">开始录音</button>
    <p>{{transcript}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transcript: '',
      mediaRecorder: null,
      chunks: [],
    }
  },
  methods: {
    async startRecording() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = e => (this.chunks = this.chunks.concat(e.data));
      this.mediaRecorder.start();
      const timer = setInterval(() => {
        if (this.mediaRecorder.state === 'recording') {
        } else if (this.mediaRecorder.state === 'inactive') {
        } else if (this.mediaRecorder.state === 'paused') {
        } else if (this.mediaRecorder.state === 'playing') {
        } else if (this.mediaRecorder.state === 'completed') {
        } else if (this.mediaRecorder.state === 'failed') {
        } else if (this.mediaRecorder.state === 'interrupted') {
        }
      }, 1000);
      const transcription = await this.convertToText();
      clearInterval(timer); //停止定时器
      this.mediaRecorder.stop(); //停止录音
    },
    convertToText() {
      const speechRecognition = new SpeechRecognition();
      const language = 'zh-CN'; //设置语言为中文
      const interimResults = false; //不返回中间结果，只返回最终结果
      const maxAlternatives = 1; //只返回一个备选结果
      const p = new Promise((resolve, reject) => {
        speechRecognition.lang = language;
        speechRecognition.interimResults = interimResults;
        speechRecognition.maxAlternatives = maxAlternatives;
        const recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        recognizer.onresult = event => resolve(event.results[0].bestTranscription); //当识别到语音时，将结果传递给Promise对象进行处理
        recognizer.onerror = event => reject(event); //当发生错误时，将错误信息传递给Promise对象进行处理
        speechRecognition.start(); //开始语音识别
        speechRecognition.recognizeOnce(recognizer); //只识别一次语音数据
      });
      return p; //返回Promise对象，以便在异步操作完成后执行相应的操作
    },
  },
};
</script>