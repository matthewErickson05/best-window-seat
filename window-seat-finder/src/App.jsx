import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import './App.css';
import {useState} from 'react';
import { getFlightPath, testingFlight } from './services/flightAPI';
import detectAllLandmarks from './services/landmarkDetection';

function App() {
  const [flightData, setFlightData] = useState(null);
  const [landmarksFound, setLandmarksFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (flightNumber) => {
    setLoading(true);
    setError(null);
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    
    try {
      //Non-testing Line: const data = await getFlightPath(flightNumber);
      const data = await getFlightPath(flightNumber);
      setFlightData(data);
      console.log(data);
      if (data.path) {
        const landmarks = await detectAllLandmarks(data.path);
        setLandmarksFound(landmarks);
      }
    } catch (err) {
      setError(err.message);
      setFlightData(null);
      setLandmarksFound(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className = "app">
    <Sidebar onSearch={handleSearch}
    loading={loading}
    error={error}
    flightData = {flightData} 
    landmarks = {landmarksFound}/>
    <div className = "leaflet-container">
      <MapView flightData={flightData} 
      landmarksFound={landmarksFound}/>
    </div>

    </div>
  );
}

export default App;