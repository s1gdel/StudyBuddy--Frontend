import React, { useState, useEffect } from 'react';
import '../css/styles.css'; 


const Start = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    className: '',
    professor: '',
    description: '',
    latitude: null,
    longitude: null
  });

  const [sessions, setSessions] = useState([]); // State to store saved sessions
  const [editSession, setEditSession] = useState(null); // Session being edited
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  // Load data from local storage when the component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }

    // Load saved sessions from local storage
    const savedSessions = localStorage.getItem('sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save form data to local storage
    localStorage.setItem('formData', JSON.stringify(formData));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData({
            ...formData,
            latitude,
            longitude
          });

          try {
            if (isEditing) {
              // Send PUT request to update session
              const response = await fetch(`${process.env.REACT_APP_API_URL}/api/class-data/${editSession.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  personName: formData.firstName,
                  className: formData.className,
                  profName: formData.professor,
                  description: formData.description,
                  latitude,
                  longitude
                }),
              });

              if (!response.ok) {
                throw new Error('Network response was not ok');
              }

              const result = await response.json();
              console.log('Updated session:', result);

              // Update sessions state
              const updatedSessions = sessions.map(session =>
                session.id === editSession.id ? { ...formData, id: editSession.id } : session
              );
              setSessions(updatedSessions);
              localStorage.setItem('sessions', JSON.stringify(updatedSessions));

              // Reset form and editing state
              setFormData({
                firstName: '',
                className: '',
                professor: '',
                description: '',
                latitude: null,
                longitude: null
              });
              setEditSession(null);
              setIsEditing(false);
              localStorage.removeItem('formData');
            } else {
              // Send POST request to create new session
              const response = await fetch(`${process.env.REACT_APP_API_URL}/api/class-data`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  personName: formData.firstName,
                  className: formData.className,
                  profName: formData.professor,
                  description: formData.description,
                  latitude,
                  longitude
                }),
              });

              if (!response.ok) {
                throw new Error('Network response was not ok');
              }

              const result = await response.json();
              console.log('Created session:', result);

              // Save the session to local storage
              const newSession = {
                id: result.id, // Assuming the backend returns an ID
                firstName: formData.firstName,
                className: formData.className,
                professor: formData.professor,
                description: formData.description,
                latitude,
                longitude
              };

              const updatedSessions = [...sessions, newSession];
              setSessions(updatedSessions);
              localStorage.setItem('sessions', JSON.stringify(updatedSessions));

              // Reset the form
              setFormData({
                firstName: '',
                className: '',
                professor: '',
                description: '',
                latitude: null,
                longitude: null
              });
              localStorage.removeItem('formData');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        },
        (err) => {
          console.error('Error fetching location:', err);
          alert('Unable to fetch your location. Please ensure location services are enabled.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleDelete = async (session) => {
    try {
      if (!session || !session.id) {
        throw new Error('No session selected for deletion or session ID is missing');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/class-data/${session.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedSessions = sessions.filter((s) => s.id !== session.id);
      setSessions(updatedSessions); // Remove the session from the view
      localStorage.setItem('sessions', JSON.stringify(updatedSessions)); // Update local storage
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleEdit = (session) => {
    setEditSession(session);
    setIsEditing(true);
    setFormData({
      firstName: session.firstName,
      className: session.className,
      professor: session.professor,
      description: session.description,
      latitude: session.latitude,
      longitude: session.longitude
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditSession(null);
    setFormData({
      firstName: '',
      className: '',
      professor:'',
      description:''

    })
  };

  const handleClearStorage = () => {
    localStorage.removeItem('formData');
    localStorage.removeItem('sessions');
    setFormData({
      firstName: '',
      className: '',
      professor: '',
      description: '',
      latitude: null,
      longitude: null
    });
    setSessions([]);
    alert('Sessions cleared!');
  };

  return (
    <div>
      <h1>Create a Study Session</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Your name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <label>
          Class Name:
          <input type="text" name="className" value={formData.className} onChange={handleChange} required />
        </label>
        <label>
          Professor Last name:
          <input type="text" name="professor" value={formData.professor} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        {isEditing && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel Edit
          </button>
        )}
        <button type="submit">{isEditing ? 'Update Session' : 'Create Session'}</button>
      </form>

      {/* Clear Storage Button */}
      <button onClick={handleClearStorage}>
        Clear Sessions
      </button>

      {/* Display saved sessions */}
      <div>
        <h2>All Sessions</h2>
        {sessions.length > 0 ? (
          <ul>
            {sessions.map((session, index) => (
              <li key={session.id}>
                <div>
                  <p><strong>Name:</strong> {session.firstName}</p>
                  <p><strong>Class:</strong> {session.className}</p>
                  <p><strong>Professor:</strong> {session.professor}</p>
                  <p><strong>Description:</strong> {session.description}</p>
                  <button onClick={() => handleEdit(session)}>Edit</button>
                  <button onClick={() => handleDelete(session)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions saved yet.</p>
        )}
      </div>
    </div>
  );
};

export default Start;