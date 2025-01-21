import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css'; 

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const navigate = useNavigate();

  // Fetch all study sessions when the component mounts
  useEffect(() => {
    fetch('http://localhost:8080/api/class-data')
      .then((response) => response.json())
      .then((data) => {
        setAllSessions(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Handle search input changes
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter sessions based on the search query
    if (query) {
      const filtered = allSessions.filter((session) => {
        const matchesCourseCode = session.className.toLowerCase().includes(query.toLowerCase());
        const matchesProfessorName = session.profName.toLowerCase().includes(query.toLowerCase());
        return matchesCourseCode || matchesProfessorName;
      });
      setFilteredSessions(filtered);
    } else {
      setFilteredSessions([]); // Clear dropdown if search query is empty
    }
  };

  // Handle selection from the dropdown
  const handleSelectSession = (session) => {
    setSearchQuery(`${session.className}, ${session.profName}`);
    setFilteredSessions([]); // Clear dropdown after selection
  };

  // Handle search button click
  const handleSearch = () => {
    navigate(`/view?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="search">
      <h1>Search</h1>
      <p>
        Find study groups by entering the course code (e.g. CS 2336) and/or professor last name
        separated by a comma (e.g. CS 2336, Satpute).
      </p>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search for group"
          value={searchQuery}
          onChange={handleInputChange}
        />
        {/* Dropdown menu for matching results */}
        {filteredSessions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              zIndex: 1000,
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {filteredSessions.map((session, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
                onClick={() => handleSelectSession(session)}
              >
                <strong>{session.className}</strong> - {session.profName}
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Search;