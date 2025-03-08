import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix missing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const socket = io('https://map-functionality.onrender.com', {
    transports: ['websocket'], // Use WebSocket transport only
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
});

const Maps = () => {
    const [locations, setLocations] = useState({});
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);

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

    return (
        <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.values(locations).map((loc, index) => (
                <Marker key={index} position={[loc.lat, loc.lng]}>
                    <Popup>Live Location</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Maps;



// // import React, { useEffect, useState } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import io from 'socket.io-client';
// // import L from 'leaflet';

// // import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// // import markerIcon from 'leaflet/dist/images/marker-icon.png';
// // import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // // Fix missing Leaflet marker icons
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //     iconRetinaUrl: markerIcon2x,
// //     iconUrl: markerIcon,
// //     shadowUrl: markerShadow,
// // });

// // const socket = io('https://map-functionality.onrender.com', {
// //     transports: ['websocket'], // Use WebSocket transport only
// //     reconnection: true,
// //     reconnectionAttempts: 5,
// //     reconnectionDelay: 3000
// // });

// // const MapComponent = () => {
// //     const [locations, setLocations] = useState({});
// //     const [userLocation, setUserLocation] = useState([51.505, -0.09]);

// //     useEffect(() => {
// //         if (navigator.geolocation) {
// //             navigator.geolocation.watchPosition((position) => {
// //                 const { latitude, longitude } = position.coords;
// //                 setUserLocation([latitude, longitude]);
// //                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
// //             }, (error) => {
// //                 console.error("Error getting location:", error);
// //             });
// //         }
        
// //         socket.on('locationUpdate', (data) => {
// //             setLocations(data);
// //         });
// //     }, []);

// //     return (
// //         <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
// //             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
// //             {Object.values(locations).map((loc, index) => (
// //                 <Marker key={index} position={[loc.lat, loc.lng]}>
// //                     <Popup>
// //                         <b>Live Location</b><br />
// //                         {loc.locationName || "Fetching location..."}
// //                     </Popup>
// //                 </Marker>
// //             ))}
// //         </MapContainer>
// //     );
// // };

// // export default MapComponent;







// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const MapComponent = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     return (
//         <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }} onClick={handleMapClick}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             {Object.values(locations).map((loc, index) => (
//                 <Marker key={index} position={[loc.lat, loc.lng]}>
//                     <Popup>
//                         <b>Live Location</b><br />
//                         {loc.locationName || "Fetching location..."}
//                     </Popup>
//                 </Marker>
//             ))}
//             {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//             {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//             {route.length > 0 && <Polyline positions={route} color="blue" />}
//         </MapContainer>
//     );
// };

// export default MapComponent;



// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [searchInput, setSearchInput] = useState('');
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     const handleSearch = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`);
//             if (response.data.length > 0) {
//                 const { lat, lon } = response.data[0];
//                 if (!startPoint) {
//                     setStartPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//                 } else if (!endPoint) {
//                     setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//                     fetchRoute(startPoint, { lat: parseFloat(lat), lng: parseFloat(lon) });
//                 } else {
//                     setStartPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//                     setEndPoint(null);
//                     setRoute([]);
//                 }
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     return (
//         <div>
//             <input 
//                 type="text" 
//                 value={searchInput} 
//                 onChange={(e) => setSearchInput(e.target.value)} 
//                 placeholder="Enter a location"
//             />
//             <button onClick={handleSearch}>Find Location</button>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {Object.values(locations).map((loc, index) => (
//                     <Marker key={index} position={[loc.lat, loc.lng]}>
//                         <Popup>
//                             <b>Live Location</b><br />
//                             {loc.locationName || "Fetching location..."}
//                         </Popup>
//                     </Marker>
//                 ))}
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;








// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [searchInput, setSearchInput] = useState('');
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     const handleSearch = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`);
//             if (response.data.length > 0) {
//                 const { lat, lon } = response.data[0];
//                 setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//                 fetchRoute(startPoint || { lat: userLocation[0], lng: userLocation[1] }, { lat: parseFloat(lat), lng: parseFloat(lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const setLiveLocationAsStart = () => {
//         setStartPoint({ lat: userLocation[0], lng: userLocation[1] });
//     };

//     return (
//         <div>
//             <input 
//                 type="text" 
//                 value={searchInput} 
//                 onChange={(e) => setSearchInput(e.target.value)} 
//                 placeholder="Enter a location"
//             />
//             <button onClick={handleSearch}>Find Location</button>
//             <button onClick={setLiveLocationAsStart}>Set Live Location as Start</button>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {Object.values(locations).map((loc, index) => (
//                     <Marker key={index} position={[loc.lat, loc.lng]}>
//                         <Popup>
//                             <b>Live Location</b><br />
//                             {loc.locationName || "Fetching location..."}
//                         </Popup>
//                     </Marker>
//                 ))}
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;






// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://cdn-icons-png.flaticon.com/512/34/34639.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality-maps.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [searchInput, setSearchInput] = useState('');
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     const handleSearch = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`);
//             if (response.data.length > 0) {
//                 const { lat, lon } = response.data[0];
//                 setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//                 fetchRoute(startPoint || { lat: userLocation[0], lng: userLocation[1] }, { lat: parseFloat(lat), lng: parseFloat(lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const setLiveLocationAsStart = () => {
//         setStartPoint({ lat: userLocation[0], lng: userLocation[1] });
//     };

//     return (
//         <div>
//             <input 
//                 type="text" 
//                 value={searchInput} 
//                 onChange={(e) => setSearchInput(e.target.value)} 
//                 placeholder="Enter a location"
//             />
//             <button onClick={handleSearch}>Find Location</button>
//             <button onClick={setLiveLocationAsStart}>Set Live Location as Start</button>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;




// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://cdn-icons-png.flaticon.com/512/34/34639.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [searchInput, setSearchInput] = useState('');
//     const [suggestions, setSuggestions] = useState([]);
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     const handleSearchChange = async (e) => {
//         setSearchInput(e.target.value);
//         if (e.target.value.length > 2) {
//             try {
//                 const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`);
//                 setSuggestions(response.data);
//             } catch (error) {
//                 console.error("Error fetching suggestions:", error);
//             }
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const handleSuggestionClick = (lat, lon) => {
//         setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//         fetchRoute(startPoint || { lat: userLocation[0], lng: userLocation[1] }, { lat: parseFloat(lat), lng: parseFloat(lon) });
//         setSearchInput('');
//         setSuggestions([]);
//     };

//     const setLiveLocationAsStart = () => {
//         setStartPoint({ lat: userLocation[0], lng: userLocation[1] });
//     };

//     return (
//         <div>
//             <input 
//                 type="text" 
//                 value={searchInput} 
//                 onChange={handleSearchChange} 
//                 placeholder="Enter a location"
//             />
//             <ul>
//                 {suggestions.map((s, index) => (
//                     <li key={index} onClick={() => handleSuggestionClick(s.lat, s.lon)}>
//                         {s.display_name}
//                     </li>
//                 ))}
//             </ul>
//             <button onClick={setLiveLocationAsStart}>Set Live Location as Start</button>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;







// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://e7.pngegg.com/pngimages/17/10/png-clipart-mini-cooper-scooter-motorcycle-minibike-small-motorcycle-scooter-motorcycle.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [searchInput, setSearchInput] = useState('');
//     const [suggestions, setSuggestions] = useState([]);
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     const handleSearchChange = async (e) => {
//         setSearchInput(e.target.value);
//         if (e.target.value.length > 2) {
//             try {
//                 const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`);
//                 setSuggestions(response.data);
//             } catch (error) {
//                 console.error("Error fetching suggestions:", error);
//             }
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const handleSuggestionClick = (lat, lon) => {
//         setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//         fetchRoute(startPoint || { lat: userLocation[0], lng: userLocation[1] }, { lat: parseFloat(lat), lng: parseFloat(lon) });
//         setSearchInput('');
//         setSuggestions([]);
//     };

//     const setLiveLocationAsStart = () => {
//         setStartPoint({ lat: userLocation[0], lng: userLocation[1] });
//     };

//     return (
//         <div style={{ padding: '10px', textAlign: 'center' }}>
//             <input 
//                 type="text" 
//                 value={searchInput} 
//                 onChange={handleSearchChange} 
//                 placeholder="Enter a location"
//                 style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
//             />
//             <ul style={{ listStyleType: 'none', padding: 0 }}>
//                 {suggestions.map((s, index) => (
//                     <li key={index} onClick={() => handleSuggestionClick(s.lat, s.lon)} style={{ cursor: 'pointer', padding: '5px', background: '#f0f0f0', margin: '2px 0' }}>
//                         {s.display_name}
//                     </li>
//                 ))}
//             </ul>
//             <button onClick={setLiveLocationAsStart} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>Set Live Location as Start</button>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;







// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://e7.pngegg.com/pngimages/17/10/png-clipart-mini-cooper-scooter-motorcycle-minibike-small-motorcycle-scooter-motorcycle.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [searchInput, setSearchInput] = useState('');
//     const [suggestions, setSuggestions] = useState([]);
//     const [rideStarted, setRideStarted] = useState(false);
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//             setDistance(null);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//             setDistance((response.data.routes[0].distance / 1000).toFixed(2)); // Convert meters to KM
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     const handleSearchChange = async (e) => {
//         setSearchInput(e.target.value);
//         if (e.target.value.length > 2) {
//             try {
//                 const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`);
//                 setSuggestions(response.data);
//             } catch (error) {
//                 console.error("Error fetching suggestions:", error);
//             }
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const handleSuggestionClick = (lat, lon) => {
//         setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//         fetchRoute(startPoint || { lat: userLocation[0], lng: userLocation[1] }, { lat: parseFloat(lat), lng: parseFloat(lon) });
//         setSearchInput('');
//         setSuggestions([]);
//     };

//     const setLiveLocationAsStart = () => {
//         setStartPoint({ lat: userLocation[0], lng: userLocation[1] });
//     };

//     const startRide = () => {
//         setRideStarted(true);
//     };

//     const endRide = () => {
//         setRideStarted(false);
//         setStartPoint(null);
//         setEndPoint(null);
//         setRoute([]);
//         setDistance(null);
//     };

//     return (
//         <div style={{ padding: '10px', textAlign: 'center' }}>
//             <input 
//                 type="text" 
//                 value={searchInput} 
//                 onChange={handleSearchChange} 
//                 placeholder="Enter a location"
//                 style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
//             />
//             <ul style={{ listStyleType: 'none', padding: 0 }}>
//                 {suggestions.map((s, index) => (
//                     <li key={index} onClick={() => handleSuggestionClick(s.lat, s.lon)} style={{ cursor: 'pointer', padding: '5px', background: '#f0f0f0', margin: '2px 0' }}>
//                         {s.display_name}
//                     </li>
//                 ))}
//             </ul>
//             <button onClick={setLiveLocationAsStart} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>Set Live Location as Start</button>
//             <button onClick={startRide} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer', marginLeft: '10px' }}>Start Ride</button>
//             <button onClick={endRide} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer', marginLeft: '10px' }}>End Ride</button>
//             {distance && <p>Distance: {distance} km</p>}
//             <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;











// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://e7.pngegg.com/pngimages/17/10/png-clipart-mini-cooper-scooter-motorcycle-minibike-small-motorcycle-scooter-motorcycle.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [searchInput, setSearchInput] = useState('');
//     const [suggestions, setSuggestions] = useState([]);
//     const [rideStarted, setRideStarted] = useState(false);
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//             setDistance(null);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//             setDistance((response.data.routes[0].distance / 1000).toFixed(2)); // Convert meters to KM
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     const handleSearchChange = async (e) => {
//         setSearchInput(e.target.value);
//         if (e.target.value.length > 2) {
//             try {
//                 const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`);
//                 setSuggestions(response.data);
//             } catch (error) {
//                 console.error("Error fetching suggestions:", error);
//             }
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const handleSuggestionClick = (lat, lon) => {
//         setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//         fetchRoute(startPoint || { lat: userLocation[0], lng: userLocation[1] }, { lat: parseFloat(lat), lng: parseFloat(lon) });
//         setSearchInput('');
//         setSuggestions([]);
//     };

//     const setLiveLocationAsStart = () => {
//         setStartPoint({ lat: userLocation[0], lng: userLocation[1] });
//     };

//     const startRide = () => {
//         setRideStarted(true);
//     };

//     const endRide = () => {
//         setRideStarted(false);
//         setStartPoint(null);
//         setEndPoint(null);
//         setRoute([]);
//         setDistance(null);
//     };

//     return (
//         <div style={{ padding: '10px', textAlign: 'center' }}>
//             <input 
//                 type="text" 
//                 value={searchInput} 
//                 onChange={handleSearchChange} 
//                 placeholder="Enter a location"
//                 style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
//             />
//             <ul style={{ listStyleType: 'none', padding: 0 }}>
//                 {suggestions.map((s, index) => (
//                     <li key={index} onClick={() => handleSuggestionClick(s.lat, s.lon)} style={{ cursor: 'pointer', padding: '5px', background: '#f0f0f0', margin: '2px 0' }}>
//                         {s.display_name}
//                     </li>
//                 ))}
//             </ul>
//             <button onClick={setLiveLocationAsStart} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>Set Live Location as Start</button>
//             <button onClick={startRide} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer', marginLeft: '10px' }}>Start Ride</button>
//             <button onClick={endRide} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer', marginLeft: '10px' }}>End Ride</button>
//             <button onClick={() => setUserLocation([...userLocation])} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer', marginLeft: '10px' }}>Recenter</button>
//             {distance && <p>Distance: {distance} km</p>}
//             <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;





// / main code that never change
















// code is really good

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://e7.pngegg.com/pngimages/17/10/png-clipart-mini-cooper-scooter-motorcycle-minibike-small-motorcycle-scooter-motorcycle.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }

//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleFromLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${fromInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setStartPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const handleToLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${toInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setEndPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         if (startPoint && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const coordinates = response.data.routes[0].geometry.coordinates;
//                 setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((response.data.routes[0].distance / 1000).toFixed(2)); // Convert meters to KM
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     const setLiveLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setStartPoint({ lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting live location:", error);
//             });
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 value={fromInput} 
//                 onChange={(e) => setFromInput(e.target.value)}
//                 placeholder="From Location"
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginRight: '10px' }}
//             />
//             <button onClick={handleFromLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
//             <input 
//                 type="text" 
//                 value={toInput} 
//                 onChange={(e) => setToInput(e.target.value)}
//                 placeholder="To Location"
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginLeft: '10px' }}
//             />
//             <button onClick={handleToLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
//             <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Show Route</button>
//             <button onClick={setLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Live Location</button>
//             <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
//                 {distance && <p>Distance: {distance} km</p>}
//             </div>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;




// working though


// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon with rotation
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Arrow_Up.svg/1024px-Red_Arrow_Up.svg.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [userHeading, setUserHeading] = useState(0);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude, heading } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 setUserHeading(heading || 0);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }

//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleFromLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${fromInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setStartPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const handleToLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${toInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setEndPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         if (startPoint && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const coordinates = response.data.routes[0].geometry.coordinates;
//                 setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((response.data.routes[0].distance / 1000).toFixed(2)); // Convert meters to KM
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     const setLiveLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setStartPoint({ lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting live location:", error);
//             });
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 value={fromInput} 
//                 onChange={(e) => setFromInput(e.target.value)}
//                 placeholder="From Location"
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginRight: '10px' }}
//             />
//             <button onClick={handleFromLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
//             <input 
//                 type="text" 
//                 value={toInput} 
//                 onChange={(e) => setToInput(e.target.value)}
//                 placeholder="To Location"
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginLeft: '10px' }}
//             />
//             <button onClick={handleToLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
//             <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Show Route</button>
//             <button onClick={setLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Live Location</button>
//             <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
//                 {distance && <p>Distance: {distance} km</p>}
//             </div>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon} rotationAngle={userHeading}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;




// working tooo


// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon with rotation
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Arrow_Up.svg/1024px-Red_Arrow_Up.svg.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [userHeading, setUserHeading] = useState(0);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude, heading } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 setUserHeading(heading || 0);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }

