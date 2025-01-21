import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaSearch, FaPlay, FaEnvelope, FaEye } from 'react-icons/fa';
import Home from './pages/home';
import Search from './pages/search';
import Start from './pages/start';
import Contact from './pages/contact';
import View from './pages/view';
import './css/styles.css'; 


function App() {
  return (
    <Router>
      <nav className="navbar">
        <ul className="navbar-icons">
          <li>
            <Link to="/">
              <FaHome className="icon" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/search">
              <FaSearch className="icon" />
              <span>Search</span>
            </Link>
          </li>
          <li>
            <Link to="/start">
              <FaPlay className="icon" />
              <span>Start</span>
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <FaEnvelope className="icon" />
              <span>Contact</span>
            </Link>
          </li>
          <li>
            <Link to="/view">
              <FaEye className="icon" />
              <span>View</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Route Configuration */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/start" element={<Start />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/view" element={<View />} />
      </Routes>
    </Router>
  );
}

export default App;