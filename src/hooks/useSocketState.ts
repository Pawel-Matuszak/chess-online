import { useEffect, useState } from "react";
import { socket } from "~/utils/socket";

export const useSocketState = () => {
  const [isConnected, setIsConnected] = useState<"true" | "false" | "loading">(
    "loading"
  );

  useEffect(() => {
    function onConnect() {
      setIsConnected("true");
    }

    function onDisconnect() {
      setIsConnected("false");
    }

    socket.on("connect", onConnect);
    socket.on("connect_error", onDisconnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onDisconnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return { isConnected };
};
