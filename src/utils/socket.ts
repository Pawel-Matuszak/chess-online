import { io } from "socket.io-client";

export const socket = io({
  path: "/api/socket_io",
  autoConnect: false,
});
