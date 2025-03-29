


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

// const Maps7 = () => {
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

// export default Maps7;



// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
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
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

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

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;     
//          if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 setDuration((routeData.duration / 60).toFixed(2));
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input type="text" placeholder="From" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
//             <button onClick={handleFromLocation}>Set From</button>
//             <br />
//             <input type="text" placeholder="To" value={toInput} onChange={(e) => setToInput(e.target.value)} />
//             <button onClick={handleToLocation}>Set To</button>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration} min</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;








// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const fetchSuggestions = async (query, setSuggestions) => {
//         if (query.length > 2) {
//             try {
//                 const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//                 setSuggestions(response.data);
//             } catch (error) {
//                 console.error("Error fetching suggestions:", error);
//             }
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 setDuration((routeData.duration / 60).toFixed(2));
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input type="text" placeholder="From" value={fromInput} onChange={(e) => {
//                 setFromInput(e.target.value);
//                 fetchSuggestions(e.target.value, setFromSuggestions);
//             }} />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => {
//                         setFromInput(suggestion.display_name);
//                         setStartPoint({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
//                         setFromSuggestions([]);
//                     }}>{suggestion.display_name}</li>
//                 ))}
//             </ul>
//             <br />
//             <input type="text" placeholder="To" value={toInput} onChange={(e) => {
//                 setToInput(e.target.value);
//                 fetchSuggestions(e.target.value, setToSuggestions);
//             }} />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => {
//                         setToInput(suggestion.display_name);
//                         setEndPoint({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
//                         setToSuggestions([]);
//                     }}>{suggestion.display_name}</li>
//                 ))}
//             </ul>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration} min</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;












// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [searchInput, setSearchInput] = useState('');
//     const [suggestions, setSuggestions] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const fetchLocation = async (query, setPoint, setInput) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//                 setInput(location.display_name);
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input type="text" placeholder="From" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
//             <button onClick={() => fetchLocation(fromInput, setStartPoint, setFromInput)}>Set From</button>
//             <br />
//             <input type="text" placeholder="To" value={toInput} onChange={(e) => setToInput(e.target.value)} />
//             <button onClick={() => fetchLocation(toInput, setEndPoint, setToInput)}>Set To</button>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <input type="text" placeholder="Search Location" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
//             <ul>
//                 {suggestions.map((suggestion, index) => (
//                     <li key={index}>{suggestion.display_name}</li>
//                 ))}
//             </ul>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;








// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
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
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const fetchLocation = async (query, setPoint, setInput) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//                 setInput(location.display_name);
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input type="text" placeholder="From" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
//             <button onClick={() => fetchLocation(fromInput, setStartPoint, setFromInput)}>Set From</button>
//             <br />
//             <input type="text" placeholder="To" value={toInput} onChange={(e) => setToInput(e.target.value)} />
//             <button onClick={() => fetchLocation(toInput, setEndPoint, setToInput)}>Set To</button>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;







// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const fetchLocation = async (query, setPoint, setInput, setSuggestions) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             setSuggestions(response.data);
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const selectLocation = (location, setPoint, setInput, setSuggestions) => {
//         setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//         setInput(location.display_name);
//         setSuggestions([]);
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             {/* <input type="text" placeholder="From" value={fromInput} onChange={(e) =>setFromInput(e.target.value); 
//                 fetchLocation(e.target.value, setStartPoint, setFromInput, setFromSuggestions)
//                 } /> */}
//                 <input
//     type="text"
//     placeholder="From"
//     value={fromInput}
//     onChange={(e) => {
//         setFromInput(e.target.value);
//         fetchLocation(e.target.value, setStartPoint, setFromInput, setFromSuggestions);
//     }}
// />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setStartPoint, setFromInput, setFromSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>
//             <br />
//             {/* <input type="text" placeholder="To" value={toInput} onChange={(e) => fetchLocation(e.target.value, setEndPoint, setToInput, setToSuggestions)} /> */}
//             <input
//     type="text"
//     placeholder="To"
//     value={toInput}
//     onChange={(e) => {
//         setToInput(e.target.value);
//         fetchLocation(e.target.value, setEndPoint, setToInput, setToSuggestions);
//     }}
// />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setEndPoint, setToInput, setToSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;


// it is beeter code



// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);

//     // 🚀 New States for Ride Tracking
//     const [isRiding, setIsRiding] = useState(false);
//     const [ridePath, setRidePath] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             const watchId = navigator.geolocation.watchPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setUserLocation([latitude, longitude]);
//                     socket.emit('updateLocation', { lat: latitude, lng: longitude });

//                     if (useLiveLocation) {

//                         setStartPoint({ lat: latitude, lng: longitude });
//                         speak(`You are at ${{lat: latitude, lng: longitude}}`);
//                     }

//                     if (isRiding) {
//                         setRidePath(prevPath => [...prevPath, [latitude, longitude]]);
//                     }
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                 }
//             );

//             return () => navigator.geolocation.clearWatch(watchId);
//         }
//     }, [useLiveLocation, isRiding]);

//     const fetchLocation = async (query, setPoint, setInput, setSuggestions) => {
//         try {
//             setInput(query);  // Ensure input updates immediately
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             setSuggestions(response.data);
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const selectLocation = (location, setPoint, setInput, setSuggestions) => {
//         setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//         setInput(location.display_name);
//         setSuggestions([]);
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 placeholder="From" 
//                 value={fromInput} 
//                 onChange={(e) => fetchLocation(e.target.value, setStartPoint, setFromInput, setFromSuggestions)} 
//             />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setStartPoint, setFromInput, setFromSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />

//             <input 
//                 type="text" 
//                 placeholder="To" 
//                 value={toInput} 
//                 onChange={(e) => fetchLocation(e.target.value, setEndPoint, setToInput, setToSuggestions)} 
//             />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setEndPoint, setToInput, setToSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />

//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>

//             <br />
//             <button onClick={fetchRoute}>Get Route</button>

//             <br />

//             <button onClick={() => setIsRiding(true)} disabled={isRiding}>Start Ride</button>
//             <button onClick={() => setIsRiding(false)} disabled={!isRiding}>End Ride</button>

//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>

//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 {isRiding && ridePath.length > 1 && <Polyline positions={ridePath} color="yellow" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;







// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);
//     const [isRiding, setIsRiding] = useState(false);
//     const [ridePath, setRidePath] = useState([]);
//     const [currentLocationText, setCurrentLocationText] = useState(''); // 📍 New state for location text

//     useEffect(() => {
//         if (navigator.geolocation) {
//             const watchId = navigator.geolocation.watchPosition(
//                 async (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setUserLocation([latitude, longitude]);
//                     socket.emit('updateLocation', { lat: latitude, lng: longitude });

//                     if (useLiveLocation) {
//                         setStartPoint({ lat: latitude, lng: longitude });
//                     }

//                     if (isRiding) {
//                         setRidePath(prevPath => [...prevPath, [latitude, longitude]]);
//                     }
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                 }
//             );

//             return () => navigator.geolocation.clearWatch(watchId);
//         }
//     }, [useLiveLocation, isRiding]);

//     const fetchLocation = async (query, setPoint, setInput, setSuggestions) => {
//         try {
//             setInput(query);
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             setSuggestions(response.data);
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const selectLocation = (location, setPoint, setInput, setSuggestions) => {
//         setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//         setInput(location.display_name);
//         setSuggestions([]);
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     const endRide = async () => {
//         setIsRiding(false);
//         setRidePath([]); // Reset the ride path

//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation[0]}&lon=${userLocation[1]}`);
//             const locationName = response.data.display_name;
//             setCurrentLocationText(`You are at ${locationName}`);
//             speak(`You are at ${locationName}`);
//         } catch (error) {
//             console.error("Error fetching location name:", error);
//             setCurrentLocationText("Location not found");
//             speak("Location not found");
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 placeholder="From" 
//                 value={fromInput} 
//                 onChange={(e) => fetchLocation(e.target.value, setStartPoint, setFromInput, setFromSuggestions)} 
//             />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setStartPoint, setFromInput, setFromSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />

//             <input 
//                 type="text" 
//                 placeholder="To" 
//                 value={toInput} 
//                 onChange={(e) => fetchLocation(e.target.value, setEndPoint, setToInput, setToSuggestions)} 
//             />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setEndPoint, setToInput, setToSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />

//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>

//             <br />
//             <button onClick={fetchRoute}>Get Route</button>

//             <br />

//             <button onClick={() => setIsRiding(true)} disabled={isRiding}>Start Ride</button>
//             <button onClick={endRide} disabled={!isRiding}>End Ride</button>

//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <p><b>{currentLocationText}</b></p> {/* 📍 Show current location when ride ends */}

//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 {isRiding && ridePath.length > 1 && <Polyline positions={ridePath} color="red" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;











// "use client"

// import { useEffect, useState } from "react"
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet"
// import "leaflet/dist/leaflet.css"
// import io from "socket.io-client"
// import L from "leaflet"
// import axios from "axios"

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// })

// // Custom icons for different place types
// const createIcon = (color) =>
//   new L.Icon({
//     iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
//     shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   })

// const icons = {
//   start: createIcon("green"),
//   end: createIcon("red"),
//   restaurant: createIcon("blue"),
//   cafe: createIcon("orange"),
//   bar: createIcon("violet"),
//   gym: createIcon("gold"),
//   hospital: createIcon("grey"),
//   pharmacy: createIcon("yellow"),
//   school: createIcon("black"),
//   default: createIcon("blue"),
// }

// // Place type definitions with icons and display names
// const placeTypes = [
//   { value: "restaurant", label: "Restaurants", icon: icons.restaurant },
//   { value: "cafe", label: "Cafes", icon: icons.cafe },
//   { value: "bar", label: "Bars", icon: icons.bar },
//   { value: "gym", label: "Gyms", icon: icons.gym },
//   { value: "hospital", label: "Hospitals", icon: icons.hospital },
//   { value: "pharmacy", label: "Pharmacies", icon: icons.pharmacy },
//   { value: "school", label: "Schools", icon: icons.school },
// ]

// // Initialize socket connection with error handling
// let socket
// try {
//   socket = io("https://mapsssss.vercel.app/", {
//     transports: ["websocket"],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000,
//   })
// } catch (error) {
//   console.error("Socket connection error:", error)
//   // Create a mock socket if connection fails
//   socket = {
//     emit: () => {},
//     on: () => {},
//     off: () => {},
//   }
// }

// // Component to recenter map when location changes
// const RecenterMap = ({ center }) => {
//   const map = useMap()
//   useEffect(() => {
//     if (center) {
//       map.setView(center, map.getZoom())
//     }
//   }, [center, map])
//   return null
// }

// // Component to handle map clicks
// const MapClickHandler = ({ onMapClick }) => {
//   useMapEvents({
//     click: (e) => {
//       onMapClick(e)
//     },
//   })
//   return null
// }

// // Text-to-speech function
// const speak = (text) => {
//   if ("speechSynthesis" in window) {
//     const synth = window.speechSynthesis
//     const utterance = new SpeechSynthesisUtterance(text)
//     synth.speak(utterance)
//   } else {
//     console.log("Text-to-speech not supported in this browser")
//   }
// }

// // Loading spinner component
// const LoadingSpinner = () => (
//   <div
//     style={{
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       zIndex: 1000,
//       background: "rgba(255, 255, 255, 0.8)",
//       padding: "20px",
//       borderRadius: "10px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     <div
//       style={{
//         border: "4px solid #f3f3f3",
//         borderTop: "4px solid #3498db",
//         borderRadius: "50%",
//         width: "40px",
//         height: "40px",
//         animation: "spin 2s linear infinite",
//         marginBottom: "10px",
//       }}
//     ></div>
//     <p style={{ margin: 0, fontWeight: "bold" }}>Loading map data...</p>
//     <style>{`
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `}</style>
//   </div>
// )

// const Maps7 = () => {
//   // Default to London coordinates
//   const [userLocation, setUserLocation] = useState([51.505, -0.09])
//   const [startPoint, setStartPoint] = useState(null)
//   const [endPoint, setEndPoint] = useState(null)
//   const [route, setRoute] = useState([])
//   const [distance, setDistance] = useState(null)
//   const [duration, setDuration] = useState(null)
//   const [places, setPlaces] = useState([])
//   const [searchQuery, setSearchQuery] = useState("restaurant")
//   const [isNavigating, setIsNavigating] = useState(false)
//   const [geolocationAvailable, setGeolocationAvailable] = useState(true)
//   const [manualLocationMode, setManualLocationMode] = useState(false)
//   const [tempLocation, setTempLocation] = useState({ lat: 51.505, lng: -0.09 })
//   const [locationError, setLocationError] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [mapReady, setMapReady] = useState(false)
//   const [searchRadius, setSearchRadius] = useState(1000) // in meters
//   const [selectedPlace, setSelectedPlace] = useState(null)
//   const [darkMode, setDarkMode] = useState(false)
//   const [showAllPlaces, setShowAllPlaces] = useState(false)
//   const [allPlaces, setAllPlaces] = useState([])

//   // Try to get user location, but handle errors gracefully
//   useEffect(() => {
//     setIsLoading(true)

//     // Check if geolocation is available
//     if (!navigator.geolocation) {
//       setGeolocationAvailable(false)
//       setLocationError("Geolocation is not supported by your browser")
//       setIsLoading(false)
//       return
//     }

//     // Try to get user location once
//     const getInitialLocation = () => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords
//           setUserLocation([latitude, longitude])
//           setTempLocation({ lat: latitude, lng: longitude })
//           socket.emit("updateLocation", { lat: latitude, lng: longitude })
//           setIsLoading(false)
//         },
//         (error) => {
//           console.error("Error getting location:", error)
//           setGeolocationAvailable(false)

//           switch (error.code) {
//             case error.PERMISSION_DENIED:
//               setLocationError("Location access was denied. You can set your location manually.")
//               break
//             case error.POSITION_UNAVAILABLE:
//               setLocationError("Location information is unavailable. You can set your location manually.")
//               break
//             case error.TIMEOUT:
//               setLocationError("Location request timed out. You can set your location manually.")
//               break
//             default:
//               setLocationError("An unknown error occurred. You can set your location manually.")
//           }

//           setManualLocationMode(true)
//           setIsLoading(false)
//         },
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
//       )
//     }

//     getInitialLocation()

//     // Only set up watchPosition if geolocation is available and working
//     let watchId
//     if (geolocationAvailable) {
//       try {
//         watchId = navigator.geolocation.watchPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords
//             setUserLocation([latitude, longitude])
//             setTempLocation({ lat: latitude, lng: longitude })
//             socket.emit("updateLocation", { lat: latitude, lng: longitude })

//             // If navigating, update route information
//             if (isNavigating && endPoint) {
//               calculateRoute([latitude, longitude], [endPoint.lat, endPoint.lng])
//             }
//           },
//           (error) => {
//             console.error("Watch position error:", error)
//             // Don't set manual mode here as we already tried once
//           },
//           { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
//         )
//       } catch (e) {
//         console.error("Error setting up watch position:", e)
//         setGeolocationAvailable(false)
//       }
//     }

//     // Clean up
//     return () => {
//       if (watchId) {
//         navigator.geolocation.clearWatch(watchId)
//       }
//     }
//   }, [isNavigating, endPoint, geolocationAvailable])

//   // Socket event listeners
//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Connected to server")
//     })

//     socket.on("disconnect", () => {
//       console.log("Disconnected from server")
//     })

//     socket.on("error", (error) => {
//       console.error("Socket error:", error)
//     })

//     return () => {
//       socket.off("connect")
//       socket.off("disconnect")
//       socket.off("error")
//     }
//   }, [])

//   // Fetch nearby places using Overpass API
//   useEffect(() => {
//     const fetchNearbyPlaces = async () => {
//       if (!userLocation[0] || !userLocation[1] || !mapReady) return

//       setIsLoading(true)

//       try {
//         // Calculate bounding box based on radius (approximate conversion from meters to degrees)
//         const radiusDegrees = searchRadius / 111000 // roughly 111km per degree

//         // Using Overpass API
//         const query = `
//           [out:json];
//           node
//             ["amenity"="${searchQuery}"]
//             (${userLocation[0] - radiusDegrees},${userLocation[1] - radiusDegrees},${userLocation[0] + radiusDegrees},${userLocation[1] + radiusDegrees});
//           out;
//         `

//         const response = await axios.get("https://overpass-api.de/api/interpreter", {
//           params: { data: query },
//         })

//         if (response.data && response.data.elements) {
//           const parsedPlaces = response.data.elements.map((el) => ({
//             lat: el.lat,
//             lng: el.lon,
//             name: el.tags && el.tags.name ? el.tags.name : `Unnamed ${searchQuery}`,
//             type: searchQuery,
//             amenity: el.tags || {},
//           }))

//           setPlaces(parsedPlaces)

//           // Add to all places if showing all
//           if (showAllPlaces) {
//             setAllPlaces((prev) => {
//               // Filter out places of the same type to avoid duplicates
//               const filtered = prev.filter((p) => p.type !== searchQuery)
//               return [...filtered, ...parsedPlaces]
//             })
//           }
//         }
//       } catch (error) {
//         console.error(`Error fetching nearby ${searchQuery}s:`, error)
//         // Fallback to empty array if API fails
//         setPlaces([])
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (userLocation[0] && userLocation[1] && mapReady) {
//       fetchNearbyPlaces()
//     }
//   }, [userLocation, searchQuery, mapReady, searchRadius, showAllPlaces])

//   // Calculate route between two points using OSRM
//   const calculateRoute = async (start, end) => {
//     setIsLoading(true)
//     try {
//       const response = await axios.get(
//         `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
//       )

//       if (response.data.routes && response.data.routes.length > 0) {
//         const routeData = response.data.routes[0]
//         const routeCoordinates = routeData.geometry.coordinates.map((coord) => [coord[1], coord[0]])

//         setRoute(routeCoordinates)

//         // Calculate distance in kilometers
//         const distanceInMeters = routeData.distance
//         setDistance((distanceInMeters / 1000).toFixed(2))

//         // Calculate duration in minutes
//         const durationInSeconds = routeData.duration
//         setDuration(Math.round(durationInSeconds / 60))
//       }
//     } catch (error) {
//       console.error("Error calculating route:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Handle map click to set start/end points
//   const handleMapClick = (e) => {
//     const { lat, lng } = e.latlng

//     // If in manual location mode, set user location
//     if (manualLocationMode) {
//       setUserLocation([lat, lng])
//       setTempLocation({ lat, lng })
//       setManualLocationMode(false)
//       speak("Location set")
//       return
//     }

//     if (!startPoint) {
//       setStartPoint({ lat, lng })
//       speak("Start point set")
//     } else if (!endPoint) {
//       setEndPoint({ lat, lng })
//       speak("End point set")
//       calculateRoute([startPoint.lat, startPoint.lng], [lat, lng])
//     }
//   }

//   // Start navigation
//   const handleStartNavigation = () => {
//     if (startPoint && endPoint) {
//       setIsNavigating(true)
//       calculateRoute([userLocation[0], userLocation[1]], [endPoint.lat, endPoint.lng])
//       speak("Starting navigation")
//     } else {
//       speak("Please set start and end points first")
//     }
//   }

//   // End navigation
//   const handleEndNavigation = () => {
//     setIsNavigating(false)
//     setRoute([])
//     setStartPoint(null)
//     setEndPoint(null)
//     setDistance(null)
//     setDuration(null)
//     speak("Navigation ended")
//   }

//   // Handle place selection
//   const handlePlaceSelect = (place) => {
//     setSelectedPlace(place)
//     if (!startPoint) {
//       setStartPoint({ lat: userLocation[0], lng: userLocation[1] })
//       setEndPoint({ lat: place.lat, lng: place.lng })
//       calculateRoute([userLocation[0], userLocation[1]], [place.lat, place.lng])
//       speak(`Navigating to ${place.name}`)
//     }
//   }

//   // Handle manual location input
//   const handleManualLocationSubmit = (e) => {
//     e.preventDefault()
//     setUserLocation([tempLocation.lat, tempLocation.lng])
//     setManualLocationMode(false)
//     speak("Location set manually")
//   }

//   // Enable manual location mode
//   const enableManualLocationMode = () => {
//     setManualLocationMode(true)
//     speak("Click on the map to set your location")
//   }

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//     document.body.classList.toggle("dark")
//   }

//   // Toggle showing all places
//   const toggleShowAllPlaces = () => {
//     setShowAllPlaces(!showAllPlaces)
//     if (!showAllPlaces) {
//       // If turning on, add current places to all places
//       setAllPlaces(places)
//     }
//   }

//   // Get icon for place type
//   const getPlaceIcon = (type) => {
//     const placeType = placeTypes.find((pt) => pt.value === type)
//     return placeType ? placeType.icon : icons.default
//   }

//   // Styles with dark mode support
//   const styles = {
//     container: {
//       padding: "20px",
//       textAlign: "center",
//       background: darkMode ? "#1a1a1a" : "#f8f9fa",
//       color: darkMode ? "#f8f9fa" : "#333",
//       borderRadius: "10px",
//       fontFamily: "'Segoe UI', Arial, sans-serif",
//       maxWidth: "1200px",
//       margin: "0 auto",
//       boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.1)",
//       transition: "all 0.3s ease",
//       position: "relative",
//     },
//     header: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "20px",
//       borderBottom: darkMode ? "1px solid #444" : "1px solid #ddd",
//       paddingBottom: "10px",
//     },
//     title: {
//       fontSize: "28px",
//       fontWeight: "bold",
//       margin: "0",
//       color: darkMode ? "#3498db" : "#2980b9",
//     },
//     controls: {
//       display: "flex",
//       gap: "10px",
//     },
//     searchContainer: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "10px",
//       marginBottom: "20px",
//     },
//     searchRow: {
//       display: "flex",
//       flexWrap: "wrap",
//       gap: "10px",
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     input: {
//       padding: "12px",
//       borderRadius: "8px",
//       border: darkMode ? "1px solid #444" : "1px solid #ccc",
//       background: darkMode ? "#333" : "white",
//       color: darkMode ? "white" : "black",
//       flex: "1",
//       minWidth: "200px",
//       maxWidth: "400px",
//       fontSize: "16px",
//     },
//     select: {
//       padding: "12px",
//       borderRadius: "8px",
//       border: darkMode ? "1px solid #444" : "1px solid #ccc",
//       background: darkMode ? "#333" : "white",
//       color: darkMode ? "white" : "black",
//       cursor: "pointer",
//       minWidth: "150px",
//     },
//     rangeContainer: {
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//       padding: "5px 10px",
//       background: darkMode ? "#333" : "#f0f0f0",
//       borderRadius: "8px",
//       minWidth: "200px",
//     },
//     rangeLabel: {
//       fontSize: "14px",
//       whiteSpace: "nowrap",
//     },
//     range: {
//       flex: "1",
//     },
//     button: {
//       padding: "12px 20px",
//       color: "white",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontWeight: "bold",
//       transition: "all 0.2s ease",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "5px",
//       minWidth: "120px",
//     },
//     startButton: {
//       background: "#27ae60",
//       boxShadow: "0 4px 6px rgba(39, 174, 96, 0.2)",
//       "&:hover": {
//         background: "#2ecc71",
//         transform: "translateY(-2px)",
//       },
//     },
//     endButton: {
//       background: "#e74c3c",
//       boxShadow: "0 4px 6px rgba(231, 76, 60, 0.2)",
//       "&:hover": {
//         background: "#c0392b",
//         transform: "translateY(-2px)",
//       },
//     },
//     locationButton: {
//       background: "#3498db",
//       boxShadow: "0 4px 6px rgba(52, 152, 219, 0.2)",
//       "&:hover": {
//         background: "#2980b9",
//         transform: "translateY(-2px)",
//       },
//     },
//     toggleButton: {
//       background: darkMode ? "#f39c12" : "#9b59b6",
//       boxShadow: darkMode ? "0 4px 6px rgba(243, 156, 18, 0.2)" : "0 4px 6px rgba(155, 89, 182, 0.2)",
//       "&:hover": {
//         background: darkMode ? "#e67e22" : "#8e44ad",
//         transform: "translateY(-2px)",
//       },
//     },
//     infoText: {
//       margin: "5px 0",
//       fontSize: "16px",
//       fontWeight: "500",
//     },
//     errorText: {
//       color: "#e74c3c",
//       margin: "10px 0",
//       padding: "15px",
//       background: darkMode ? "rgba(231, 76, 60, 0.2)" : "#fadbd8",
//       borderRadius: "8px",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       gap: "10px",
//     },
//     mapContainer: {
//       height: "600px",
//       width: "100%",
//       borderRadius: "12px",
//       boxShadow: darkMode ? "0 8px 30px rgba(0,0,0,0.3)" : "0 8px 30px rgba(0,0,0,0.1)",
//       overflow: "hidden",
//       position: "relative",
//     },
//     contentGrid: {
//       display: "grid",
//       gridTemplateColumns: "1fr 3fr",
//       gap: "20px",
//       marginBottom: "20px",
//     },
//     sidebar: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "20px",
//     },
//     placesList: {
//       maxHeight: "400px",
//       overflowY: "auto",
//       padding: "15px",
//       background: darkMode ? "#333" : "white",
//       borderRadius: "8px",
//       textAlign: "left",
//       boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
//     },
//     placeItem: {
//       padding: "12px",
//       margin: "8px 0",
//       background: darkMode ? "#444" : "#f0f0f0",
//       borderRadius: "6px",
//       cursor: "pointer",
//       transition: "all 0.2s ease",
//       borderLeft: "4px solid #3498db",
//       "&:hover": {
//         transform: "translateX(5px)",
//         background: darkMode ? "#555" : "#e6e6e6",
//       },
//     },
//     selectedPlace: {
//       borderLeft: "4px solid #e74c3c",
//       background: darkMode ? "#555" : "#e6e6e6",
//     },
//     placeHeader: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "5px",
//     },
//     placeName: {
//       fontWeight: "bold",
//       fontSize: "16px",
//       margin: "0",
//     },
//     placeType: {
//       fontSize: "12px",
//       padding: "3px 8px",
//       borderRadius: "12px",
//       background: "#3498db",
//       color: "white",
//     },
//     manualLocationForm: {
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       margin: "15px 0",
//       padding: "20px",
//       background: darkMode ? "#333" : "#e8f4f8",
//       borderRadius: "12px",
//       boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
//     },
//     coordInput: {
//       padding: "10px",
//       margin: "5px",
//       width: "150px",
//       borderRadius: "6px",
//       border: darkMode ? "1px solid #444" : "1px solid #ccc",
//       background: darkMode ? "#444" : "white",
//       color: darkMode ? "white" : "black",
//     },
//     submitButton: {
//       padding: "10px 20px",
//       margin: "15px",
//       background: "#2980b9",
//       color: "white",
//       border: "none",
//       borderRadius: "6px",
//       cursor: "pointer",
//       fontWeight: "bold",
//       transition: "all 0.2s ease",
//       "&:hover": {
//         background: "#3498db",
//         transform: "translateY(-2px)",
//       },
//     },
//     routeInfo: {
//       display: "flex",
//       justifyContent: "space-around",
//       padding: "15px",
//       background: darkMode ? "#333" : "white",
//       borderRadius: "8px",
//       marginBottom: "20px",
//       boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
//     },
//     routeInfoItem: {
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//     },
//     routeInfoValue: {
//       fontSize: "24px",
//       fontWeight: "bold",
//       color: "#3498db",
//     },
//     routeInfoLabel: {
//       fontSize: "14px",
//       color: darkMode ? "#ccc" : "#666",
//     },
//     instructions: {
//       marginTop: "20px",
//       padding: "20px",
//       background: darkMode ? "#333" : "white",
//       borderRadius: "8px",
//       boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
//     },
//     instructionsTitle: {
//       fontSize: "20px",
//       fontWeight: "bold",
//       marginBottom: "10px",
//       color: darkMode ? "#3498db" : "#2980b9",
//     },
//     instructionsList: {
//       textAlign: "left",
//       paddingLeft: "20px",
//     },
//     instructionItem: {
//       margin: "10px 0",
//       lineHeight: "1.5",
//     },
//     footer: {
//       marginTop: "30px",
//       padding: "15px",
//       borderTop: darkMode ? "1px solid #444" : "1px solid #ddd",
//       fontSize: "14px",
//       color: darkMode ? "#ccc" : "#666",
//     },
//     placeTypeChips: {
//       display: "flex",
//       flexWrap: "wrap",
//       gap: "8px",
//       marginBottom: "15px",
//       justifyContent: "center",
//     },
//     placeTypeChip: {
//       padding: "8px 15px",
//       borderRadius: "20px",
//       cursor: "pointer",
//       fontSize: "14px",
//       fontWeight: "500",
//       transition: "all 0.2s ease",
//       border: "1px solid #3498db",
//     },
//     activeChip: {
//       background: "#3498db",
//       color: "white",
//     },
//     inactiveChip: {
//       background: darkMode ? "#333" : "white",
//       color: darkMode ? "#ccc" : "#3498db",
//     },
//     placeDetails: {
//       padding: "15px",
//       background: darkMode ? "#333" : "white",
//       borderRadius: "8px",
//       marginBottom: "20px",
//       boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
//     },
//     placeDetailsTitle: {
//       fontSize: "18px",
//       fontWeight: "bold",
//       marginBottom: "10px",
//       color: darkMode ? "#3498db" : "#2980b9",
//     },
//     placeDetailsInfo: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "5px",
//     },
//     placeDetailsItem: {
//       display: "flex",
//       justifyContent: "space-between",
//     },
//     placeDetailsLabel: {
//       fontWeight: "bold",
//       color: darkMode ? "#ccc" : "#666",
//     },
//     placeDetailsValue: {
//       color: darkMode ? "white" : "black",
//     },
//     placeDetailsActions: {
//       display: "flex",
//       justifyContent: "center",
//       marginTop: "15px",
//       gap: "10px",
//     },
//     responsiveGrid: {
//       display: "grid",
//       gridTemplateColumns: "1fr",
//       gap: "20px",
//       "@media (min-width: 768px)": {
//         gridTemplateColumns: "1fr 3fr",
//       },
//     },
//   }

//   // Apply hover effects with inline styles
//   const getPlaceItemStyle = (place) => {
//     const baseStyle = {
//       padding: "12px",
//       margin: "8px 0",
//       background: darkMode ? "#444" : "#f0f0f0",
//       borderRadius: "6px",
//       cursor: "pointer",
//       transition: "all 0.2s ease",
//       borderLeft: "4px solid #3498db",
//     }

//     // If this is the selected place
//     if (selectedPlace && selectedPlace.lat === place.lat && selectedPlace.lng === place.lng) {
//       return {
//         ...baseStyle,
//         borderLeft: "4px solid #e74c3c",
//         background: darkMode ? "#555" : "#e6e6e6",
//       }
//     }

//     return baseStyle
//   }

//   // Apply hover effects
//   const getButtonStyle = (baseStyle) => {
//     return {
//       ...baseStyle,
//       "&:hover": {
//         transform: "translateY(-2px)",
//         filter: "brightness(1.1)",
//       },
//     }
//   }

//   return (
//     <div style={{ ...styles.container }} className={darkMode ? "dark" : ""}>
//       {/* Header */}
//       <div style={styles.header}>
//         <h2 style={styles.title}>Interactive Map Explorer</h2>
//         <div style={styles.controls}>
//           <button onClick={toggleDarkMode} style={{ ...styles.button, background: darkMode ? "#f39c12" : "#9b59b6" }}>
//             {darkMode ? "Light Mode" : "Dark Mode"}
//           </button>
//           <button
//             onClick={toggleShowAllPlaces}
//             style={{ ...styles.button, background: showAllPlaces ? "#27ae60" : "#3498db" }}
//           >
//             {showAllPlaces ? "Filter Places" : "Show All Places"}
//           </button>
//         </div>
//       </div>

//       {/* Location error message */}
//       {locationError && (
//         <div style={styles.errorText}>
//           {locationError}
//           <button onClick={enableManualLocationMode} style={{ ...styles.button, ...styles.locationButton }}>
//             Set Location Manually
//           </button>
//         </div>
//       )}

//       {/* Manual location mode instructions */}
//       {manualLocationMode && (
//         <div style={styles.manualLocationForm}>
//           <h3>Set Your Location</h3>
//           <p>Click on the map to set your location or enter coordinates below:</p>
//           <form onSubmit={handleManualLocationSubmit}>
//             <div>
//               <label>Latitude: </label>
//               <input
//                 type="number"
//                 step="0.000001"
//                 value={tempLocation.lat}
//                 onChange={(e) => setTempLocation({ ...tempLocation, lat: Number.parseFloat(e.target.value) })}
//                 style={styles.coordInput}
//               />
//             </div>
//             <div>
//               <label>Longitude: </label>
//               <input
//                 type="number"
//                 step="0.000001"
//                 value={tempLocation.lng}
//                 onChange={(e) => setTempLocation({ ...tempLocation, lng: Number.parseFloat(e.target.value) })}
//                 style={styles.coordInput}
//               />
//             </div>
//             <button type="submit" style={styles.submitButton}>
//               Set Location
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Search controls */}
//       <div style={styles.searchContainer}>
//         <div style={styles.placeTypeChips}>
//           {placeTypes.map((type) => (
//             <div
//               key={type.value}
//               onClick={() => setSearchQuery(type.value)}
//               style={{
//                 ...styles.placeTypeChip,
//                 ...(searchQuery === type.value ? styles.activeChip : styles.inactiveChip),
//               }}
//             >
//               {type.label}
//             </div>
//           ))}
//         </div>

//         <div style={styles.searchRow}>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search places (e.g. restaurant, cafe, hospital)"
//             style={styles.input}
//           />

//           <div style={styles.rangeContainer}>
//             <span style={styles.rangeLabel}>Radius: {searchRadius}m</span>
//             <input
//               type="range"
//               min="100"
//               max="5000"
//               step="100"
//               value={searchRadius}
//               onChange={(e) => setSearchRadius(Number.parseInt(e.target.value))}
//               style={styles.range}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Route information */}
//       {(distance || duration) && (
//         <div style={styles.routeInfo}>
//           {distance && (
//             <div style={styles.routeInfoItem}>
//               <span style={styles.routeInfoValue}>{distance} km</span>
//               <span style={styles.routeInfoLabel}>Distance</span>
//             </div>
//           )}
//           {duration && (
//             <div style={styles.routeInfoItem}>
//               <span style={styles.routeInfoValue}>{duration} min</span>
//               <span style={styles.routeInfoLabel}>Duration</span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Navigation buttons */}
//       <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
//         <button
//           onClick={handleStartNavigation}
//           style={{ ...styles.button, background: "#27ae60" }}
//           disabled={!startPoint || !endPoint || manualLocationMode}
//         >
//           Start Navigation
//         </button>
//         <button
//           onClick={handleEndNavigation}
//           style={{ ...styles.button, background: "#e74c3c" }}
//           disabled={manualLocationMode}
//         >
//           End Navigation
//         </button>
//         {!manualLocationMode && !geolocationAvailable && (
//           <button onClick={enableManualLocationMode} style={{ ...styles.button, background: "#3498db" }}>
//             Set Location
//           </button>
//         )}
//       </div>

//       {/* Main content grid */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr",
//           gap: "20px",
//           "@media (min-width: 768px)": {
//             gridTemplateColumns: "1fr 3fr",
//           },
//         }}
//       >
//         {/* Sidebar */}
//         <div style={styles.sidebar}>
//           {/* Selected place details */}
//           {selectedPlace && (
//             <div style={styles.placeDetails}>
//               <h3 style={styles.placeDetailsTitle}>{selectedPlace.name}</h3>
//               <div style={styles.placeDetailsInfo}>
//                 <div style={styles.placeDetailsItem}>
//                   <span style={styles.placeDetailsLabel}>Type:</span>
//                   <span style={styles.placeDetailsValue}>{selectedPlace.type}</span>
//                 </div>
//                 {selectedPlace.amenity &&
//                   Object.entries(selectedPlace.amenity).map(
//                     ([key, value]) =>
//                       key !== "name" && (
//                         <div key={key} style={styles.placeDetailsItem}>
//                           <span style={styles.placeDetailsLabel}>{key}:</span>
//                           <span style={styles.placeDetailsValue}>{value}</span>
//                         </div>
//                       ),
//                   )}
//               </div>
//               <div style={styles.placeDetailsActions}>
//                 <button
//                   onClick={() => handlePlaceSelect(selectedPlace)}
//                   style={{ ...styles.button, background: "#3498db" }}
//                 >
//                   Navigate Here
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Places list */}
//           <div style={styles.placesList}>
//             <h3>Nearby {showAllPlaces ? "Places" : searchQuery + "s"}:</h3>
//             {(showAllPlaces ? allPlaces : places).length > 0 ? (
//               (showAllPlaces ? allPlaces : places).map((place, index) => (
//                 <div
//                   key={index}
//                   style={getPlaceItemStyle(place)}
//                   onClick={() => setSelectedPlace(place)}
//                   onDoubleClick={() => handlePlaceSelect(place)}
//                 >
//                   <div style={styles.placeHeader}>
//                     <h4 style={styles.placeName}>{place.name}</h4>
//                     <span
//                       style={{
//                         ...styles.placeType,
//                         background:
//                           place.type === "restaurant"
//                             ? "#3498db"
//                             : place.type === "cafe"
//                               ? "#f39c12"
//                               : place.type === "bar"
//                                 ? "#9b59b6"
//                                 : place.type === "gym"
//                                   ? "#27ae60"
//                                   : place.type === "hospital"
//                                     ? "#e74c3c"
//                                     : place.type === "pharmacy"
//                                       ? "#f1c40f"
//                                       : place.type === "school"
//                                         ? "#34495e"
//                                         : "#3498db",
//                       }}
//                     >
//                       {place.type}
//                     </span>
//                   </div>
//                   <div>Double-click to navigate</div>
//                 </div>
//               ))
//             ) : (
//               <p>No {searchQuery}s found nearby</p>
//             )}
//           </div>
//         </div>

//         {/* Map */}
//         <div style={styles.mapContainer}>
//           {isLoading && <LoadingSpinner />}
//           <MapContainer
//             center={userLocation}
//             zoom={15}
//             style={{ height: "100%", width: "100%" }}
//             whenReady={() => setMapReady(true)}
//           >
//             <TileLayer
//               url={
//                 darkMode
//                   ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
//                   : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               }
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />

//             {/* User location marker */}
//             <Marker position={userLocation}>
//               <Popup>{manualLocationMode ? "Click to set your location" : "Your location"}</Popup>
//             </Marker>

//             {/* Start point marker */}
//             {startPoint && (
//               <Marker position={[startPoint.lat, startPoint.lng]} icon={icons.start}>
//                 <Popup>Start Point</Popup>
//               </Marker>
//             )}

//             {/* End point marker */}
//             {endPoint && (
//               <Marker position={[endPoint.lat, endPoint.lng]} icon={icons.end}>
//                 <Popup>End Point</Popup>
//               </Marker>
//             )}

//             {/* Route polyline */}
//             {route.length > 0 && <Polyline positions={route} color="#3498db" weight={6} opacity={0.7} />}

//             {/* Place markers */}
//             {(showAllPlaces ? allPlaces : places).map((place, index) => (
//               <Marker key={index} position={[place.lat, place.lng]} icon={getPlaceIcon(place.type)}>
//                 <Popup>
//                   <div>
//                     <strong>{place.name}</strong>
//                     <br />
//                     <span>{place.type}</span>
//                     <br />
//                     <button
//                       onClick={() => handlePlaceSelect(place)}
//                       style={{
//                         padding: "5px",
//                         margin: "5px 0",
//                         background: "#3498db",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "3px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Navigate Here
//                     </button>
//                   </div>
//                 </Popup>
//               </Marker>
//             ))}

//             {/* Keep map centered on user location */}
//             <RecenterMap center={userLocation} />

//             {/* Add click handler to map */}
//             <MapClickHandler onMapClick={handleMapClick} />
//           </MapContainer>
//         </div>
//       </div>

//       {/* Instructions */}
//       <div style={styles.instructions}>
//         <h3 style={styles.instructionsTitle}>How to Use</h3>
//         <ol style={styles.instructionsList}>
//           {manualLocationMode ? (
//             <li style={styles.instructionItem}>Click on the map to set your location</li>
//           ) : (
//             <>
//               <li style={styles.instructionItem}>
//                 Use the place type chips to search for different places (restaurants, gyms, etc.)
//               </li>
//               <li style={styles.instructionItem}>Adjust the search radius using the slider</li>
//               <li style={styles.instructionItem}>Click on a place in the list or on the map to see details</li>
//               <li style={styles.instructionItem}>
//                 Double-click a place or click "Navigate Here" to set it as your destination
//               </li>
//               <li style={styles.instructionItem}>Click "Start Navigation" to begin guided navigation</li>
//               <li style={styles.instructionItem}>Toggle "Show All Places" to see multiple place types at once</li>
//               <li style={styles.instructionItem}>Use Dark/Light mode toggle for different map styles</li>
//             </>
//           )}
//         </ol>
//       </div>

//       {/* Footer */}
//       <div style={styles.footer}>
//         <p>© {new Date().getFullYear()} Interactive Map Explorer | Using OpenStreetMap & Overpass API</p>
//       </div>

//       {/* Add global styles for dark mode */}
//       <style>{`
//         .dark {
//           background-color: #1a1a1a;
//           color: #f8f9fa;
//         }
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Maps7




"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import io from "socket.io-client"
import L from "leaflet"
import axios from "axios"

// Fix missing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Custom icons for different place types
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

const icons = {
  start: createIcon("green"),
  end: createIcon("red"),
  restaurant: createIcon("blue"),
  cafe: createIcon("orange"),
  bar: createIcon("violet"),
  gym: createIcon("gold"),
  hospital: createIcon("grey"),
  pharmacy: createIcon("yellow"),
  school: createIcon("black"),
  default: createIcon("blue"),
  liveLocation: createIcon("red"),
}

// Place type definitions with icons and display names
const placeTypes = [
  { value: "restaurant", label: "Restaurants", icon: icons.restaurant },
  { value: "cafe", label: "Cafes", icon: icons.cafe },
  { value: "bar", label: "Bars", icon: icons.bar },
  { value: "gym", label: "Gyms", icon: icons.gym },
  { value: "hospital", label: "Hospitals", icon: icons.hospital },
  { value: "pharmacy", label: "Pharmacies", icon: icons.pharmacy },
  { value: "school", label: "Schools", icon: icons.school },
]

// Initialize socket connection with error handling
let socket
try {
  socket = io("https://mapsssss.vercel.app/", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  })
} catch (error) {
  console.error("Socket connection error:", error)
  // Create a mock socket if connection fails
  socket = {
    emit: () => {},
    on: () => {},
    off: () => {},
  }
}

// Component to recenter map when location changes
const RecenterMap = ({ center, shouldRecenter }) => {
  const map = useMap()

  useEffect(() => {
    if (center && shouldRecenter && map) {
      map.setView(center, map.getZoom())
    }
  }, [center, map, shouldRecenter])

  return null
}

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
  const map = useMapEvents({
    click: (e) => {
      if (onMapClick && typeof onMapClick === "function") {
        onMapClick(e)
      }
    },
  })

  return null
}

// Text-to-speech function
const speak = (text) => {
  if ("speechSynthesis" in window) {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    synth.speak(utterance)
  } else {
    console.log("Text-to-speech not supported in this browser")
  }
}

// Loading spinner component
const LoadingSpinner = () => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
      background: "rgba(255, 255, 255, 0.8)",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 2s linear infinite",
        marginBottom: "10px",
      }}
    ></div>
    <p style={{ margin: 0, fontWeight: "bold" }}>Loading map data...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

