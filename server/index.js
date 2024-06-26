const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const User = require('./models/User');
const Config = require('./config/key');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

//bodyParser 옵션주기 =>이런 데이터들을 처리해서 파싱할 수 있도록
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
//cookieParser
app.use(cookieParser());

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
app.get('/api/hello', (req, res) => {
  res.send('Hello World!~~');
});

// 회원가입할 정보들 서버로 보내기 => async await 형식으로
app.post('/api/users/register', async (req, res) => {
  //body-parser를 이용해서 body에 데이터를 실어 보낼수있다.
  const user = new User(req.body);
  //save는 mongo매서드
  await user
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

//login요청
app.post('/api/users/login', async (req, res) => {
  try {
    //먼저 요청한 email이 db에 있는지 확인
    let userInfo = await User.findOne({ email: req.body.email });
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        msg: '제공된 이메일에 해당하는 유저가 없습니다',
      });
    }
    // db에 있다면 맞는 비밀번호인지 확인. comparePassword매서드는 User.js에서 생성해야함.
    //일치하는게 있다면 isMatch가 true값
    const isMatch = await userInfo.comparePassword(req.body.password, userInfo);
    //isMatch가 false라면 => 비밀번호가 같지 않다는 것(User.js파일에서 그렇게 리턴함)
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        msg: '비밀번호가 틀렸습니다',
      });
    }
    //비밀번호까지 맞다면 토큰 생성. generateToken()매서드도 User.js에서 생성해야함
    const jwtData = await userInfo.generateToken(userInfo);
    if (!jwtData.token) {
      //제대로 저장이안됐다면 400상태와 에러메세지 같이 전달 =>response로
      return res.status(400).send(jwtData.err);
    }
    //user에 있는 토큰을 저장해야한다. =>어디에? 쿠키, 로컬스토리지, 세션.... 여기선 쿠키에
    //'x_auth'라는 이름으로 user에 있는 토큰 저장
    res
      .cookie('x_auth', jwtData.token)
      .status(200)
      .json({ loginSuccess: true, userId: jwtData._id });
  } catch (err) {
    return res.status(400).send(err);
  }
});

//페이지 이동할 때 권한이 있는지 확인
//=> 쿠키에 있는 토큰을 디코딩 => user아이디가 나옴(아이디랑 문자 더해서 만들었음) => 그 user아이디를 db에서 찾아보고 db의 토큰이 쿠키에 있는 토큰이랑 같은지 확인
// 중간의 auth는 미들웨어(인증처리를 하는 곳)
app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 온 것은 auth로직을 통과해서 인증을 받고 왔다는 이야기
  //프론트에 status200이랑 json데이터 전달
  res.status(200).json({
    _id: req.user._id,
    //role이 0이면 일반, 0이아닌 다른수면 관리자(일단 이렇게 가정)
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//로그아웃기능 => 데이터베이스에서 그 유저의 토큰을 지워준다. => 자동적으로 클라이언트의 토큰과 맞지않으니 권한 상실
// 권한이 있는 상태에서 실행하므로 auth 미들웨어 등록
app.get('/api/users/logout', auth, (req, res) => {
  //_id를 통해서 찾고 token을 ''지우고 에러있다면 false, 성공했다면 200과 true
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' })
    .then(() => {
      return res.status(200).send({ success: true });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
