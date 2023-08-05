import { useState } from "react";
import { useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

const GameMenu = () => {
  const [code, setCode] = useState("");
  const [showJoinGame, setShowJoinGame] = useState(true);
  const { roomId, gameState } = useAppSelector((state) => state.global);

  const onCreateGame = () => {
    socket.emit("create-game");
    setShowJoinGame(false);
  };

  const onJoinGame = () => {
    socket.emit("join-game", code);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => onCreateGame()}
          className="rounded-sm bg-yellow-300 p-2 font-semibold text-slate-900 "
        >
          Create game
        </button>
        {!showJoinGame && roomId && (
          <div className="">Your game code is: {roomId}</div>
        )}
      </div>

      <div className="">
        <p>Join game</p>
        <input
          className="text-black"
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={() => onJoinGame()}>Join</button>
      </div>
    </>
  );
};

export default GameMenu;
