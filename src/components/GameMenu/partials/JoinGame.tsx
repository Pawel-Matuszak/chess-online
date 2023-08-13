import { useState } from "react";
import Button from "~/components/Common/Button";
import { socket } from "~/utils/socket";

const JoinGame = () => {
  const [code, setCode] = useState("");
  const onJoinGame = () => {
    socket.emit("join-game", code);
  };
  return (
    <div className="m-4">
      <input
        className="m-2 rounded-sm border-none bg-text-primary p-2 text-background-primary outline-none"
        type="text"
        placeholder="Join Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button onClick={() => onJoinGame()}>Join</Button>
    </div>
  );
};

export default JoinGame;
