


import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';
import axios from 'axios';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Vehicle icon with rotation
const vehicleIcon = new L.Icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Arrow_Up.svg/1024px-Red_Arrow_Up.svg.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
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

const Maps9 = () => {
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [userHeading, setUserHeading] = useState(0);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [route, setRoute] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [fromInput, setFromInput] = useState('');
    const [toInput, setToInput] = useState('');
    const [useLiveLocation, setUseLiveLocation] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude, heading } = position.coords;
                setUserLocation([latitude, longitude]);
                setUserHeading(heading || 0);
                socket.emit('updateLocation', { lat: latitude, lng: longitude });
            }, (error) => {
                console.error("Error getting location:", error);
            });
        }
    }, []);

    const handleLocationFetch = async (query, setFunction) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            if (response.data.length > 0) {
                const location = response.data[0];
                setFunction({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    const fetchRoute = async () => {
        if (endPoint) {
            const start = useLiveLocation ? userLocation : startPoint;
            if (start) {
                try {
                    const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
                    const routeData = response.data.routes[0];
                    setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
                    setDistance((routeData.distance / 1000).toFixed(2));
                    const totalMinutes = routeData.duration / 60;
const hours = Math.floor(totalMinutes / 60);
const minutes = Math.floor(totalMinutes % 60);
setDuration(`${hours}:${minutes.toString().padStart(2, '0')}`);
                } catch (error) {
                    console.error("Error fetching route:", error);
                }
            }
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                <input type="text" value={fromInput} onChange={(e) => setFromInput(e.target.value)} placeholder="From Location" disabled={useLiveLocation} style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
                <button onClick={() => handleLocationFetch(fromInput, setStartPoint)} disabled={useLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
                <input type="text" value={toInput} onChange={(e) => setToInput(e.target.value)} placeholder="To Location" style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
                <button onClick={() => handleLocationFetch(toInput, setEndPoint)} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
                <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer' }}>Show Route</button>
                <button onClick={() => setUseLiveLocation(!useLiveLocation)} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer' }}>{useLiveLocation ? "Disable Live Location" : "Live Location"}</button>
            </div>
            <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                {distance && <p><strong>Distance:</strong> {distance} km</p>}
                {duration && <p><strong>Estimated Time:</strong> {duration} mins</p>}
            </div>
            <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
                <RecenterMap center={userLocation} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={userLocation} icon={vehicleIcon} rotationAngle={userHeading}><Popup>Your Live Location</Popup></Marker>
                {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
                {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
                {route.length > 0 && <Polyline positions={route} color="blue" />}
            </MapContainer>
        </div>
    );
};

export default Maps9;

