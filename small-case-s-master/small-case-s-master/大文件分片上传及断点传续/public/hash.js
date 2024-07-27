// 导入 spark-md5 库
self.importScripts('spark-md5.min.js');

self.addEventListener('message', (e) => {
  console.log("e",e)
  const { fileChunkList } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  let count = 0;

  const loadNext = (index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      spark.append(e.target.result); // 添加当前切片的内容到spark
      count++;

      if (count === fileChunkList.length) {
        // 所有切片都已经处理完成
        self.postMessage({ hash: spark.end() }); // 发送最终的哈希值到主线程
        self.close(); // 关闭 worker
      } else {
        // 处理下一个切片
        loadNext(count);
      }
    };

    reader.onerror = (err) => {
      console.error('文件读取出错:', err);
      self.close(); // 出错时关闭 worker
    };

    reader.readAsArrayBuffer(fileChunkList[index].file);
  };

  // 开始处理第一个文件切片
  loadNext(0);
});