// code is really good

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

const Maps5 = () => {
    const [locations, setLocations] = useState({});
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [route, setRoute] = useState([]);
    const [distance, setDistance] = useState(null);
    const [fromInput, setFromInput] = useState('');
    const [toInput, setToInput] = useState('');

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

    const handleFromLocation = async () => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${fromInput}`);
            if (response.data.length > 0) {
                const location = response.data[0];
                setStartPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    const handleToLocation = async () => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${toInput}`);
            if (response.data.length > 0) {
                const location = response.data[0];
                setEndPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    const fetchRoute = async () => {
        if (startPoint && endPoint) {
            try {
                const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
                const coordinates = response.data.routes[0].geometry.coordinates;
                setRoute(coordinates.map(coord => [coord[1], coord[0]]));
                setDistance((response.data.routes[0].distance / 1000).toFixed(2)); // Convert meters to KM
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        }
    };

    const setLiveLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setStartPoint({ lat: latitude, lng: longitude });
            }, (error) => {
                console.error("Error getting live location:", error);
            });
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
            <input 
                type="text" 
                value={fromInput} 
                onChange={(e) => setFromInput(e.target.value)}
                placeholder="From Location"
                style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginRight: '10px' }}
            />
            <button onClick={handleFromLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
            <input 
                type="text" 
                value={toInput} 
                onChange={(e) => setToInput(e.target.value)}
                placeholder="To Location"
                style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginLeft: '10px' }}
            />
            <button onClick={handleToLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
            <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Show Route</button>
            <button onClick={setLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Live Location</button>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                {distance && <p>Distance: {distance} km</p>}
            </div>
            <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
                <RecenterMap center={userLocation} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
                {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
                {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
                {route.length > 0 && <Polyline positions={route} color="blue" />}
            </MapContainer>
        </div>
    );
};

export default Maps5;