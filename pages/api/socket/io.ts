import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  NextApiResponseServerIo,
  ServerToClientEvents,
  SocketData,
} from '@/types/socketio';
import {
  createClient,
  LiveTranscriptionEvents,
  LiveClient,
} from '@deepgram/sdk';

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY || '');

export const config = {
  api: {
    bodyParser: false,
  },
};

let keepAlive: NodeJS.Timeout;

const setupDeepgram = (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  const deepgram = deepgramClient.listen.live({
    model: 'nova-2',
    language: 'en',
    smart_format: true,
    punctuate: true,
  });

  if (keepAlive) clearInterval(keepAlive);
  keepAlive = setInterval(() => {
    console.log('deepgram: keepalive');
    deepgram.keepAlive();
  }, 10 * 1000);

  deepgram.addListener(LiveTranscriptionEvents.Open, async () => {
    console.log('deepgram: connected');

    deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {
      console.log('deepgram: transcript received');
      console.log('transcript sent to client');
      socket.emit('chunkTranscript', data.channel.alternatives[0].transcript);
    });

    deepgram.addListener(LiveTranscriptionEvents.Close, async () => {
      console.log('deepgram: disconnected');
      clearInterval(keepAlive);
      deepgram.finish();
    });

    deepgram.addListener(LiveTranscriptionEvents.Error, async (error) => {
      console.log('deepgram: error received');
      console.error(error);
    });

    deepgram.addListener(LiveTranscriptionEvents.Warning, async (warning) => {
      console.log('deepgram: warning received');
      console.warn(warning);
    });

    deepgram.addListener(LiveTranscriptionEvents.Metadata, (data) => {
      console.log('deepgram: metadata received');
      console.log('metadata sent to client');
      socket.emit('metadata', JSON.stringify({ metadata: data }));
    });
  });

  return deepgram;
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
      let deepgram: LiveClient | null = setupDeepgram(socket);

      socket.on('transcribeChunk', (audioChunk) => {
        console.log('Chunk received.');

        if (deepgram) {
          if (deepgram.getReadyState() === 1 /* OPEN */) {
            console.log('data sent to deepgram');
            deepgram.send(audioChunk);
          } else if (
            deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */
          ) {
            console.log("data couldn't be sent to deepgram");
            console.log('retrying connection to deepgram');
            /* Attempt to reopen the Deepgram connection */
            deepgram.finish();
            deepgram.removeAllListeners();
            deepgram = setupDeepgram(socket);
          } else {
            console.log("data couldn't be sent to deepgram");
          }
        } else {
          console.log('Deepgram was not initialized');
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (deepgram) {
          deepgram.finish();
          deepgram.removeAllListeners();
        }
        deepgram = null;
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.io server already running.');
  }

  res.end();
};

export default ioHandler;
