const mongoose = require('mongoose');

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

//모델로 감싸기 => 이름이 User이고 틀이 userSchema인 모델 생성
const User = mongoose.model('User', userSchema);

module.exports = User;
