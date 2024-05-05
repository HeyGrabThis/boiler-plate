import styles from './RegisterPage.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  //이메일과 이름,비밀번호,비번확인 넣을 state생성
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //비밀번호와 비번 확인 state가 같은지 확인하고 메시지 담는 state
  const [samePassword, setSamePassword] = useState('');

  //이메일과 이름,비밀번호,비번확인 변경함수
  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const changeName = (e) => {
    setName(e.target.value);
  };
  const changePassword = (e) => {
    setPassword(e.target.value);
  };
  const changeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };
  //비밀번호와 비번확인 비교
  useEffect(() => {
    //비밀번호에 값이 있을 때만 안내메시지 실행
    if (password) {
      if (password !== confirmPassword) {
        setSamePassword('비밀번호가 같지 않습니다');
      } else if (password === confirmPassword) {
        setSamePassword('비밀번호가 일치합니다');
      }
    } else {
      //비밀번호에 값이 없다면 안내메시지 제거
      setSamePassword('');
    }
  }, [password, confirmPassword]);
  //login submit
  const submitRegister = (e) => {
    //페이지 리로드 방지
    e.preventDefault();
    if (!email) {
      return alert('이메일을 입력해주세요');
    }
    if (!name) {
      return alert('이름을 입력해주세요');
    }
    if (!password) {
      return alert('비밀번호를 입력해주세요');
    }
    // 비밀번호가 일치하지 않거나 비밀번호 값이 없을 때
    if (samePassword !== '비밀번호가 일치합니다') {
      return alert('비밀번호가 일치하지 않습니다');
    }
    //body객체 만들기
    let body = {
      email: email,
      password: password,
      name: name,
    };
    // 서버에 post요청
    axios
      .post('/api/users/register', body)
      .then((res) => {
        //응답 데이터의 success가 true라면
        if (res.data.success === true) {
          //로그인페이지 이동
          navigate('/login');
        } else {
          //그렇지 않다면 메시지 출력
          alert('회원가입에 실패했습니다');
        }
      })
      .catch((err) => {
        //에러 메시지 출력
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.register}>
        <Form onSubmit={submitRegister}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(event) => {
                changeEmail(event);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(event) => {
                changeName(event);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(event) => {
                changePassword(event);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(event) => {
                changeConfirmPassword(event);
              }}
            />
            <Form.Text
              className={styles.passwordText}
              style={{
                color:
                  samePassword === '비밀번호가 일치합니다'
                    ? 'rgb(40, 38, 169)'
                    : 'rgb(169, 38, 38)',
              }}
            >
              {samePassword}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="아이디 기억하기" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign up
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
