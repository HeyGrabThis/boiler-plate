import { useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
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
  return <div>랜딩 페이지</div>;
};

export default LandingPage;
