'use client';

import { ClientToServerEvents, ServerToClientEvents } from '@/types/socketio';
import { useState, useEffect } from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';

// Custom hook to manage the socket connection
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create the socket instance
    const socketInstance: Socket<ServerToClientEvents, ClientToServerEvents> =
      ClientIO(process.env.NEXT_PUBLIC_SITE_URL || 'ws://localhost:3000', {
        path: '/api/socket/io',
        addTrailingSlash: false,
      });

    // Event listeners for socket connection
    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Set the socket instance in state
    setSocket(socketInstance);

    // Cleanup function to disconnect the socket when component unmounts
    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
