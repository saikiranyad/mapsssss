// // Backend (server.js)
// const express = require('express');
// const http = require('http');
// const axios = require('axios');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Allow all origins (for testing)
//         methods: ['GET', 'POST']
//     }
// });

// app.get('/', (req, res) => {
//     res.send('Socket.io server is running');
// });

// let users = {}; // Store user locations

// async function getLocationName(lat, lng) {
//     try {
//         const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//         return response.data.display_name || "Unknown Location";
//     } catch (error) {
//         console.error("Error fetching location name:", error);
//         return "Unknown Location";
//     }
// }

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
    
//     socket.on('updateLocation', async (data) => {
//         const locationName = await getLocationName(data.lat, data.lng);
//         users[socket.id] = { ...data, locationName };
//         io.emit('locationUpdate', users);
//     });
    
//     socket.on('disconnect', () => {
//         delete users[socket.id];
//         io.emit('locationUpdate', users);
//     });
// });

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// Backend (server.js)
// const express = require('express');
// const http = require('http');
// const axios = require('axios');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Allow all origins (for testing)
//         methods: ['GET', 'POST']
//     }
// });

// app.get('/', (req, res) => {
//     res.send('Socket.io server is running');
// });

// let users = {}; // Store user locations

// async function getLocationName(lat, lng) {
//     try {
//         const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//         return response.data.display_name || "Unknown Location";
//     } catch (error) {
//         console.error("Error fetching location name:", error);
//         return "Unknown Location";
//     }
// }

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
    
//     socket.on('updateLocation', async (data) => {
//         const locationName = await getLocationName(data.lat, data.lng);
//         users[socket.id] = { ...data, locationName };
//         io.emit('locationUpdate', users);
//     });
    
//     socket.on('disconnect', () => {
//         delete users[socket.id];
//         io.emit('locationUpdate', users);
//     });
// });

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));







// Backend (server.js)
// const express = require('express');
// const http = require('http');
// const axios = require('axios');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Allow all origins (for testing)
//         methods: ['GET', 'POST']
//     }
// });

// app.get('/', (req, res) => {
//     res.send('Socket.io server is running');
// });

// let users = {}; // Store user locations

// async function getLocationName(lat, lng) {
//     try {
//         const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//         return response.data.display_name || "Unknown Location";
//     } catch (error) {
//         console.error("Error fetching location name:", error);
//         return "Unknown Location";
//     }
// }

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
    
//     socket.on('updateLocation', async (data) => {
//         const locationName = await getLocationName(data.lat, data.lng);
//         users[socket.id] = { ...data, locationName };
//         io.emit('locationUpdate', users);
//     });
    
//     socket.on('disconnect', () => {
//         delete users[socket.id];
//         io.emit('locationUpdate', users);
//     });
// });

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));






// const express = require('express');
// const http = require('http');
// const axios = require('axios');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Allow all origins (for testing)
//         methods: ['GET', 'POST']
//     }
// });

// app.get('/', (req, res) => {
//     res.send('Socket.io server is running');
// });

// let users = {}; // Store user locations

// async function getLocationName(lat, lng) {
//     try {
//         const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//         return response.data.display_name || "Unknown Location";
//     } catch (error) {
//         console.error("Error fetching location name:", error);
//         return "Unknown Location";
//     }
// }

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
    
//     socket.on('updateLocation', async (data) => {
//         const locationName = await getLocationName(data.lat, data.lng);
//         users[socket.id] = { ...data, locationName };
//         io.emit('locationUpdate', users);
//     });
    
//     socket.on('disconnect', () => {
//         delete users[socket.id];
//         io.emit('locationUpdate', users);
//     });
// });

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// // Backend (server.js)
// const express = require('express');
// const http = require('http');
// const axios = require('axios');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Allow all origins (for testing)
//         methods: ['GET', 'POST']
//     }
// });

// app.get('/', (req, res) => {
//     res.send('Socket.io server is running');
// });

// let users = {}; // Store user locations

// async function getLocationName(lat, lng) {
//     try {
//         const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//         return response.data.display_name || "Unknown Location";
//     } catch (error) {
//         console.error("Error fetching location name:", error);
//         return "Unknown Location";
//     }
// }

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
    
//     socket.on('updateLocation', async (data) => {
//         const locationName = await getLocationName(data.lat, data.lng);
//         users[socket.id] = { ...data, locationName };
//         io.emit('locationUpdate', users);
//     });
    
//     socket.on('disconnect', () => {
//         delete users[socket.id];
//         io.emit('locationUpdate', users);
//     });
// });

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));











// Backend (server.js)
const express = require('express');
const http = require('http');
const axios = require('axios');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
});

app.get('/', (req, res) => {
    res.send('Socket.io server is running');
});

let users = {}; // Store user locations

async function getLocationName(lat, lng) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        return response.data.display_name || "Unknown Location";
    } catch (error) {
        console.error("Error fetching location name:", error);
        return "Unknown Location";
    }
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('updateLocation', async (data) => {
        const locationName = await getLocationName(data.lat, data.lng);
        users[socket.id] = { ...data, locationName };
        io.emit('locationUpdate', users);
    });
    
    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('locationUpdate', users);
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

