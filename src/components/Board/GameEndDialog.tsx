import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useAppSelector } from "~/utils/hooks";
import Button from "../Common/Button";

const GameEndDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { playerColor } = useAppSelector((state) => state.board);
  const { gameState, gameStateMessage, gameWinner } = useAppSelector(
    (state) => state.global
  );

  useEffect(() => {
    if (gameState === "ended") {
      setIsOpen(true);
    }
  }, [gameState]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50 bg-background-secondary text-text-primary"
    >
      {gameWinner && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="flex w-full max-w-sm  flex-col items-center rounded bg-white p-8">
            <Dialog.Title className="text-2xl font-bold">
              {gameWinner == "d"
                ? "Draw"
                : gameWinner == playerColor
                ? "You won"
                : "You lost"}
            </Dialog.Title>
            <Dialog.Description className="text-lg">
              {gameStateMessage}
            </Dialog.Description>

            <Button onClick={() => setIsOpen(false)} className="mt-3 p-1 px-4">
              Close
            </Button>
          </Dialog.Panel>
        </div>
      )}
    </Dialog>
  );
};

export default GameEndDialog;
