import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import LandingPage from './components/views/landingPage/LandingPage';
import LoginPage from './components/views/loginPage/LoginPage';
import NavBar from './components/views/navBar/NavBar';
import RegisterPage from './components/views/registerPage/RegisterPage';
import Footer from './components/views/footer/Footer';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  let navigate = useNavigate();
  return (
    <div className="App">
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>} />
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/signup" element={<RegisterPage></RegisterPage>} />
      </Routes>
    </div>
  );
}

export default App;
