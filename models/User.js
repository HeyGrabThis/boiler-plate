const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

//스키마는 db틀을 정한다고 생각하면 됨
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    //trim은 문자 공백을 없애준다
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  //관리자, 일반 이렇게 나누기 위해 role추가
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  //유효성
  token: {
    type: String,
  },
  //유효기간
  tokenExp: {
    type: Number,
  },
});

//save매서드 실행전에 무엇을 할 것인지
userSchema.pre('save', function (next) {
  //여기서 this는 userSchema를 가리킨다
  let user = this;
  //비밀번호가 변경될 때만 암호화
  if (user.isModified('password')) {
    //bcrypt의 salt이용해서 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      //에러가 있다면 다음으로 넘김
      if (err) return next(err);
      //여기서 user.password는 내가 입력한 비밀번호, hash는 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        //암호화된 비밀번호로 바꿔줌.
        user.password = hash;
        //마지막으로는 다시 돌아가기
        next();
      });
    });
  } else {
    //비밀번호 바꾼게 아니라면 나가기
    next();
  }
});

//비밀번호 비교하는 매서드 만들기 (bcrypt를 이용한 암호화된 것과 비교)
userSchema.methods.comparePassword = async (plainPassword, userInfo) => {
  //plainPassword를 암호화해서 이미 암호화된 db비밀번호와 대조
  let isMatch = await bcrypt.compare(plainPassword, userInfo.password);
  // isMatch가 있다면 null, true값의 isMatch리턴
  if (isMatch) {
    return isMatch;
  }
  // isMatch가 없다면 false리턴
  return (isMatch = false);
};

//토큰 생성하는 매서드 만들기
userSchema.methods.generateToken = async (userInfo) => {
  //jsonwebtoken을 이용해서 token생성하기
  //uesr의 _id와 secretToken이라는 문자열을 더해서 토큰 생성
  let token = jwt.sign(userInfo._id.toHexString(), 'secretToken');
  // 만든 토큰을 이 유저 token정보에 저장
  userInfo.token = token;
  //더이상 save가 안에서 콜백함수를 지원하지 않기 때문에 then과 catch를 이용해야함.
  //지금은 res인자를 사용하는 것이 아니고 return해줘야하므로 이렇게 작성
  const result = await userInfo.save();
  if (result) {
    return result;
  }
};

userSchema.statics.findByToken = async (token) => {
  //토큰을 decode한다.
  const decoded = jwt.verify(token, 'secretToken');
  //유저 아이디를 통해 db에서 유저를 찾는다.
  //클라이언트의 토큰과 db의 토큰이 일치하는지 확인
  const user = await User.findOne({ _id: decoded, token: token });
  return user;
};

//모델로 감싸기 => 이름이 User이고 틀이 userSchema인 모델 생성
const User = mongoose.model('User', userSchema);

module.exports = User;
