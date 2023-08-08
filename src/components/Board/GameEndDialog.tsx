import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useAppSelector } from "~/utils/hooks";

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
      className="relative z-50"
    >
      {gameWinner && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white">
            <Dialog.Title>
              {gameWinner == "d"
                ? "Draw"
                : gameWinner == playerColor
                ? "You won"
                : "You lost"}
            </Dialog.Title>
            <Dialog.Description>{gameStateMessage}</Dialog.Description>

            <button onClick={() => setIsOpen(false)}>Exit</button>
          </Dialog.Panel>
        </div>
      )}
    </Dialog>
  );
};

export default GameEndDialog;
