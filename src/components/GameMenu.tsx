import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

const GameMenu = () => {
  const [code, setCode] = useState("");
  const [showJoinGame, setShowJoinGame] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { roomId, gameState } = useAppSelector((state) => state.global);

  const onCreateGame = () => {
    socket.emit("create-game");
    setShowJoinGame(false);
  };

  const onJoinGame = () => {
    socket.emit("join-game", code);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(roomId);
    setIsCopied(true);
  };

  useEffect(() => {
    setIsCopied(false);
  }, [showJoinGame, code, roomId]);

  return (
    <div className="rounded-md border-2 border-white p-4">
      <div className="m-4">
        <input
          className="m-2 rounded-sm border-none p-2 text-black outline-none"
          type="text"
          placeholder="Join Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={() => onJoinGame()}
          className="rounded-sm bg-yellow-300 p-2 font-semibold text-slate-900"
        >
          Join
        </button>
      </div>
      <div className="flex  flex-col items-center justify-start">
        <button
          onClick={() => onCreateGame()}
          className="rounded-sm bg-yellow-300 p-2 font-semibold text-slate-900 "
        >
          Create game
        </button>
        {!showJoinGame && roomId && (
          <div className="m-2  text-center" onClick={copyToClipboard}>
            <div className="flex cursor-pointer items-center  text-lg">
              <p className="mx-1">
                Your game code is: <span className="font-bold">{roomId}</span>
              </p>
              <BiCopy />
            </div>
            {isCopied && <p className="">Copied to clipboard!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMenu;
