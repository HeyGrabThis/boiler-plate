const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const User = require('./models/User');
const Config = require('./config/key');

//bodyParser 옵션주기 =>이런 데이터들을 처리해서 파싱할 수 있도록
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());

//몽고 db가져오기
const mongoose = require('mongoose');
//몽고db연결
mongoose
  .connect(Config.mongoURI, {})
  .then(() => {
    console.log('mongoDB Connected!');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!~~');
});

// 회원가입할 정보들 서버로 보내기 => async await 형식으로
app.post('/register', async (req, res) => {
  //body-parser를 이용해서 body에 데이터를 실어 보낼수있다.
  const user = new User(req.body);
  //save는 mongo매서드
  const result = await user
    .save()
    .then(() => {
      //성공하면 성공했다는 status200과 json 객체 전달
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      //실패하면
      res.json({ success: false, err });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
