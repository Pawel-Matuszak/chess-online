import { NextApiRequest } from "next";
import { Server } from "socket.io";
import { NextApiResponseWithSocket } from "~/types";

export default function handler(
  _: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket?.server.io) {
    console.log("socket.io already running");
    res.end();
    return;
  }
  console.log("*First use, starting socket.io");

  const io = new Server(res.socket?.server, {
    path: "/api/socket_io",
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("message", (message) => {
      io.emit("message", message);
    });

    socket.on("create-game", async (id: string) => {
      await socket.join(id);
      //room size
      console.log(io.of("/").adapter.rooms.get(id)?.size);
    });

    socket.on("game-update", (id: string, gameString: string) => {
      console.log("game-update", id, gameString);
      io.to(id).emit("game-update", gameString);
    });
  });

  if (res.socket) res.socket.server.io = io;

  res.end();
}