//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleFromLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${fromInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setStartPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const handleToLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${toInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setEndPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         if (endPoint) {
//             const start = useLiveLocation ? userLocation : startPoint;
//             if (start) {
//                 try {
//                     const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                     const routeData = response.data.routes[0];
//                     setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                     setDistance((routeData.distance / 1000).toFixed(2));
//                     setDuration((routeData.duration / 60).toFixed(2));
//                 } catch (error) {
//                     console.error("Error fetching route:", error);
//                 }
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 value={fromInput} 
//                 onChange={(e) => setFromInput(e.target.value)}
//                 placeholder="From Location"
//                 disabled={useLiveLocation}
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginRight: '10px' }}
//             />
//             <button onClick={handleFromLocation} disabled={useLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
//             <input 
//                 type="text" 
//                 value={toInput} 
//                 onChange={(e) => setToInput(e.target.value)}
//                 placeholder="To Location"
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginLeft: '10px' }}
//             />
//             <button onClick={handleToLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
//             <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Show Route</button>
//             <button onClick={() => setUseLiveLocation(!useLiveLocation)} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>{useLiveLocation ? "Disable Live Location" : "Live Location"}</button>
//             <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
//                 {distance && <p>Distance: {distance} km</p>}
//                 {duration && <p>Estimated Time: {duration} mins</p>}
//             </div>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon} rotationAngle={userHeading}><Popup>Your Live Location</Popup></Marker>                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//              </MapContainer>
//         </div>
//     );
// };

