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

      if (getRoom(id)?.size === 2)
        io.in(id).emit("start-game", {
          status: true,
          message: "Game started",
        });
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

    const gameUpdateHandler = (id: string, gameString: string) => {
      io.to(id).emit("game-update", gameString);
    };

    socket.on("join-game", joinGameHandler);
    socket.on("create-game", createGameHandler);
    socket.on("game-update", gameUpdateHandler);
  });

  if (res.socket) res.socket.server.io = io;

  res.end();
}
