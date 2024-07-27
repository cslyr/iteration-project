# serve
1：cd node-serve

2：npm install

3：node/nodemon index.js

# client
1：npm install

2：npm run dev

# 断点传续
断点传续就是信号中断后(掉线或关机等),下次能够从上次的地方接着传送(一般指下载或上传)。

# 切片上传
切片核心是利用 Blob.prototype.slice 方法，和数组的 slice 方法相似，文件的 slice 方法可以返回原文件的某个切片。

# 总结
前端上传大文件时使用 Blob.prototype.slice 将文件切片，并发上传多个切片，最后发送一个合并的请求通知服务端合并切片
服务端接收切片并存储，收到合并请求后使用流将切片合并到最终文件
原生 XMLHttpRequest 的 upload.onprogress 对切片上传进度的监听
使用 Vue 计算属性根据每个切片的进度算出整个文件的上传进度

断点续传

使用 spark-md5 根据文件内容算出文件 hash
通过 hash 可以判断服务端是否已经上传该文件，从而直接提示用户上传成功（秒传）
通过 XMLHttpRequest 的 abort 方法暂停切片的上传
上传前服务端返回已经上传的切片名，前端跳过这些切片的上传

著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。