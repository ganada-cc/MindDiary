//connect database
require('dotenv').config({path: "./config/database.env"});
require('dotenv').config({path: "./config/aws.env"});


const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    insecureAuth: true,
    charset: 'utf8mb4'
});

module.exports = pool;  //모듈로 내보내기

// 스케줄링을 위한 패키지 추가
const schedule = require('node-schedule');

// 기본 설정
const port = 3000,
    express = require("express"),
    cors = require("cors")
    app = express(),
    fs = require("fs"),
    calendarRouter = require('./routes/calendarRoute'),
    sanitizeHtml = require('sanitize-html'),
    puppeteer = require('puppeteer');

const cookieParser = require('cookie-parser');

app.use('/uploads',express.static("uploads/"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

//라우터 등록
app.use('/calendar', calendarRouter);

app.listen(port,() => {
  const dir = "./uploads";
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
  }
  console.log("서버 실행 중");
  }
);
