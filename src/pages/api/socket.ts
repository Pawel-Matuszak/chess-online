import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("socket.io already running");
    res.end();
    return;
  }
  console.log("*First use, starting socket.io");

  const io = new Server(res.socket.server, {
    path: "/api/socket_io",
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("message-send", (message) => {
      socket.broadcast.emit("message-update", message);
    });
  });

  res.socket.server.io = io;

  res.end();
}