// Geocoding function to convert address to coordinates
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
    )
    if (response.data && response.data.length > 0) {
      const location = response.data[0]
      return {
        lat: Number.parseFloat(location.lat),
        lng: Number.parseFloat(location.lon),
        displayName: location.display_name,
      }
    }
    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

// Reverse geocoding function to convert coordinates to address
const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    if (response.data) {
      return response.data.display_name
    }
    return "Unknown location"
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return "Unknown location"
  }
}

// Custom marker component to handle marker lifecycle properly
const LocationMarker = ({ position, icon, popupText, popupContent }) => {
  const map = useMap()

  // Only render marker when map and position are available
  if (!map || !position || !position[0] || !position[1]) {
    return null
  }

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        add: (e) => {
          // Ensure marker is properly added to map
          const marker = e.target
          if (marker && marker._icon) {
            marker._icon.style.transition = "transform 0.3s ease-out"
          }
        },
      }}
    >
      {popupText ? <Popup>{popupText}</Popup> : popupContent ? <Popup>{popupContent}</Popup> : null}
    </Marker>
  )
}

const InteractiveMap = () => {
  // Map reference
  const mapRef = useRef(null)

  // Default to London coordinates
  const [userLocation, setUserLocation] = useState([51.505, -0.09])
  const [userLocationName, setUserLocationName] = useState("Current Location")
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [route, setRoute] = useState([])
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [places, setPlaces] = useState([])
  const [searchQuery, setSearchQuery] = useState("restaurant")
  const [isNavigating, setIsNavigating] = useState(false)
  const [geolocationAvailable, setGeolocationAvailable] = useState(true)
  const [manualLocationMode, setManualLocationMode] = useState(false)
  const [tempLocation, setTempLocation] = useState({ lat: 51.505, lng: -0.09 })
  const [locationError, setLocationError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  // Map state
  const [mapReady, setMapReady] = useState(false)
  const [searchRadius, setSearchRadius] = useState(1000) // in meters
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showAllPlaces, setShowAllPlaces] = useState(false)
  const [allPlaces, setAllPlaces] = useState([])

  // New state for live location tracking
  const [liveLocationEnabled, setLiveLocationEnabled] = useState(false)
  const [watchId, setWatchId] = useState(null)

  // New state for location form
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [fromCoordinates, setFromCoordinates] = useState(null)
  const [toCoordinates, setToCoordinates] = useState(null)
  const [recentLocations, setRecentLocations] = useState([])
  const [showLocationForm, setShowLocationForm] = useState(false)

  // Refs for marker management
  const userMarkerRef = useRef(null)
  const startMarkerRef = useRef(null)
  const endMarkerRef = useRef(null)
  const placeMarkersRef = useRef({})

  // Calculate route between two points using OSRM
  const calculateRoute = useCallback(async (start, end) => {
    if (!start || !end || !start[0] || !start[1] || !end[0] || !end[1]) {
      console.error("Invalid coordinates for route calculation")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
      )

      if (response.data.routes && response.data.routes.length > 0) {
        const routeData = response.data.routes[0]
        const routeCoordinates = routeData.geometry.coordinates.map((coord) => [coord[1], coord[0]])

        setRoute(routeCoordinates)

        // Calculate distance in kilometers
        const distanceInMeters = routeData.distance
        setDistance((distanceInMeters / 1000).toFixed(2))

        // Calculate duration in minutes
        const durationInSeconds = routeData.duration
        setDuration(Math.round(durationInSeconds / 60))
      }
    } catch (error) {
      console.error("Error calculating route:", error)
      setRoute([])
      setDistance(null)
      setDuration(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Function to start live location tracking
  const startLiveLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    try {
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setTempLocation({ lat: latitude, lng: longitude })

          // Get location name
          try {
            const locationName = await reverseGeocode(latitude, longitude)
            setUserLocationName(locationName)

            // Update from location if live tracking is enabled
            if (liveLocationEnabled && fromLocation === "") {
              setFromLocation(locationName)
              setFromCoordinates({ lat: latitude, lng: longitude })
            }
          } catch (error) {
            console.error("Error getting location name:", error)
          }

          socket.emit("updateLocation", { lat: latitude, lng: longitude })

          // If navigating, update route information
          if (isNavigating && toCoordinates) {
            calculateRoute([latitude, longitude], [toCoordinates.lat, toCoordinates.lng])
          }
        },
        (error) => {
          console.error("Watch position error:", error)
          setLiveLocationEnabled(false)
          stopLiveLocation()
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
      )

      setWatchId(id)
      setLiveLocationEnabled(true)
      speak("Live location tracking enabled")
    } catch (e) {
      console.error("Error setting up watch position:", e)
      setGeolocationAvailable(false)
      setLiveLocationEnabled(false)
    }
  }, [calculateRoute, fromLocation, isNavigating, liveLocationEnabled, toCoordinates])

  // Function to stop live location tracking
  const stopLiveLocation = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
      setLiveLocationEnabled(false)
      speak("Live location tracking disabled")
    }
  }, [watchId])

  // Toggle live location tracking
  const toggleLiveLocation = useCallback(() => {
    if (liveLocationEnabled) {
      stopLiveLocation()
    } else {
      startLiveLocation()
      setShowLocationForm(true)
    }
  }, [liveLocationEnabled, startLiveLocation, stopLiveLocation])

  // Handle from/to location form submission
  const handleLocationFormSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setIsLoading(true)

      try {
        // If from location is empty and live location is enabled, use current location
        if (fromLocation === "" && liveLocationEnabled) {
          setFromLocation(userLocationName)
          setFromCoordinates({ lat: userLocation[0], lng: userLocation[1] })
        }
        // Otherwise geocode the from location
        else if (fromLocation !== "" && !fromCoordinates) {
          const fromCoords = await geocodeAddress(fromLocation)
          if (fromCoords) {
            setFromCoordinates(fromCoords)
            setFromLocation(fromCoords.displayName)

            // Add to recent locations
            setRecentLocations((prev) => {
              const newLocations = [...prev]
              if (!newLocations.some((loc) => loc.name === fromCoords.displayName)) {
                newLocations.unshift({
                  name: fromCoords.displayName,
                  coords: { lat: fromCoords.lat, lng: fromCoords.lng },
                })
              }
              return newLocations.slice(0, 5) // Keep only 5 recent locations
            })
          } else {
            speak("Could not find the starting location")
            setIsLoading(false)
            return
          }
        }

        // Geocode the to location
        if (toLocation !== "") {
          const toCoords = await geocodeAddress(toLocation)
          if (toCoords) {
            setToCoordinates(toCoords)
            setToLocation(toCoords.displayName)

            // Add to recent locations
            setRecentLocations((prev) => {
              const newLocations = [...prev]
              if (!newLocations.some((loc) => loc.name === toCoords.displayName)) {
                newLocations.unshift({
                  name: toCoords.displayName,
                  coords: { lat: toCoords.lat, lng: toCoords.lng },
                })
              }
              return newLocations.slice(0, 5) // Keep only 5 recent locations
            })

            // Set start and end points for navigation
            const startCoords = fromCoordinates || { lat: userLocation[0], lng: userLocation[1] }
            setStartPoint(startCoords)
            setEndPoint(toCoords)

            // Calculate route
            calculateRoute([startCoords.lat, startCoords.lng], [toCoords.lat, toCoords.lng])
            speak(`Calculating route from ${fromLocation || userLocationName} to ${toCoords.displayName}`)
          } else {
            speak("Could not find the destination location")
          }
        }
      } catch (error) {
        console.error("Error processing locations:", error)
        speak("Error processing locations")
      } finally {
        setIsLoading(false)
      }
    },
    [calculateRoute, fromCoordinates, fromLocation, liveLocationEnabled, toLocation, userLocation, userLocationName],
  )

  // Try to get user location, but handle errors gracefully
  useEffect(() => {
    setIsLoading(true)

    // Check if geolocation is available
    if (!navigator.geolocation) {
      setGeolocationAvailable(false)
      setLocationError("Geolocation is not supported by your browser")
      setIsLoading(false)
      return
    }

    // Try to get user location once
    const getInitialLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setTempLocation({ lat: latitude, lng: longitude })

          // Get location name
          try {
            const locationName = await reverseGeocode(latitude, longitude)
            setUserLocationName(locationName)
          } catch (error) {
            console.error("Error getting location name:", error)
          }

          socket.emit("updateLocation", { lat: latitude, lng: longitude })
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setGeolocationAvailable(false)

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access was denied. You can set your location manually.")
              break
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable. You can set your location manually.")
              break
            case error.TIMEOUT:
              setLocationError("Location request timed out. You can set your location manually.")
              break
            default:
              setLocationError("An unknown error occurred. You can set your location manually.")
          }

          setManualLocationMode(true)
          setLiveLocationEnabled(false)
          setIsLoading(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    }

    getInitialLocation()

    // Clean up
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, []) // Only run on mount

  // Socket event listeners
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server")
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from server")
    })

    socket.on("error", (error) => {
      console.error("Socket error:", error)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("error")
    }
  }, [])

  // Fetch nearby places using Overpass API
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!userLocation[0] || !userLocation[1] || !mapReady) return

      setIsLoading(true)

      try {
        // Calculate bounding box based on radius (approximate conversion from meters to degrees)
        const radiusDegrees = searchRadius / 111000 // roughly 111km per degree

        // Using Overpass API
        const query = `
          [out:json];
          node
            ["amenity"="${searchQuery}"]
            (${userLocation[0] - radiusDegrees},${userLocation[1] - radiusDegrees},${userLocation[0] + radiusDegrees},${userLocation[1] + radiusDegrees});
          out;
        `

        const response = await axios.get("https://overpass-api.de/api/interpreter", {
          params: { data: query },
        })

        if (response.data && response.data.elements) {
          const parsedPlaces = response.data.elements.map((el) => ({
            id: el.id,
            lat: el.lat,
            lng: el.lon,
            name: el.tags && el.tags.name ? el.tags.name : `Unnamed ${searchQuery}`,
            type: searchQuery,
            amenity: el.tags || {},
          }))

          // Clear previous place markers
          placeMarkersRef.current = {}

          setPlaces(parsedPlaces)

          // Add to all places if showing all
          if (showAllPlaces) {
            setAllPlaces((prev) => {
              // Filter out places of the same type to avoid duplicates
              const filtered = prev.filter((p) => p.type !== searchQuery)
              return [...filtered, ...parsedPlaces]
            })
          }
        }
      } catch (error) {
        console.error(`Error fetching nearby ${searchQuery}s:`, error)
        // Fallback to empty array if API fails
        setPlaces([])
      } finally {
        setIsLoading(false)
      }
    }

    if (userLocation[0] && userLocation[1] && mapReady) {
      fetchNearbyPlaces()
    }
  }, [userLocation, searchQuery, mapReady, searchRadius, showAllPlaces])

  // Handle map click to set start/end points
  const handleMapClick = useCallback(
    async (e) => {
      const { lat, lng } = e.latlng

      // If in manual location mode, set user location
      if (manualLocationMode) {
        setUserLocation([lat, lng])
        setTempLocation({ lat, lng })

        // Get location name
        try {
          const locationName = await reverseGeocode(lat, lng)
          setUserLocationName(locationName)
        } catch (error) {
          console.error("Error getting location name:", error)
        }

        setManualLocationMode(false)
        speak("Location set")
        return
      }

      // If location form is shown, set from or to location
      if (showLocationForm) {
        try {
          const locationName = await reverseGeocode(lat, lng)

          if (!fromCoordinates) {
            setFromLocation(locationName)
            setFromCoordinates({ lat, lng })
            speak("From location set")
          } else if (!toCoordinates) {
            setToLocation(locationName)
            setToCoordinates({ lat, lng })
            speak("To location set")

            // Calculate route
            calculateRoute([fromCoordinates.lat, fromCoordinates.lng], [lat, lng])

            // Set start and end points
            setStartPoint(fromCoordinates)
            setEndPoint({ lat, lng })
          }
        } catch (error) {
          console.error("Error getting location name:", error)
        }
        return
      }

      // Default behavior - set start/end points
      if (!startPoint) {
        try {
          const locationName = await reverseGeocode(lat, lng)
          setStartPoint({ lat, lng, name: locationName })
          speak("Start point set")
        } catch (error) {
          console.error("Error getting location name:", error)
          setStartPoint({ lat, lng, name: "Start Point" })
          speak("Start point set")
        }
      } else if (!endPoint) {
        try {
          const locationName = await reverseGeocode(lat, lng)
          setEndPoint({ lat, lng, name: locationName })
          speak("End point set")
          calculateRoute([startPoint.lat, startPoint.lng], [lat, lng])
        } catch (error) {
          console.error("Error getting location name:", error)
          setEndPoint({ lat, lng, name: "End Point" })
          speak("End point set")
          calculateRoute([startPoint.lat, startPoint.lng], [lat, lng])
        }
      }
    },
    [calculateRoute, fromCoordinates, manualLocationMode, showLocationForm, startPoint, toCoordinates],
  )

  // Start navigation
  const handleStartNavigation = useCallback(() => {
    if (startPoint && endPoint) {
      setIsNavigating(true)
      calculateRoute([userLocation[0], userLocation[1]], [endPoint.lat, endPoint.lng])
      speak("Starting navigation")
    } else {
      speak("Please set start and end points first")
    }
  }, [calculateRoute, endPoint, startPoint, userLocation])

  // End navigation
  const handleEndNavigation = useCallback(() => {
    setIsNavigating(false)
    setRoute([])
    setStartPoint(null)
    setEndPoint(null)
    setDistance(null)
    setDuration(null)
    setFromLocation("")
    setToLocation("")
    setFromCoordinates(null)
    setToCoordinates(null)
    speak("Navigation ended")
  }, [])

  // Handle place selection
  const handlePlaceSelect = useCallback(
    (place) => {
      setSelectedPlace(place)

      // If location form is shown, set as destination
      if (showLocationForm) {
        setToLocation(place.name)
        setToCoordinates({ lat: place.lat, lng: place.lng })

        if (fromCoordinates || liveLocationEnabled) {
          const startCoords = fromCoordinates || { lat: userLocation[0], lng: userLocation[1] }
          setStartPoint(startCoords)
          setEndPoint({ lat: place.lat, lng: place.lng })
          calculateRoute([startCoords.lat, startCoords.lng], [place.lat, place.lng])
        }

        speak(`Set ${place.name} as destination`)
        return
      }

      // Default behavior
      if (!startPoint) {
        setStartPoint({ lat: userLocation[0], lng: userLocation[1], name: userLocationName })
        setEndPoint({ lat: place.lat, lng: place.lng, name: place.name })
        calculateRoute([userLocation[0], userLocation[1]], [place.lat, place.lng])
        speak(`Navigating to ${place.name}`)
      }
    },
    [
      calculateRoute,
      fromCoordinates,
      liveLocationEnabled,
      showLocationForm,
      startPoint,
      userLocation,
      userLocationName,
    ],
  )

  // Handle manual location input
  const handleManualLocationSubmit = useCallback(
    (e) => {
      e.preventDefault()
      setUserLocation([tempLocation.lat, tempLocation.lng])
      setManualLocationMode(false)
      speak("Location set manually")
    },
    [tempLocation],
  )

  // Enable manual location mode
  const enableManualLocationMode = useCallback(() => {
    setManualLocationMode(true)
    // Disable live location when entering manual mode
    if (liveLocationEnabled) {
      stopLiveLocation()
    }
    speak("Click on the map to set your location")
  }, [liveLocationEnabled, stopLiveLocation])

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("dark")
  }, [darkMode])

  // Toggle showing all places
  const toggleShowAllPlaces = useCallback(() => {
    setShowAllPlaces(!showAllPlaces)
    if (!showAllPlaces) {
      // If turning on, add current places to all places
      setAllPlaces(places)
    }
  }, [places, showAllPlaces])

  // Toggle location form
  const toggleLocationForm = useCallback(() => {
    setShowLocationForm(!showLocationForm)
    if (!showLocationForm) {
      // If showing form, clear previous inputs
      setFromLocation("")
      setToLocation("")
      setFromCoordinates(null)
      setToCoordinates(null)

      // If live location is enabled, use it as from location
      if (liveLocationEnabled) {
        setFromLocation(userLocationName)
        setFromCoordinates({ lat: userLocation[0], lng: userLocation[1] })
      }
    }
  }, [liveLocationEnabled, showLocationForm, userLocation, userLocationName])

  // Get icon for place type
  const getPlaceIcon = useCallback((type) => {
    const placeType = placeTypes.find((pt) => pt.value === type)
    return placeType ? placeType.icon : icons.default
  }, [])

  // Use recent location
  const _useRecentLocation = useCallback(
    (location, type) => {
      if (type === "from") {
        setFromLocation(location.name)
        setFromCoordinates(location.coords)
      } else {
        setToLocation(location.name)
        setToCoordinates(location.coords)

        if (fromCoordinates) {
          setStartPoint(fromCoordinates)
          setEndPoint(location.coords)
          calculateRoute([fromCoordinates.lat, fromCoordinates.lng], [location.coords.lat, location.coords.lng])
        }
      }
    },
    [calculateRoute, fromCoordinates],
  )

  const handleFromRecentLocation = useCallback(
    (location) => {
      _useRecentLocation(location, "from")
    },
    [_useRecentLocation],
  )

  const handleToRecentLocation = useCallback(
    (location) => {
      _useRecentLocation(location, "to")
    },
    [_useRecentLocation],
  )

  // Styles with dark mode support
  const styles = {
    container: {
      padding: "20px",
      textAlign: "center",
      background: darkMode ? "#1a1a1a" : "#f8f9fa",
      color: darkMode ? "#f8f9fa" : "#333",
      borderRadius: "10px",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      position: "relative",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      borderBottom: darkMode ? "1px solid #444" : "1px solid #ddd",
      paddingBottom: "10px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      margin: "0",
      color: darkMode ? "#3498db" : "#2980b9",
    },
    controls: {
      display: "flex",
      gap: "10px",
    },
    searchContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px",
    },
    searchRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      padding: "12px",
      borderRadius: "8px",
      border: darkMode ? "1px solid #444" : "1px solid #ccc",
      background: darkMode ? "#333" : "white",
      color: darkMode ? "white" : "black",
      flex: "1",
      minWidth: "200px",
      maxWidth: "400px",
      fontSize: "16px",
    },
    select: {
      padding: "12px",
      borderRadius: "8px",
      border: darkMode ? "1px solid #444" : "1px solid #ccc",
      background: darkMode ? "#333" : "white",
      color: darkMode ? "white" : "black",
      cursor: "pointer",
      minWidth: "150px",
    },
    rangeContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "5px 10px",
      background: darkMode ? "#333" : "#f0f0f0",
      borderRadius: "8px",
      minWidth: "200px",
    },
    rangeLabel: {
      fontSize: "14px",
      whiteSpace: "nowrap",
    },
    range: {
      flex: "1",
    },
    button: {
      padding: "12px 20px",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "5px",
      minWidth: "120px",
    },
    startButton: {
      background: "#27ae60",
      boxShadow: "0 4px 6px rgba(39, 174, 96, 0.2)",
    },
    endButton: {
      background: "#e74c3c",
      boxShadow: "0 4px 6px rgba(231, 76, 60, 0.2)",
    },
    locationButton: {
      background: "#3498db",
      boxShadow: "0 4px 6px rgba(52, 152, 219, 0.2)",
    },
    liveLocationButton: {
      background: liveLocationEnabled ? "#27ae60" : "#e74c3c",
      boxShadow: "0 4px 6px rgba(52, 152, 219, 0.2)",
    },
    toggleButton: {
      background: darkMode ? "#f39c12" : "#9b59b6",
      boxShadow: darkMode ? "0 4px 6px rgba(243, 156, 18, 0.2)" : "0 4px 6px rgba(155, 89, 182, 0.2)",
    },
    infoText: {
      margin: "5px 0",
      fontSize: "16px",
      fontWeight: "500",
    },
    errorText: {
      color: "#e74c3c",
      margin: "10px 0",
      padding: "15px",
      background: darkMode ? "rgba(231, 76, 60, 0.2)" : "#fadbd8",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
    mapContainer: {
      height: "600px",
      width: "100%",
      borderRadius: "12px",
      boxShadow: darkMode ? "0 8px 30px rgba(0,0,0,0.3)" : "0 8px 30px rgba(0,0,0,0.1)",
      overflow: "hidden",
      position: "relative",
    },
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 3fr",
      gap: "20px",
      marginBottom: "20px",
    },
    sidebar: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    placesList: {
      maxHeight: "400px",
      overflowY: "auto",
      padding: "15px",
      background: darkMode ? "#333" : "white",
      borderRadius: "8px",
      textAlign: "left",
      boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
    },
    placeItem: {
      padding: "12px",
      margin: "8px 0",
      background: darkMode ? "#444" : "#f0f0f0",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderLeft: "4px solid #3498db",
    },
    selectedPlace: {
      borderLeft: "4px solid #e74c3c",
      background: darkMode ? "#555" : "#e6e6e6",
    },
    placeHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "5px",
    },
    placeName: {
      fontWeight: "bold",
      fontSize: "16px",
      margin: "0",
    },
    placeType: {
      fontSize: "12px",
      padding: "3px 8px",
      borderRadius: "12px",
      background: "#3498db",
      color: "white",
    },
    manualLocationForm: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "15px 0",
      padding: "20px",
      background: darkMode ? "#333" : "#e8f4f8",
      borderRadius: "12px",
      boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
    },
    coordInput: {
      padding: "10px",
      margin: "5px",
      width: "150px",
      borderRadius: "6px",
      border: darkMode ? "1px solid #444" : "1px solid #ccc",
      background: darkMode ? "#444" : "white",
      color: darkMode ? "white" : "black",
    },
    submitButton: {
      padding: "10px 20px",
      margin: "15px",
      background: "#2980b9",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.2s ease",
    },
    routeInfo: {
      display: "flex",
      justifyContent: "space-around",
      padding: "15px",
      background: darkMode ? "#333" : "white",
      borderRadius: "8px",
      marginBottom: "20px",
      boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
    },
    routeInfoItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    routeInfoValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#3498db",
    },
    routeInfoLabel: {
      fontSize: "14px",
      color: darkMode ? "#ccc" : "#666",
    },
    instructions: {
      marginTop: "20px",
      padding: "20px",
      background: darkMode ? "#333" : "white",
      borderRadius: "8px",
      boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
    },
    instructionsTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: darkMode ? "#3498db" : "#2980b9",
    },
    instructionsList: {
      textAlign: "left",
      paddingLeft: "20px",
    },
    instructionItem: {
      margin: "10px 0",
      lineHeight: "1.5",
    },
    footer: {
      marginTop: "30px",
      padding: "15px",
      borderTop: darkMode ? "1px solid #444" : "1px solid #ddd",
      fontSize: "14px",
      color: darkMode ? "#ccc" : "#666",
    },
    placeTypeChips: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "15px",
      justifyContent: "center",
    },
    placeTypeChip: {
      padding: "8px 15px",
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      border: "1px solid #3498db",
    },
    activeChip: {
      background: "#3498db",
      color: "white",
    },
    inactiveChip: {
      background: darkMode ? "#333" : "white",
      color: darkMode ? "#ccc" : "#3498db",
    },
    placeDetails: {
      padding: "15px",
      background: darkMode ? "#333" : "white",
      borderRadius: "8px",
      marginBottom: "20px",
      boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
    },
    placeDetailsTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: darkMode ? "#3498db" : "#2980b9",
    },
    placeDetailsInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    placeDetailsItem: {
      display: "flex",
      justifyContent: "space-between",
    },
    placeDetailsLabel: {
      fontWeight: "bold",
      color: darkMode ? "#ccc" : "#666",
    },
    placeDetailsValue: {
      color: darkMode ? "white" : "black",
    },
    placeDetailsActions: {
      display: "flex",
      justifyContent: "center",
      marginTop: "15px",
      gap: "10px",
    },
    responsiveGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "20px",
    },
    locationForm: {
      padding: "20px",
      background: darkMode ? "#333" : "white",
      borderRadius: "8px",
      marginBottom: "20px",
      boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.1)",
    },
    locationFormTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: darkMode ? "#3498db" : "#2980b9",
    },
    locationFormGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
      textAlign: "left",
    },
    locationFormLabel: {
      marginBottom: "5px",
      fontWeight: "bold",
    },
    locationFormInput: {
      padding: "12px",
      borderRadius: "8px",
      border: darkMode ? "1px solid #444" : "1px solid #ccc",
      background: darkMode ? "#444" : "white",
      color: darkMode ? "white" : "black",
      fontSize: "16px",
    },
    locationFormActions: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      gap: "10px",
    },
    recentLocations: {
      marginTop: "15px",
      textAlign: "left",
    },
    recentLocationTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    recentLocationItem: {
      padding: "8px 12px",
      margin: "5px 0",
      background: darkMode ? "#444" : "#f0f0f0",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      justifyContent: "space-between",
    },
  }

  // Apply hover effects with inline styles
  const getPlaceItemStyle = (place) => {
    const baseStyle = {
      padding: "12px",
      margin: "8px 0",
      background: darkMode ? "#444" : "#f0f0f0",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderLeft: "4px solid #3498db",
    }

    // If this is the selected place
    if (selectedPlace && selectedPlace.lat === place.lat && selectedPlace.lng === place.lng) {
      return {
        ...baseStyle,
        borderLeft: "4px solid #e74c3c",
        background: darkMode ? "#555" : "#e6e6e6",
      }
    }

    return baseStyle
  }

  // Initialize map and handle cleanup
  useEffect(() => {
    setMapReady(false)

    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setMapReady(true)
    }, 100)

    return () => {
      clearTimeout(timer)
      setMapReady(false)
    }
  }, [])

  return (
    <div style={{ ...styles.container }} className={darkMode ? "dark" : ""}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Interactive Map Explorer</h2>
        <div style={styles.controls}>
          <button onClick={toggleDarkMode} style={{ ...styles.button, background: darkMode ? "#f39c12" : "#9b59b6" }}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={toggleShowAllPlaces}
            style={{ ...styles.button, background: showAllPlaces ? "#27ae60" : "#3498db" }}
          >
            {showAllPlaces ? "Filter Places" : "Show All Places"}
          </button>
        </div>
      </div>

      {/* Location error message */}
      {locationError && (
        <div style={styles.errorText}>
          {locationError}
          <button onClick={enableManualLocationMode} style={{ ...styles.button, ...styles.locationButton }}>
            Set Location Manually
          </button>
        </div>
      )}

      {/* Live location and location form buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "15px" }}>
        <button
          onClick={toggleLiveLocation}
          style={{
            ...styles.button,
            background: liveLocationEnabled ? "#27ae60" : "#e74c3c",
          }}
          disabled={!geolocationAvailable}
        >
          {liveLocationEnabled ? "Disable Live Location" : "Enable Live Location"}
        </button>

        <button
          onClick={toggleLocationForm}
          style={{
            ...styles.button,
            background: showLocationForm ? "#27ae60" : "#3498db",
          }}
        >
          {showLocationForm ? "Hide Route Form" : "Show Route Form"}
        </button>
      </div>

      {/* Manual location mode instructions */}
      {manualLocationMode && (
        <div style={styles.manualLocationForm}>
          <h3>Set Your Location</h3>
          <p>Click on the map to set your location or enter coordinates below:</p>
          <form onSubmit={handleManualLocationSubmit}>
            <div>
              <label>Latitude: </label>
              <input
                type="number"
                step="0.000001"
                value={tempLocation.lat}
                onChange={(e) => setTempLocation({ ...tempLocation, lat: Number.parseFloat(e.target.value) })}
                style={styles.coordInput}
              />
            </div>
            <div>
              <label>Longitude: </label>
              <input
                type="number"
                step="0.000001"
                value={tempLocation.lng}
                onChange={(e) => setTempLocation({ ...tempLocation, lng: Number.parseFloat(e.target.value) })}
                style={styles.coordInput}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Set Location
            </button>
          </form>
        </div>
      )}

      {/* Location form */}
      {showLocationForm && (
        <div style={styles.locationForm}>
          <h3 style={styles.locationFormTitle}>Enter Route Details</h3>
          <form onSubmit={handleLocationFormSubmit}>
            <div style={styles.locationFormGroup}>
              <label style={styles.locationFormLabel}>From:</label>
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder={liveLocationEnabled ? "Using your live location" : "Enter starting location"}
                style={styles.locationFormInput}
              />

              {recentLocations.length > 0 && (
                <div style={styles.recentLocations}>
                  <p style={styles.recentLocationTitle}>Recent locations:</p>
                  {recentLocations.map((location, index) => (
                    <div
                      key={`from-${index}`}
                      style={styles.recentLocationItem}
                      onClick={() => handleFromRecentLocation(location)}
                    >
                      {location.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.locationFormGroup}>
              <label style={styles.locationFormLabel}>To:</label>
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="Enter destination"
                style={styles.locationFormInput}
              />

              {recentLocations.length > 0 && (
                <div style={styles.recentLocations}>
                  <p style={styles.recentLocationTitle}>Recent locations:</p>
                  {recentLocations.map((location, index) => (
                    <div
                      key={`to-${index}`}
                      style={styles.recentLocationItem}
                      onClick={() => handleToRecentLocation(location)}
                    >
                      {location.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.locationFormActions}>
              <button type="submit" style={{ ...styles.button, background: "#27ae60" }}>
                Calculate Route
              </button>
              <button
                type="button"
                onClick={() => {
                  setFromLocation("")
                  setToLocation("")
                  setFromCoordinates(null)
                  setToCoordinates(null)
                }}
                style={{ ...styles.button, background: "#e74c3c" }}
              >
                Clear
              </button>
            </div>
          </form>

          <p style={{ marginTop: "15px", fontSize: "14px" }}>
            You can also click on the map to set locations or select a place from the list.
          </p>
        </div>
      )}

      {/* Search controls */}
      <div style={styles.searchContainer}>
        <div style={styles.placeTypeChips}>
          {placeTypes.map((type) => (
            <div
              key={type.value}
              onClick={() => setSearchQuery(type.value)}
              style={{
                ...styles.placeTypeChip,
                ...(searchQuery === type.value ? styles.activeChip : styles.inactiveChip),
              }}
            >
              {type.label}
            </div>
          ))}
        </div>

        <div style={styles.searchRow}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places (e.g. restaurant, cafe, hospital)"
            style={styles.input}
          />

          <div style={styles.rangeContainer}>
            <span style={styles.rangeLabel}>Radius: {searchRadius}m</span>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number.parseInt(e.target.value))}
              style={styles.range}
            />
          </div>
        </div>
      </div>

      {/* Route information */}
      {(distance || duration) && (
        <div style={styles.routeInfo}>
          {fromLocation && toLocation && (
            <div style={styles.routeInfoItem}>
              <span style={styles.routeInfoValue}>Route</span>
              <span style={styles.routeInfoLabel}>
                {fromLocation.length > 20 ? fromLocation.substring(0, 20) + "..." : fromLocation} to{" "}
                {toLocation.length > 20 ? toLocation.substring(0, 20) + "..." : toLocation}
              </span>
            </div>
          )}
          {distance && (
            <div style={styles.routeInfoItem}>
              <span style={styles.routeInfoValue}>{distance} km</span>
              <span style={styles.routeInfoLabel}>Distance</span>
            </div>
          )}
          {duration && (
            <div style={styles.routeInfoItem}>
              <span style={styles.routeInfoValue}>{duration} min</span>
              <span style={styles.routeInfoLabel}>Duration</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
        <button
          onClick={handleStartNavigation}
          style={{ ...styles.button, background: "#27ae60" }}
          disabled={!startPoint || !endPoint || manualLocationMode}
        >
          Start Navigation
        </button>
        <button
          onClick={handleEndNavigation}
          style={{ ...styles.button, background: "#e74c3c" }}
          disabled={manualLocationMode}
        >
          End Navigation
        </button>
      </div>

      {/* Main content grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
          "@media (min-width: 768px)": {
            gridTemplateColumns: "1fr 3fr",
          },
        }}
      >
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Selected place details */}
          {selectedPlace && (
            <div style={styles.placeDetails}>
              <h3 style={styles.placeDetailsTitle}>{selectedPlace.name}</h3>
              <div style={styles.placeDetailsInfo}>
                <div style={styles.placeDetailsItem}>
                  <span style={styles.placeDetailsLabel}>Type:</span>
                  <span style={styles.placeDetailsValue}>{selectedPlace.type}</span>
                </div>
                {selectedPlace.amenity &&
                  Object.entries(selectedPlace.amenity).map(
                    ([key, value]) =>
                      key !== "name" && (
                        <div key={key} style={styles.placeDetailsItem}>
                          <span style={styles.placeDetailsLabel}>{key}:</span>
                          <span style={styles.placeDetailsValue}>{value}</span>
                        </div>
                      ),
                  )}
              </div>
              <div style={styles.placeDetailsActions}>
                <button
                  onClick={() => handlePlaceSelect(selectedPlace)}
                  style={{ ...styles.button, background: "#3498db" }}
                >
                  Navigate Here
                </button>
              </div>
            </div>
          )}

          {/* Places list */}
          <div style={styles.placesList}>
            <h3>Nearby {showAllPlaces ? "Places" : searchQuery + "s"}:</h3>
            {(showAllPlaces ? allPlaces : places).length > 0 ? (
              (showAllPlaces ? allPlaces : places).map((place, index) => (
                <div
                  key={place.id || index}
                  style={getPlaceItemStyle(place)}
                  onClick={() => setSelectedPlace(place)}
                  onDoubleClick={() => handlePlaceSelect(place)}
                >
                  <div style={styles.placeHeader}>
                    <h4 style={styles.placeName}>{place.name}</h4>
                    <span
                      style={{
                        ...styles.placeType,
                        background:
                          place.type === "restaurant"
                            ? "#3498db"
                            : place.type === "cafe"
                              ? "#f39c12"
                              : place.type === "bar"
                                ? "#9b59b6"
                                : place.type === "gym"
                                  ? "#27ae60"
                                  : place.type === "hospital"
                                    ? "#e74c3c"
                                    : place.type === "pharmacy"
                                      ? "#f1c40f"
                                      : place.type === "school"
                                        ? "#34495e"
                                        : "#3498db",
                      }}
                    >
                      {place.type}
                    </span>
                  </div>
                  <div>Double-click to navigate</div>
                </div>
              ))
            ) : (
              <p>No {searchQuery}s found nearby</p>
            )}
          </div>
        </div>

        {/* Map */}
        <div style={styles.mapContainer}>
          {isLoading && <LoadingSpinner />}
          {mapReady ? (
            <MapContainer
              center={userLocation}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              whenReady={() => {
                setMapReady(true)
              }}
              key={`map-${darkMode}-${userLocation[0]}-${userLocation[1]}`}
            >
              <TileLayer
                url={
                  darkMode
                    ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* User location marker */}
              <LocationMarker
                position={userLocation}
                icon={liveLocationEnabled ? icons.liveLocation : null}
                popupText={manualLocationMode ? "Click to set your location" : "Your location"}
              />

              {/* Start point marker */}
              {startPoint && (
                <LocationMarker
                  position={[startPoint.lat, startPoint.lng]}
                  icon={icons.start}
                  popupText={startPoint.name || "Start Point"}
                />
              )}

              {/* End point marker */}
              {endPoint && (
                <LocationMarker
                  position={[endPoint.lat, endPoint.lng]}
                  icon={icons.end}
                  popupText={endPoint.name || "End Point"}
                />
              )}

              {/* Route polyline */}
              {route.length > 0 && <Polyline positions={route} color="#3498db" weight={6} opacity={0.7} />}

              {/* Place markers */}
              {(showAllPlaces ? allPlaces : places).map((place) => (
                <LocationMarker
                  key={`place-${place.id || `${place.lat}-${place.lng}`}`}
                  position={[place.lat, place.lng]}
                  icon={getPlaceIcon(place.type)}
                  popupContent={
                    <div>
                      <strong>{place.name}</strong>
                      <br />
                      <span>{place.type}</span>
                      <br />
                      <button
                        onClick={() => handlePlaceSelect(place)}
                        style={{
                          padding: "5px",
                          margin: "5px 0",
                          background: "#3498db",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        Navigate Here
                      </button>
                    </div>
                  }
                />
              ))}

              {/* Keep map centered on user location only if live location is enabled */}
              <RecenterMap center={userLocation} shouldRecenter={liveLocationEnabled} />

              {/* Add click handler to map */}
              <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: darkMode ? "#333" : "#f0f0f0",
              }}
            >
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        <h3 style={styles.instructionsTitle}>How to Use</h3>
        <ol style={styles.instructionsList}>
          {manualLocationMode ? (
            <li style={styles.instructionItem}>Click on the map to set your location</li>
          ) : (
            <>
              <li style={styles.instructionItem}>
                Click "Enable Live Location" to track your current position in real-time
              </li>
              <li style={styles.instructionItem}>
                Click "Show Route Form" to enter your starting point and destination by name
              </li>
              <li style={styles.instructionItem}>
                You can enter addresses, city names, or landmarks in the route form
              </li>
              <li style={styles.instructionItem}>Click on the map to set locations or use the search to find places</li>
              <li style={styles.instructionItem}>
                Use the place type chips to search for different places (restaurants, gyms, etc.)
              </li>
              <li style={styles.instructionItem}>Click "Calculate Route" to find directions between your locations</li>
              <li style={styles.instructionItem}>Click "Start Navigation" to begin guided navigation</li>
              <li style={styles.instructionItem}>Toggle "Show All Places" to see multiple place types at once</li>
            </>
          )}
        </ol>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>© {new Date().getFullYear()} Interactive Map Explorer | Using OpenStreetMap & Overpass API</p>
      </div>

      {/* Add global styles for dark mode */}
      <style>{`
        .dark {
          background-color: #1a1a1a;
          color: #f8f9fa;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default InteractiveMap

