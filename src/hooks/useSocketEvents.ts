import { useEffect } from "react";
import { socket } from "~/utils/socket";

export interface Event {
  name: string;
  handler: (...args: unknown[]) => unknown;
}

export function useSocketEvents(events: Event[]) {
  useEffect(() => {
    for (const event of events) {
      socket.on(event.name, event.handler);
    }

    return function () {
      for (const event of events) {
        socket.off(event.name);
      }
    };
  }, []);
}
