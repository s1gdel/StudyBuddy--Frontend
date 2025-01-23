import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const Map = ({ studySessions, selectedSession }) => {
    const defaultPosition = [32.9855, -96.7500]; // Default position: UTD
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);

    const center = selectedSession
        ? [selectedSession.latitude, selectedSession.longitude]
        : userLocation || defaultPosition;

    const markerRefs = useRef({});

    useEffect(() => {
        if (selectedSession && markerRefs.current[selectedSession.id]) {
            const marker = markerRefs.current[selectedSession.id];
            marker.openPopup();
        }
    }, [selectedSession]);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to retrieve your location.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <button
                onClick={handleGetLocation}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000,
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Get My Location
            </button>

            <MapContainer
                center={defaultPosition}
                zoom={15.5}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <ChangeView center={center} zoom={15.5} />

                {studySessions
                    .filter((session) => session.latitude && session.longitude)
                    .map((session, index) => (
                        <Marker
                            key={session.id || index}
                            position={[session.latitude, session.longitude]}
                            ref={(ref) => {
                                if (ref) {
                                    markerRefs.current[session.id || index] = ref;
                                }
                            }}
                        >
                            <Popup className='custom-popup'>
                                <strong>Host:</strong> {session.personName}<br />
                                <strong>Class:</strong> {session.className}<br />
                                <strong>Professor:</strong> {session.profName}<br />
                                <strong>Description:</strong> {session.description}
                            </Popup>
                        </Marker>
                    ))}

                {userLocation && (
                    <Marker position={userLocation}>
                        <Popup>You are here!</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default Map;
