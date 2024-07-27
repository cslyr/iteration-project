const express = require('express');
const app = express();
const cors = require('cors')
const { createPool } = require('generic-pool');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path')
app.use(cors())
app.use(express.urlencoded({ extended: false }));
let url_global = 'http://localhost'

const factory = {
  create: function() {
    return puppeteer.launch({
      headless: true
    });
  },
  destroy: function(browser) {
    return browser.close();
  }
};
const browserPool = createPool(factory, {
  max: 10, // 允许的最大浏览器实例数量
  min: 2 // 池中维护的最小浏览器实例数量
});
// 跳转到downloadPdf页面下载pdf
app.post('/downloadPdf', async (req, res) => {
  let { resumeId, tokenValue } = req.body
  console.log("tokenValue",tokenValue)
  console.log("resumeId",resumeId)
  const folder = 'vueDoc'
  fs.mkdir(folder, () => { console.log('文件夹创建成功') })

  //启动无头浏览器
  const browser = await browserPool.acquire();
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   // executablePath: 'google-chrome-stable', // 使用额外安装的谷歌浏览器
  //   // args: ['--no-sandbox', '--disable-setuid-sandbox']
  // }) //PDF 生成仅在无界面模式支持, 调试完记得设为 true
  const page = await browser.newPage();
  await page.setCookie({
    name: 'token',
    value: tokenValue,
    url: url_global//它确保了只有当请求匹配到指定的域名时，cookie 才被包含，从而为用户提供更加安全和定制化的网页浏览体验。
  });
  //在这里面路径是http://localhost/downloadResume/208?ddtk=M
  await page.goto(`${url_global}/downloadResume/${resumeId}?ddtk=M`, { waitUntil: 'networkidle0' });
  // await page.waitForSelector('body');
  console.log("页面加载完毕")
  //指定生成的pdf文件存放路径
  let url = `./vueDoc/${new Date().getTime()}.pdf`
  await page.pdf({
    path: url,
    printBackground: true,
    '-webkit-print-color-adjust': 'exact',
  });
  // 拼接路径
  const filePath = path.join(__dirname, `${url}`);
  // console.log('filePath', filePath);
  //关闭页面
  // page.close()
  //关闭 chromium
  await browserPool.release(browser);
  // browser.close();
  res.download(filePath, (error) => {
    if (error) {
      res.send({ code: 500, message: 'download error!' })
    } else {
      fs.unlinkSync(filePath); // 删除临时文件
    }
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});