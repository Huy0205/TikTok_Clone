import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { auth } = useContext(AuthContext);

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_SOCKET_IO_URL, { withCredentials: true });
        setSocket(newSocket);

        if (auth?.user?.tiktokId) {
            newSocket.emit('registerUser', auth.user.tiktokId);
        }

        return () => {
            newSocket.disconnect();
        };
    }, [auth?.user?.tiktokId]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
