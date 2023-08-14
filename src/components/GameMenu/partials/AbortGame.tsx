import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { BsFlag } from "react-icons/bs";
import Button from "~/components/Common/Button";
import CloseModalBtn from "~/components/Common/CloseModalBtn";

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
      <IconButton
        className="h-12 w-12 text-2xl"
        onClick={() => setIsOpen(true)}
        tooltip="Abort"
      >
        <BsFlag />
      </IconButton>
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 ">
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
                <Dialog.Title className="mb-3 text-2xl font-bold">
                  <h3>Abort game?</h3>
                </Dialog.Title>
                <Dialog.Description className="my-5 flex gap-4 text-lg">
                  <Button onClick={onAbortGame} className="m-2 px-3 py-1">
                    Abort
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="m-2 rounded-md bg-transparent px-3 py-1 text-text-primary opacity-60 "
                  >
                    Cancel
                  </Button>
                </Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AbortGame;
