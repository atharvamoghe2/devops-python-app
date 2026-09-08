import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';

const MainMap = () => {
  const [pins, setPins] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadPins();
  }, []);

  const loadPins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setPins(response.data);
    } catch (error) {
      console.error('Failed to load pins:', error);

      if (error.response?.status === 401) {
        logoutUser();
      }
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const selectPin = (coordinates) => {
    setSelectedCoords(coordinates);
  };

  return (
    <div className="app-container">
      <Sidebar
        pins={pins}
        onPinClick={selectPin}
        onLogout={logoutUser}
        user={currentUser}
      />

      <div className="map-container">
        <div style={{ padding: '10px', fontWeight: 'bold' }}>
          My Travel Map
        </div>

        <MapComponent
          pins={pins}
          setPins={setPins}
          flyToCoords={selectedCoords}
          user={currentUser}
        />
      </div>
    </div>
  );
};

export default MainMap;
