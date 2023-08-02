import { NextApiRequest } from "next";
import { Server } from "socket.io";
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
    return !room || room.size == 0 ? true : false;
  };

  const checkIfRoomIsFull = (id: string) => {
    const room = getRoom(id);
    return room && room.size >= 2 ? true : false;
  };

  io.on("connection", (socket) => {
    socket.on("join-game", async (id: string) => {
      if (checkIfRoomExists(id)) {
        socket.emit("joined-game", {
          status: false,
          message: "Room not found",
        });
        return;
      }
      if (checkIfRoomIsFull(id)) {
        socket.emit("joined-game", { status: false, message: "Room full" });
        return;
      }

      await socket.join(id);
      socket.emit("joined-game", { status: true });
    });

    socket.on("create-game", async () => {
      let gameId;
      while (gameId == null || gameId.length !== 5) {
        gameId = generateGameId();
      }

      await socket.join(gameId);
      socket.emit("created-game", { status: true, id: gameId });
    });

    socket.on("game-update", (id: string, gameString: string) => {
      io.to(id).emit("game-update", gameString);
    });
  });

  if (res.socket) res.socket.server.io = io;

  res.end();
}
