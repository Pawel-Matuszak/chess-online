import { Chess, Color } from "chess.js";
import { NextApiRequest } from "next";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { NextApiResponseWithSocket } from "~/types";

export const INITIAL_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// const INITIAL_FEN = "8/P3k3/8/8/2K5/8/8/8 w - - 0 1";

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

    const gameUpdateHandler = (
      id: string,
      fenAfter: string,
      pgnAfter: string
    ) => {
      const chess = new Chess(fenAfter);
      chess.loadPgn(pgnAfter);
      if (chess.isGameOver()) {
        io.to(id).emit("game-ended", gameEndHandler(chess));
      }

      io.to(id).emit("game-updated", fenAfter, pgnAfter);
    };

    const gameEndHandler = (
      chess: Chess
    ): { winner?: Color | "d"; message: string } => {
      return {
        winner: chess.isCheckmate() ? (chess.turn() === "w" ? "b" : "w") : "d",
        message: chess.isCheckmate()
          ? "Checkmate"
          : chess.isStalemate()
          ? "Stalemate"
          : chess.isInsufficientMaterial()
          ? "Insufficient material"
          : chess.isThreefoldRepetition()
          ? "Threefold repetition"
          : "",
      };
    };

    const gameAbortHandler = (id: string, playerColor: Color) => {
      io.to(id).emit(
        "game-aborted",
        playerColor == "w" ? "b" : "w",
        "Game aborted"
      );
    };

    const proposeDrawHandler = (id: string) => {
      socket.broadcast.to(id).emit("draw-proposed", "draw?");
    };

    const proposeDrawResponseHandler = (id: string, response: boolean) => {
      if (!response) {
        socket.broadcast.to(id).emit("draw-proposal-decline", "Draw declined");
        return;
      }

      io.to(id).emit("game-ended", {
        winner: "d",
        message: "Draw by agreement",
      });
    };

    socket.on("join-game", joinGameHandler);
    socket.on("create-game", createGameHandler);
    socket.on("game-update", gameUpdateHandler);
    socket.on("abort-game", gameAbortHandler);
    socket.on("propose-draw", proposeDrawHandler);
    socket.on("propose-draw-response", proposeDrawResponseHandler);
  });

  if (res.socket) res.socket.server.io = io;

  res.end();
}
