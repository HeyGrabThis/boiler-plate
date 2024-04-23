const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

//모델로 감싸기 => 이름이 User이고 틀이 userSchema인 모델 생성
const User = mongoose.model('User', userSchema);

module.exports = User;
