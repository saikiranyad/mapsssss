import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';
import axios from 'axios';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Vehicle icon
const vehicleIcon = new L.Icon({
    iconUrl: 'https://e7.pngegg.com/pngimages/17/10/png-clipart-mini-cooper-scooter-motorcycle-minibike-small-motorcycle-scooter-motorcycle.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

// Fix missing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const socket = io('https://map-functionality.onrender.com', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
});

const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const Maps2 = () => {
    const [locations, setLocations] = useState({});
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [route, setRoute] = useState([]);
    const [distance, setDistance] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [rideStarted, setRideStarted] = useState(false);
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                socket.emit('updateLocation', { lat: latitude, lng: longitude });
            }, (error) => {
                console.error("Error getting location:", error);
            });
        }
        
        socket.on('locationUpdate', (data) => {
            setLocations(data);
        });
    }, []);

    const handleMapClick = (e) => {
        if (!startPoint) {
            setStartPoint(e.latlng);
        } else if (!endPoint) {
            setEndPoint(e.latlng);
            fetchRoute(startPoint, e.latlng);
        } else {
            setStartPoint(e.latlng);
            setEndPoint(null);
            setRoute([]);
            setDistance(null);
        }
    };

    const fetchRoute = async (start, end) => {
        try {
            const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
            const coordinates = response.data.routes[0].geometry.coordinates;
            setRoute(coordinates.map(coord => [coord[1], coord[0]]));
            setDistance((response.data.routes[0].distance / 1000).toFixed(2)); // Convert meters to KM
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const handleSearchChange = async (e) => {
        setSearchInput(e.target.value);
        if (e.target.value.length > 2) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (lat, lon) => {
        setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
        fetchRoute(startPoint || { lat: userLocation[0], lng: userLocation[1] }, { lat: parseFloat(lat), lng: parseFloat(lon) });
        setSearchInput('');
        setSuggestions([]);
    };

    const setLiveLocationAsStart = () => {
        setStartPoint({ lat: userLocation[0], lng: userLocation[1] });
    };

    const startRide = () => {
        setRideStarted(true);
    };

    const endRide = () => {
        setRideStarted(false);
        setStartPoint(null);
        setEndPoint(null);
        setRoute([]);
        setDistance(null);
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
            <input 
                type="text" 
                value={searchInput} 
                onChange={handleSearchChange} 
                placeholder="Enter a location"
                style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px' }}
            />
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {suggestions.map((s, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(s.lat, s.lon)} style={{ cursor: 'pointer', padding: '8px', background: '#e9ecef', margin: '2px 0', borderRadius: '5px' }}>
                        {s.display_name}
                    </li>
                ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <button onClick={setLiveLocationAsStart} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set Live Location</button>
                <button onClick={startRide} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer' }}>Start Ride</button>
                <button onClick={endRide} style={{ padding: '10px', borderRadius: '5px', background: '#dc3545', color: 'white', cursor: 'pointer' }}>End Ride</button>
            </div>
            {distance && <p style={{ fontWeight: 'bold', color: '#333' }}>Distance: {distance} km</p>}
            <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }} onClick={handleMapClick}>
                <RecenterMap center={userLocation} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
                {route.length > 0 && <Polyline positions={route} color="blue" />}
            </MapContainer>
        </div>
    );
};

export default Maps2;