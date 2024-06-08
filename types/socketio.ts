import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from 'socket.io';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  chunkTranscript: (transcript: string) => void;
  metadata: (data: string) => void;
}

export interface ClientToServerEvents {
  transcribeChunk: (audioChunk: Blob) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

