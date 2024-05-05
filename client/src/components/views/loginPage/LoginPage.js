import styles from './LoginPage.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  //이메일과 비밀번호 넣을 state생성
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //이메일과 비밀번호 변경함수
  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const changePassword = (e) => {
    setPassword(e.target.value);
  };
  //login submit
  const submitLogin = (e) => {
    //페이지 리로드 방지
    e.preventDefault();
    //body객체 만들기
    let body = {
      email: email,
      password: password,
    };
    // 서버에 post요청
    axios
      .post('/api/users/login', body)
      .then((res) => {
        //응답 데이터의 loginSuccess가 true라면
        if (res.data.loginSuccess === true) {
          //랜딩페이지 이동
          navigate('/');
        } else {
          //그렇지 않다면 메시지 출력
          alert(res.data.msg);
        }
      })
      .catch((err) => {
        //에러 메시지 출력
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <Form onSubmit={submitLogin}>
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
            <Form.Text className="text-muted">이메일을 입력해주세요</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => {
                changePassword(event);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="아이디 기억하기" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Log in
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