// export default Maps;







//  this is working tooo

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon with rotation
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://w7.pngwing.com/pngs/208/107/png-transparent-bicycle-cycling-equestrian-computer-icons-mountain-bike-bikes-sport-bicycle-frame-racing-thumbnail.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [userHeading, setUserHeading] = useState(0);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude, heading } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 setUserHeading(heading || 0);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }

//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleFromLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${fromInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setStartPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const handleToLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${toInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setEndPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         if (endPoint) {
//             const start = useLiveLocation ? userLocation : startPoint;
//             if (start) {
//                 try {
//                     const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                     const routeData = response.data.routes[0];
//                     setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                     setDistance((routeData.distance / 1000).toFixed(2));
//                     setDuration((routeData.duration / 60).toFixed(2));
//                 } catch (error) {
//                     console.error("Error fetching route:", error);
//                 }
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 value={fromInput} 
//                 onChange={(e) => setFromInput(e.target.value)}
//                 placeholder="From Location"
//                 disabled={useLiveLocation}
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginRight: '10px' }}
//             />
//             <button onClick={handleFromLocation} disabled={useLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
//             <input 
//                 type="text" 
//                 value={toInput} 
//                 onChange={(e) => setToInput(e.target.value)}
//                 placeholder="To Location"
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginLeft: '10px' }}
//             />
//             <button onClick={handleToLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
//             <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Show Route</button>
//             <button onClick={() => setUseLiveLocation(!useLiveLocation)} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>{useLiveLocation ? "Disable Live Location" : "Live Location"}</button>
//             <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
//                 {distance && <p>Distance: {distance} km</p>}
//                 {duration && <p>Estimated Time: {duration} mins</p>}
//             </div>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon} rotationAngle={userHeading}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//              </MapContainer>
//         </div>
//     );
// };

