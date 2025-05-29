const calendarService = require('../services/calendarService');
const path = require('path');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
// const querystring = require('querystring');
// const baseResponse = require("../config/baseResponseStatus");
// s3 연결 관련
const s3 = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

//캘린더 조회
exports.getCalendar = async function (req, res) {
  // 테스트용 user_id 고정
  const user_id = "test2"; // 임시 테스트용 사용자 ID

  let { selectedYear, selectedMonth, selectedDate } = req.query;
  if (!selectedYear || !selectedMonth || !selectedDate) {
    const today = new Date();
    selectedYear = String(today.getFullYear()).padStart(4, '0');
    selectedMonth = String(today.getMonth() + 1).padStart(2, '0');
    selectedDate = String(today.getDate()).padStart(2, '0');
  }
  const date = selectedYear + selectedMonth + selectedDate;

  // 데이터 조회
  // const calendarResult = await calendarService.retrieveCalendar(user_id, date);
  // const calendarDataResult = await calendarService.retrieveSelectedCalendar(user_id, date);
  const MindDiaryResult = await calendarService.retrieveCalendar(user_id, date);
  const MindDiaryDataResult = await calendarService.retrieveSelectedMindDiary(user_id, date);

  return res.status(200).json({
    // calendarResult: calendarResult.length > 0 ? calendarResult : null,
    MindDiaryResult,
    MindDiaryDataResult
  });
};


exports.postFile = async function (req, res) {

  try {
    const user_id = "test2";
    const date = req.body.fileDate;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "파일이 없습니다." });
    }

    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExt = ['.png', '.jpg', '.jpeg', '.tiff', '.tif', '.gif', '.webp', '.heif', '.heic'];

    if (!allowedExt.includes(extension)) {
      return res.status(400).json({ error: "지원하지 않는 확장자입니다." });
    }

    const server_name = uuidv4();
    const user_name = path.basename(file.originalname, extension);
    const fileKey = `images/${server_name}${extension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();
    console.log("S3 업로드 성공:", uploadResult);

    const response = await calendarService.createFileMem(user_id, date, server_name, user_name, extension);

    return res.status(200).json({ message: "파일 업로드 성공", data: response });

  } catch (err) {
    console.error('S3 업로드 오류:', err);
    return res.status(500).json({ error: "업로드 중 오류 발생" });
  }
};


exports.postMindDiary = async function (req, res) {
  try {
     const user_id = "test2"; // 임시 테스트용 사용자 ID
    const { selectedYear, selectedMonth, selectedDate } = req.query;

    if (!selectedYear || !selectedMonth || !selectedDate) {
      return res.status(400).json({ error: "Missing date query parameters" });
    }
    const date = selectedYear + selectedMonth + selectedDate;

    const { keyword, matter, change, solution, compliment } = req.body;

    const createMindDiaryResponse = await calendarService.createMindDiary(
      user_id,
      date,
      keyword,
      matter,
      change,
      solution,
      compliment
    );

    if (createMindDiaryResponse === "성공") {
      return res.status(200).json({ message: "마음 일기 등록에 성공했습니다." });
    } else {
      return res.status(400).json({ error: "마음 일기 등록에 실패했습니다." });
    }

  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
