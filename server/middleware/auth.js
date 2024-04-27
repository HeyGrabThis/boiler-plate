const User = require('../models/User');

//인증처리를 하는 곳
let auth = async (req, res, next) => {
  //클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth;
  //토큰을 디코딩한 후 유저를 찾는다 =>User모델에서 매서드 만들기
  const user = await User.findByToken(token);
  // 유저가 없으면 인증 X
  if (!user) {
    return res.json({
      isAuth: false,
      error: true,
    });
  }
  // 유저가 있으면 인증 O
  // 나중에 사용가능하도록 req 토큰과 user데이터에 넣어줌
  req.token = token;
  req.user = user;
  //next로 빠져나가게끔
  next();
};

module.exports = auth;
