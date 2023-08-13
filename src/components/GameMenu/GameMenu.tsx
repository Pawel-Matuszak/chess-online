import { setGameInit } from "~/utils/helpers";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import Button from "../Common/Button";
import AbortGame from "./partials/AbortGame";
import DrawComponent from "./partials/DrawComponent";
import JoinGame from "./partials/JoinGame";
import { default as NewGame } from "./partials/NewGame";
import Rematch from "./partials/Rematch";

const GameMenu = () => {
  const dispatch = useAppDispatch();
  const { message, gameState } = useAppSelector((state) => state.global);

  return (
    <>
      <div className="m-2 flex justify-start gap-4 align-middle">
        {gameState == "started" && <AbortGame />}
        {gameState == "started" && <DrawComponent />}
      </div>
      {gameState == "ended" && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => {
              setGameInit(dispatch);
            }}
          >
            New Game
          </Button>
          <Rematch />
        </div>
      )}
      {(gameState === "initial" || gameState == "joined") && (
        <>
          <div className="w-full rounded-md p-4">
            <JoinGame />
            <div className="flex  flex-col items-center justify-start">
              <NewGame />
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
