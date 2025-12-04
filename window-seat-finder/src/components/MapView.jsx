import { MapContainer, TileLayer, Polyline, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {useCallback} from 'react';
import L from 'leaflet';

function MapView({flightData, landmarksFound}) {
  const center = [39.0, -98.0];
  const zoom = 4;
  const purpleOptions = { color: 'purple' };
  const worldBounds = [
    [-90,-180],
    [90,180]
  ];

  const cityIcon = new L.Icon({
    iconUrl: '/city_icon.png', // Replace with your city icon path
    iconSize: [40, 60],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const landmarkIcon = new L.Icon({
    iconUrl: '/landmark_icon.png', // Replace with your landmark icon path
    iconSize: [40, 60],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const naturalIcon = new L.Icon({
    iconUrl: '/natural_icon.png', // Replace with your natural icon path
    iconSize: [40, 60],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Function to get the correct icon based on type
  const getIconByType = (type) => {
    switch (type) {
      case 'city':
        return cityIcon;
      case 'landmark':
        return landmarkIcon;
      case 'natural':
        return naturalIcon;
      default:
        return cityIcon; // fallback to city icon
    }
  };

  return (
      <MapContainer 
        center={center} 
        zoom={zoom} 
        zoomControl={true}
        maxBounds={worldBounds}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://carto.com/">carto.com</a> contributors'
          noWrap='true'
          minZoom={3}
          maxZoom={17}
        />
        {flightData && flightData.coordinates && <Polyline pathOptions={purpleOptions} positions={flightData.coordinates} />}
        {landmarksFound && landmarksFound[0].map(marker => (
          <Marker key={marker.id}
          position={[marker.lat, marker.lon]}
          icon={getIconByType(marker.type)}
          ></Marker>
        ))}
        {landmarksFound && landmarksFound[1].map(marker => (
          <Marker key={marker.id}
          position={[marker.lat, marker.lon]}
          icon={getIconByType(marker.type)}
          ></Marker>
        ))}
      </MapContainer>
  );
}

export default MapView;