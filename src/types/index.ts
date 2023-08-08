import { Color } from "chess.js";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";

export interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

export interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export type GameState = "initial" | "joined" | "started" | "ended";

export interface IGlobalSlice {
  gameState: GameState;
  gameWinner: Color | "d" | null;
  gameStateMessage: string;
  roomId: string;
  message: string;
}

export interface IBoardSlice {
  fen: string;
  playerColor: Color;
  settings: {
    showCoordinates: boolean;
    arePremovesAllowed: boolean;
    animationDuration: 0 | 200 | 300 | 500;
  };
}
