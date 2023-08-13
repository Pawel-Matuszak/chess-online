import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { setIsDrawProposed } from "~/state/globalSlice";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";
import Button from "../Common/Button";
import NewGameDialog from "./NewGameDialog";

const GameMenu = () => {
  const [code, setCode] = useState("");
  const [showJoinGame, setShowJoinGame] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const {
    roomId,
    message,
    gameState,
    isDrawProposed,
    isDrawProposalRecieved,
    drawResponseMessage,
  } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

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

  const onAbortGame = () => {
    socket.emit("abort-game");
  };

  const onProposeDraw = () => {
    dispatch(setIsDrawProposed(true));
    socket.emit("propose-draw", roomId);
  };

  const onResponseDraw = (response: boolean) => {
    socket.emit("propose-draw-response", roomId, response);
  };

  return (
    <>
      {gameState == "started" && (
        <div>
          <Button onClick={onAbortGame}>abort game</Button>
          {drawResponseMessage ? (
            <>Draw declined</>
          ) : isDrawProposed ? (
            <>Draw proposed</>
          ) : isDrawProposalRecieved ? (
            <>
              <div>Draw?</div>
              <Button onClick={() => onResponseDraw(true)}>Accept</Button>
              <Button onClick={() => onResponseDraw(false)}>Decline</Button>
            </>
          ) : (
            <Button onClick={onProposeDraw}>propose draw</Button>
          )}
        </div>
      )}
      {gameState == "ended" && <div>new game / rematch</div>}
      {(gameState === "initial" || gameState == "joined") && (
        <>
          <div className="w-full rounded-md   p-4">
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
            <div className="flex  flex-col items-center justify-start">
              <Button onClick={() => onCreateGame()}>New game</Button>
              <NewGameDialog />
              {!showJoinGame && roomId && (
                <div className="m-2  text-center" onClick={copyToClipboard}>
                  <div className="flex cursor-pointer items-center text-lg">
                    <p className="mx-1">
                      Your game code is:{" "}
                      <span className="font-bold">{roomId}</span>
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
        </>
      )}
    </>
  );
};

export default GameMenu;
