# 准备
连接局域网的情况下，ipconfig查看ipv4地址，否则为127.0.0.1

# serve 
准备）在node-serve/app.js 中 改变listening监听的地址
1：cd node-serve
2：npm install 
3：node/nodemon app.js

# client
准备）在views/index.vue中 改变io.connection连接websocket的地址
1: npm install 
2: npm run dev