import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/styles.css'; 
import Map from '../location/Location'; 

function View() {
  const [studySessions, setStudySessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch data when the component mounts
    fetchStudySessions();
  }, []);

  const fetchStudySessions = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/class-data`)
      .then((response) => response.json())
      .then((data) => {
        const now = new Date();
        const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
        const filteredSessions = data.filter(session => {
          const sessionDate = new Date(session.createdAt);
          return sessionDate > threeHoursAgo;
        });
        setStudySessions(filteredSessions);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const getFilteredSessions = () => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    if (!searchQuery) {
      return studySessions;
    }

    const [courseCode, professorName] = searchQuery.split(',').map(str => str.trim().toLowerCase());

    return studySessions.filter(session => {
      const sessionCourseCode = session.className.toLowerCase();
      const sessionProfessorName = session.profName.toLowerCase();

      const matchesCourseCode = courseCode ? sessionCourseCode.includes(courseCode) : true;
      const matchesProfessorName = professorName ? sessionProfessorName.includes(professorName) : true;

      return matchesCourseCode && matchesProfessorName;
    });
  };

  const filteredSessions = getFilteredSessions();

  return (
    <div className="view-container">
      <div className="sessions-list">
        {filteredSessions.map((session, index) => (
          <div key={index} className="session-card">
            {/* Display session details */}
            <div>
              <h3><strong>Host:</strong> {session.personName}</h3>
              <p><strong>Class:</strong> {session.className}</p>
              <p><strong>Professor:</strong> {session.profName}</p>
              <p><strong>Description:</strong> {session.description}</p>
              <button onClick={() => setSelectedSession(session)}>View on Map</button>
            </div>
          </div>
        ))}
      </div>
      <div className="map-container">
        <Map studySessions={filteredSessions} selectedSession={selectedSession} />
      </div>
    </div>
  );
}

export default View;