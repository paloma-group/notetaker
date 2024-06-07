import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  NextApiResponseServerIo,
  ServerToClientEvents,
  SocketData,
} from '@/types/socketio';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    console.log('Initializing new Socket.io server...');
    const path = '/api/socket/io';

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(httpServer, {
      path,
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      socket.on('transcribeChunk', (msg) => {
        console.log('Chunk received:', msg);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.io server already running.');
  }

  res.end('WebSocket setup complete.');
};

export default ioHandler;
