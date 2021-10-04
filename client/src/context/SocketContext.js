import React from 'react';
import { io } from 'socket.io-client';

console.log(localStorage.token ? localStorage.token : null);
export const socket = io.connect('http://localhost:5000', {
    query: { token: localStorage.token ? localStorage.token : null }
});


const SocketContext = React.createContext(socket);
export default SocketContext