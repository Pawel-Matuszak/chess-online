import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import Button from "~/components/Common/Button";
import Tooltip from "~/components/Common/Tooltip";
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
    if (isCopied) setTimeout(() => setIsCopied(false), 1000);
  }, [isCopied]);

  return (
    <div className="flex  h-24 flex-col items-center justify-start">
      <Button onClick={onCreateGame}>New game</Button>
      <div className="relative m-2 text-center" onClick={copyToClipboard}>
        {!showJoinGame && roomId && (
          <>
            <div className="left- flex cursor-pointer items-center text-lg ">
              <p className="mx-1">
                Your game code is: <span className="font-bold">{roomId}</span>
              </p>
              <BiCopy />
            </div>
            <Tooltip
              open={isCopied}
              enterStyles="delay-0 duration-300"
              leaveStyles="duration-200"
              styles="left-auto -right-4 -top-7"
            >
              Copied!
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default NewGame;