// export default Maps;




// working


// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon with rotation
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Arrow_Up.svg/1024px-Red_Arrow_Up.svg.png',
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [userHeading, setUserHeading] = useState(0);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude, heading } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 setUserHeading(heading || 0);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, []);

//     const handleLocationFetch = async (query, setFunction) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setFunction({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         if (endPoint) {
//             const start = useLiveLocation ? userLocation : startPoint;
//             if (start) {
//                 try {
//                     const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                     const routeData = response.data.routes[0];
//                     setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                     setDistance((routeData.distance / 1000).toFixed(2));
//                     const totalMinutes = routeData.duration / 60;
// const hours = Math.floor(totalMinutes / 60);
// const minutes = Math.floor(totalMinutes % 60);
// setDuration(`${hours}:${minutes.toString().padStart(2, '0')}`);
//                 } catch (error) {
//                     console.error("Error fetching route:", error);
//                 }
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
//                 <input type="text" value={fromInput} onChange={(e) => setFromInput(e.target.value)} placeholder="From Location" disabled={useLiveLocation} style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
//                 <button onClick={() => handleLocationFetch(fromInput, setStartPoint)} disabled={useLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
//                 <input type="text" value={toInput} onChange={(e) => setToInput(e.target.value)} placeholder="To Location" style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
//                 <button onClick={() => handleLocationFetch(toInput, setEndPoint)} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
//                 <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer' }}>Show Route</button>
//                 <button onClick={() => setUseLiveLocation(!useLiveLocation)} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer' }}>{useLiveLocation ? "Disable Live Location" : "Live Location"}</button>
//             </div>
//             <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
//                 {distance && <p><strong>Distance:</strong> {distance} km</p>}
//                 {duration && <p><strong>Estimated Time:</strong> {duration} mins</p>}
//             </div>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon} rotationAngle={userHeading}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;






