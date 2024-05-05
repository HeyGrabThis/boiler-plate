import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get('/api/hello')
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //로그아웃 요청
  const logout = () => {
    axios
      .get('/api/users/logout')
      .then((res) => {
        console.log(res.data);
        if (res.data.success === true) {
          navigate('/login');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      랜딩 페이지
      <button
        onClick={() => {
          logout();
        }}
      >
        log out
      </button>
    </div>
  );
};

export default LandingPage;
