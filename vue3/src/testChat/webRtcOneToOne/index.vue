<template>
  <div>
    <h1>在局域网当中实现点对点手动通信</h1>


    <video id="local" autoplay playsinline muted></video>
    <video id="remote" autoplay playsinline></video>

  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
//SDP：Session Description Protocol   SDP是一种用于描述音视频会话信息的协议，它包含了会话的各种参数和配置，用于设备之间交换音视频能力和协商最佳的音视频配置。通过使用SDP，设备可以在音视频通信中更好地理解对方的能力和配置，从而实现更好的通信质量和兼容性。
//NAT：Network Address Translation，网络地址转换，它可以将私有 IP 地址转换为公共 IP 地址，从而实现私有网络与公共网络之间的通信。
//ICE：Interactive Connectivity Establishment，交互式连接建立协议，用于在两个主机之间建立连接，它可以在两个主机之间建立连接，即使它们之间的防火墙阻止了直接连接。(可以不借助一个公网 server 完成端到端（Peer to peer，P2P）的通信)。
//在实时通信中，信令服务器和ICE通常是配合使用的。信令服务器负责处理信令交换，包括将ICE候选地址传递给对方设备，而ICE则负责在设备之间建立直接的点对点连接。

//也就是SDP存储信息，NAT穿刺 ICE告诉双方彼此的信息

//具体实现步骤如下
/* 创建一个用于连接控制的 RTCPeerConnection 对象
采集媒体流并添加到RTCPeerConnection 实例中
建立连接，传输媒体流。 */


//1.引入adapter.js提交兼容性，消除浏览器之间的差异
import 'webrtc-adapter'

//STUN   帮助我们获取本地计算机的公网 IP 地址，以及端口号
//TURN  用来帮助我们穿越 NAT 网关，实现公网中的 WebRTC 连接。一般来说它用来做兜底的，当所有方法都无法穿越 NAT 网关或者无法直接简历 P2P 连接的时候，我们才会使用到它。这时，TURN 服务器会作为一个中继服务器，然后用户的媒体流会通过它来中转传输。



//----------------------下面的方法都是在内网当中使用------------------------------

const pc = new RTCPeerConnection()//提供了在浏览器之间建立点对点（peer-to-peer）连接的功能。这种连接可以用于实时音视频通信、数据传输等应用。

//------大致分成下面的三个步骤
//1.navigator.mediaDevices.getUserMedia 方法来获取媒体流
//2.addTrack 方法来添加媒体流。
//3.ontrack 事件，当远程的媒体流添加进来的时候，就会触发这个事件
// 初始化

async function init(params: type) {
  // 获取本地端视频标签
  const localVideo = document.getElementById('local') as HTMLVideoElement
  // 获取远程端视频标签
  const remoteVideo = document.getElementById('remote') as HTMLVideoElement

  // 采集本地媒体流
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })
  // 设置本地视频流
  localVideo.srcObject = localStream



  // 添加本地媒体流的轨道都添加到 RTCPeerConnection 中
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream)
  })

  // 监听远程流
  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0] //将远程流中的第一个流（通常是音视频流）赋值给remoteVideo.srcObject属性，这样就将远程流与remoteVideo元素进行绑定，从而在浏览器中播放远程对等方的音视频。
  }
}

let offerSdp = ref('')
let answerSdp = ref('')
const createOffer = async () => {
  // 创建 offer
  const offer = await pc.createOffer()//创建SDP描述
  await pc.setLocalDescription(offer)// 设置本地描述
  // 到这里，我们本地的 offer 就创建好了，一般在这里通过信令服务器发送 offerSdp 给远端

  // 监听 RTCPeerConnection 的 onicecandidate 事件，当 ICE 服务器返回一个新的候选地址时，就会触发该事件
  //当设备发现一个新的ICE候选者时，就会触发onicecandidate事件，并调用相应的事件处理函数
  //我们可以获取到新发现的ICE候选者对象，其中包含了候选者的网络地址、传输协议等信息。
  pc.onicecandidate = async (event) => {
    if (event.candidate) {
      offerSdp.value = JSON.stringify(pc.localDescription)//当前对象的本地描述
    }
  }
}


const createAnswer = async () => {
  // 解析字符串
  const offer = JSON.parse(offerSdp.value)
  pc.onicecandidate = async (event) => {
    // Event that fires off when a new answer ICE candidate is created
    if (event.candidate) {
      answerSdp.value = JSON.stringify(pc.localDescription)
    }
  }
  await pc.setRemoteDescription(offer)//将收到的远程设备的描述信息（offer）设置为本地设备的远程描述
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)//设置远程设备的本地描述
}

// 添加 answer(应答)  将应答信息追加到本地设备当中
const addAnswer = async () => {
  const answer = JSON.parse(answerSdp.value)
  if (!pc.currentRemoteDescription) {//如果远程的描述信息并不存在就要执行下面的代码   
    pc.setRemoteDescription(answer)
  }
}


//对点对点通信进行分析赘述
/* 
  在点对点通信中，创建offer并发送给远程端是指我们的设备（本地端）生成一个包含自己音视频能力和配置的描述信息（称为offer），然后将该offer发送给远程设备。
  这个offer就像是一封信，里面包含了我们的音视频要求和设置，比如我们支持的编码方式、分辨率等。我们将这封信发送给远程设备，告诉它我们的音视频能力和配置。
  远程设备收到我们的offer后，会根据这个信息了解到我们的音视频要求和设置。然后，远程设备会生成一个自己的描述信息（称为answer），里面包含了它的音视频能力和配置。
  我们需要监听远程设备的answer，就像等待对方回信一样。一旦我们收到了远程设备的answer，我们就可以将这个answer设置到远程设备的描述中。
  通过交换offer和answer，我们的设备和远程设备可以互相了解彼此的音视频能力和配置。这样，双方就可以根据对方的描述信息来建立对等连接，并进行音视频通信。
*/
</script>
<style lang="less">

</style>