// it is also working

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon with rotation
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Arrow_Up.svg/1024px-Red_Arrow_Up.svg.png',
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [userHeading, setUserHeading] = useState(0);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude, heading } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 setUserHeading(heading || 0);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, []);

//     const handleLocationFetch = async (query, setFunction) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setFunction({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         if (endPoint) {
//             const start = useLiveLocation ? userLocation : startPoint;
//             if (start) {
//                 try {
//                     const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                     const routeData = response.data.routes[0];
//                     setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                     setDistance((routeData.distance / 1000).toFixed(2));
//                     setDuration((routeData.duration / 60).toFixed(2));
//                 } catch (error) {
//                     console.error("Error fetching route:", error);
//                 }
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
//                 <input type="text" value={fromInput} onChange={(e) => setFromInput(e.target.value)} placeholder="From Location" disabled={useLiveLocation} style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
//                 <button onClick={() => handleLocationFetch(fromInput, setStartPoint)} disabled={useLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
//                 <input type="text" value={toInput} onChange={(e) => setToInput(e.target.value)} placeholder="To Location" style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
//                 <button onClick={() => handleLocationFetch(toInput, setEndPoint)} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
//                 <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer' }}>Show Route</button>
//                 <button onClick={() => setUseLiveLocation(!useLiveLocation)} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer' }}>{useLiveLocation ? "Disable Live Location" : "Live Location"}</button>
//             </div>
//             <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
//                 {distance && <p><strong>Distance:</strong> {distance} km</p>}
//                 {duration && <p><strong>Estimated Time:</strong> {duration} mins</p>}
//             </div>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon} rotationAngle={userHeading}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;


