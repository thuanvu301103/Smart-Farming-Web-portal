import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your WebSocket server URL

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

export default socket;