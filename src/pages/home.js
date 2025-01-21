import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css'; 

function Home() {
  const navigate = useNavigate();

  const getStarted = () => {
    navigate('/search');
  };

  return (
    <div className="home">
      <h1>Welcome to Study Buddy!</h1>
      <p>Find people to study with ease!</p>
      <p>Just search for a group</p>
      <p>or create your own</p>
      <button onClick={getStarted}>Get started</button>
    </div>
  );
}

export default Home;