// speaking and wrtin






















































































// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://cdn-icons-png.flaticon.com/512/34/34639.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [searchInput, setSearchInput] = useState('');
//     const [suggestions, setSuggestions] = useState([]);
//     const [rideStarted, setRideStarted] = useState(false);
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     const startRide = () => {
//         setRideStarted(true);
//     };

//     return (
//         <div style={{ padding: '10px', textAlign: 'center' }}>
//             <button onClick={startRide} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer', background: 'green', color: 'white' }}>Start Ride</button>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;
















// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Arrow_Up.svg/1024px-Red_Arrow_Up.svg.png',
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40]
// });

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const speak = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synth.speak(utterance);
// };

// const Maps = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [userHeading, setUserHeading] = useState(0);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude, heading } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 setUserHeading(heading || 0);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });

//                 if (endPoint) {
//                     const distanceToEnd = L.latLng(latitude, longitude).distanceTo([endPoint.lat, endPoint.lng]) / 1000;
//                     if (distanceToEnd < 0.1) {
//                         speak("You have reached your destination.");
//                     }
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [endPoint]);

//     const handleLocationFetch = async (query, setFunction) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setFunction({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         if (endPoint) {
//             const start = useLiveLocation ? userLocation : startPoint;
//             if (!start || !start[0] || !start[1]) {
//                 console.error("Start location is not set properly.");
//                 alert("Please set a valid start location before fetching the route.");
//                 return;
//             }
    
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
    
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}:${minutes.toString().padStart(2, '0')}`);
    
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours}:${minutes.toString().padStart(2, '0')} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };
    

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
//                 <input type="text" value={fromInput} onChange={(e) => setFromInput(e.target.value)} placeholder="From Location" disabled={useLiveLocation} style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
//                 <button onClick={() => handleLocationFetch(fromInput, setStartPoint)} disabled={useLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
//                 <input type="text" value={toInput} onChange={(e) => setToInput(e.target.value)} placeholder="To Location" style={{ padding: '10px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
//                 <button onClick={() => handleLocationFetch(toInput, setEndPoint)} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
//                 <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer' }}>Show Route</button>
//                 <button onClick={() => setUseLiveLocation(!useLiveLocation)} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer' }}>{useLiveLocation ? "Disable Live Location" : "Live Location"}</button>
//             </div>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon}><Popup>Your Live Location</Popup></Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps;
