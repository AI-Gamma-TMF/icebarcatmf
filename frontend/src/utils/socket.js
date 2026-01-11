import { io } from 'socket.io-client';

const REACT_APP_SOCKET_URL = process.env.REACT_APP_SOCKET_URL || ''

export const loginCountSocket = io(`${REACT_APP_SOCKET_URL}/userCount`, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: false
});

export const whaleAlertSocket = io(`${REACT_APP_SOCKET_URL}/admin_notification`, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: false
});

export const jackpotSocket = io(`${REACT_APP_SOCKET_URL}/jackpot-admin`, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: false
});