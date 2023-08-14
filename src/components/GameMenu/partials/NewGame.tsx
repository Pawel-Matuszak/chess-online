import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import Button from "~/components/Common/Button";
import { useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

const NewGame = () => {
  const [showJoinGame, setShowJoinGame] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { roomId } = useAppSelector((state) => state.global);

  const onCreateGame = () => {
    socket.emit("create-game");
    setShowJoinGame(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(roomId);
    setIsCopied(true);
  };

  useEffect(() => {
    setIsCopied(false);
  }, [showJoinGame, roomId]);

  return (
    <>
      <div>
        <Button onClick={onCreateGame}>New game</Button>
      </div>
      {!showJoinGame && roomId && (
        <div className="m-2 text-center" onClick={copyToClipboard}>
          <div className="flex cursor-pointer items-center text-lg">
            <p className="mx-1">
              Your game code is: <span className="font-bold">{roomId}</span>
            </p>
            <BiCopy />
          </div>
          {isCopied && <p>Copied to clipboard!</p>}
        </div>
      )}
    </>
  );
};

export default NewGame;
