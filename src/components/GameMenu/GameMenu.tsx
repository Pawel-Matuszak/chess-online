import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";
import Button from "../Common/Button";

const GameMenu = () => {
  const [code, setCode] = useState("");
  const [showJoinGame, setShowJoinGame] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { roomId, message } = useAppSelector((state) => state.global);

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
        <Button onClick={() => onJoinGame()}>Join</Button>
      </div>
      <div className="flex  flex-col items-center justify-start">
        <Button onClick={() => onCreateGame()}>Create game</Button>
        {!showJoinGame && roomId && (
          <div className="m-2  text-center" onClick={copyToClipboard}>
            <div className="flex cursor-pointer items-center text-lg">
              <p className="mx-1">
                Your game code is: <span className="font-bold">{roomId}</span>
              </p>
              <BiCopy />
            </div>
            {isCopied && <p>Copied to clipboard!</p>}
          </div>
        )}
      </div>
      <div className="m-4">
        <p className="text-center font-bold text-red-600">{message}</p>
      </div>
    </div>
  );
};

export default GameMenu;
