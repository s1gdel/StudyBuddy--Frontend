import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/styles.css';
import Map from '../location/Location';

function View() {
    const [studySessions, setStudySessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const location = useLocation();

    useEffect(() => {
        fetchStudySessions();
    }, []);

    const fetchStudySessions = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/class-data`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Backend Response:", data); // Debugging
                const nowUTC = new Date(); // Current time in UTC
                const oneHourAgo = new Date(nowUTC.getTime() - 3* 60 * 60 * 1000); // 1 hour ago in UTC

                const filteredSessions = data.filter(session => {
                    const sessionDate = new Date(session.createdAt); // createdAt is already in UTC
                    console.log("Session Date:", sessionDate, "One Hour Ago:", oneHourAgo); // Debugging
                    return sessionDate > oneHourAgo; // Keep sessions created within the last hour
                });

                setStudySessions(filteredSessions); // Update state with filtered sessions
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