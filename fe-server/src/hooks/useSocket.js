import React, { useState, useEffect } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:3004', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    auth: { token: 'your_jwt_token' },
    query: { userId: localStorage.getItem('userId') },
    timeout: 20000,
    forceNew: false
});

export const useSocket = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Listen for notifications from the server
        socket.on('receiveNotification', (data) => {
            console.log('Received notification:', data);
            //setNotifications((prev) => [...prev, data]);
        });

        return () => {
            socket.off('receiveNotification'); // Cleanup on unmount
        };
    }, []);

    return { notifications, socket };
};