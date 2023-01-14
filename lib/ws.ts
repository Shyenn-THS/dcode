import socketIOClient from 'socket.io-client';

const WS = process.env.WEBSERVER || 'http://localhost:5000';
export const ws = socketIOClient(WS);
