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
      {gameState == "started" && (
        <div className="m-2 flex items-center justify-start gap-2">
          <AbortGame />
          <DrawComponent />
        </div>
      )}
      {gameState == "ended" && (
        <div className="m-2 flex items-center justify-center gap-4">
          <Button
            onClick={() => {
              setGameInit({ dispatch });
            }}
          >
            New Game
          </Button>
          <Rematch />
        </div>
      )}
      {(gameState === "initial" || gameState == "joined") && (
        <div className="w-full rounded-md px-4">
          <JoinGame />
          <NewGame />
          <div className="m-4">
            <p className="text-center font-bold text-red-600">{message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GameMenu;
