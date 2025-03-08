import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';
import axios from 'axios';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const vehicleIcon = new L.Icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Arrow_Up.svg/1024px-Red_Arrow_Up.svg.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

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

const Maps11 = () => {
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
    const [suggestions, setSuggestions] = useState([]);

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

    const handleLocationFetch = async (query, setFunction, setInput) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            if (response.data.length > 0) {
                const location = response.data[0];
                setFunction({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
                setInput(location.display_name);
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    const handleInputChange = async (e, setInput, setFunction) => {
        const query = e.target.value;
        setInput(query);
        if (query.length > 2) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const selectSuggestion = (location, setFunction, setInput) => {
        setFunction({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
        setInput(location.display_name);
        setSuggestions([]);
    };

    const fetchRoute = async () => {
        const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
        if (start && endPoint) {
            try {
                const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
                const routeData = response.data.routes[0];
                setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
                setDistance((routeData.distance / 1000).toFixed(2));
                setDuration((routeData.duration / 60).toFixed(2));
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        }
    };

    return (
        <div>
            <input type="text" value={fromInput} onChange={(e) => handleInputChange(e, setFromInput, setStartPoint)} placeholder="From Location" />
            <ul>{suggestions.map((s, i) => (<li key={i} onClick={() => selectSuggestion(s, setStartPoint, setFromInput)}>{s.display_name}</li>))}</ul>
            <input type="text" value={toInput} onChange={(e) => handleInputChange(e, setToInput, setEndPoint)} placeholder="To Location" />
            <ul>{suggestions.map((s, i) => (<li key={i} onClick={() => selectSuggestion(s, setEndPoint, setToInput)}>{s.display_name}</li>))}</ul>
            <button onClick={fetchRoute}>Show Route</button>
            <MapContainer center={userLocation} zoom={13}>
                <RecenterMap center={userLocation} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
                {route.length > 0 && <Polyline positions={route} color="blue" />}
            </MapContainer>
        </div>
    );
};

export default Maps11;