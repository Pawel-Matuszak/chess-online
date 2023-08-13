import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { BsFlag } from "react-icons/bs";
import Button from "~/components/Common/Button";
import IconButton from "~/components/Common/IconButton";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

const AbortGame = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { roomId } = useAppSelector((state) => state.global);
  const { playerColor } = useAppSelector((state) => state.board);

  const onAbortGame = () => {
    socket.emit("abort-game", roomId, playerColor);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton className="text-2xl" onClick={() => setIsOpen(true)}>
        <BsFlag />
      </IconButton>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50  text-text-primary"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="flex w-full max-w-sm  flex-col items-center rounded bg-background-secondary p-8 text-text-primary text-opacity-80">
            <Dialog.Title className="mb-3 text-2xl font-bold">
              Abort game?
            </Dialog.Title>
            <Dialog.Description className=" text-lg">
              <Button onClick={onAbortGame} className="m-2 px-3 py-1">
                Abort
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="m-2 bg-transparent text-text-primary opacity-60"
              >
                Cancel
              </Button>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default AbortGame;
