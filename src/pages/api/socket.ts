import { Chess, Color } from "chess.js";
import { NextApiRequest } from "next";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { NextApiResponseWithSocket } from "~/types";

export default function handler(
  _: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket?.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket?.server, {
    path: "/api/socket_io",
    addTrailingSlash: false,
  });

  const generateGameId = () => {
    return (Math.random() + 1).toString(36).substring(7);
  };

  const getRoom = (id: string) => {
    return io.of("/").adapter.rooms.get(id);
  };

  const checkIfRoomExists = (id: string) => {
    const room = getRoom(id);
    return room ? true : false;
  };

  const checkIfRoomIsFull = (id: string) => {
    const room = getRoom(id);
    return room && room.size >= 2 ? true : false;
  };

  const leaveAllRooms = async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    for (const room of socket.rooms) {
      await socket.leave(room);
    }
  };

  const getAllUsersInRoom = (id: string) => {
    const room = getRoom(id);
    return room ? Array.from(room) : [];
  };

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  io.on("connection", (socket) => {
    const joinGameHandler = async (id: string) => {
      // console.log(getRoom(id));

      if (socket.rooms.has(id)) {
        socket.emit("joined-game", {
          status: false,
          message: "Already joined",
        });
        return;
      }

      if (!checkIfRoomExists(id)) {
        socket.emit("joined-game", {
          status: false,
          message: "Room not found",
        });
        return;
      }
      if (checkIfRoomIsFull(id)) {
        socket.emit("joined-game", {
          status: false,
          message: "Room full",
        });
        return;
      }

      await leaveAllRooms(socket);
      await socket.join(id);
      socket.emit("joined-game", {
        status: true,
        id,
        message: "Joined game successfully",
      });

      const clients = getAllUsersInRoom(id);
      if (clients.length === 2) {
        const roles = ["w", "b"];
        shuffleArray(roles);
        if (!clients[0] || !clients[1]) {
          io.to(id).emit("start-game", {
            status: false,
            message: "User not connected",
          });
          return;
        }
        // const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        const INITIAL_FEN = "k7/7Q/6Q1/8/8/4K3/8/8 w - - 0 1";

        socket.to(id).emit("start-game", {
          status: true,
          message: "Game started",
          playerColor: roles[1],
          gameFen: INITIAL_FEN,
        });
        socket.emit("start-game", {
          status: true,
          message: "Game started",
          playerColor: roles[0],
          gameFen: INITIAL_FEN,
        });
      }
    };

    const createGameHandler = async () => {
      let gameId;
      while (gameId == null || gameId.length !== 5) {
        gameId = generateGameId();
      }
      await leaveAllRooms(socket);
      await socket.join(gameId);
      socket.emit("created-game", { status: true, id: gameId });
    };

    const gameUpdateHandler = (id: string, fenAfter: string) => {
      let response: { winner?: Color | "d"; message: string };
      const chess = new Chess(fenAfter);
      if (chess.isGameOver()) {
        if (chess.isCheckmate()) {
          response = {
            winner: chess.turn() === "w" ? "b" : "w",
            message: "Checkmate",
          };
        } else {
          response = {
            winner: "d",
            message: "Draw",
          };
        }

        io.to(id).emit("game-ended", response);
      }

      io.to(id).emit("game-updated", fenAfter);
    };

    socket.on("join-game", joinGameHandler);
    socket.on("create-game", createGameHandler);
    socket.on("game-update", gameUpdateHandler);
  });

  if (res.socket) res.socket.server.io = io;

  res.end();
}
