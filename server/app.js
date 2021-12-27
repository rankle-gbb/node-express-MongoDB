const express = require('express');
const api = require('./server')
const app = express()
/* 引入cors */
const cors = require('cors');
const morgan = require('morgan') // 请求日志
const bodyParser = require('body-parser') // 解析post请求参数
const session = require('express-session')
const cookieParser = require('cookie-parser');
const InitiateMongoServer = require('./server/mongodb/index')

const PORT = process.env.PORT || 3000
require('dotenv').config();
app.use(cors())
//用来设置签名密钥
app.use(cookieParser('zjq'))
// express中是把session信息存储在内存中
// 配置session
app.use(session({
  secret: "zjq", //设置签名秘钥 内容可以任意填写  但是要和cookieParser相匹
  cookie: { maxAge: 60 * 1000 * 60 }, //设置cookie的过期时间，例：80s后    session和相应的cookie失效过期
  resave: true, //强制保存，如果session没有被修改也要重新保存
  saveUninitialized: false //如果原先没有session那么久设置，否则不设置
}))

app.use(morgan('dev'))
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())
app.use('/api/v1', api)
InitiateMongoServer()

// 监听3000端口
app.listen(PORT, () => {
    console.log(`serve start at prot ${PORT}`);
})