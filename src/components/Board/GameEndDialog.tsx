import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useAppSelector } from "~/utils/hooks";
import CloseModalBtn from "../Common/CloseModalBtn";

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
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
        {gameWinner && (
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex min-h-[150px] w-full max-w-sm flex-col items-center rounded bg-background-dialog p-2 text-text-primary text-opacity-80">
                <CloseModalBtn onClick={() => setIsOpen(false)} />
                <Dialog.Title className="text-2xl font-bold">
                  <h3>
                    {gameWinner == "d"
                      ? "Draw"
                      : gameWinner == playerColor
                      ? "You won"
                      : "You lost"}
                  </h3>
                </Dialog.Title>
                <Dialog.Description className="my-1 text-lg">
                  {gameStateMessage}
                </Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        )}
      </Dialog>
    </Transition>
  );
};

export default GameEndDialog;
