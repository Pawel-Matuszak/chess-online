import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Button from "~/components/Common/Button";
import IconButton from "~/components/Common/IconButton";
import { setIsRematchProposed } from "~/state/globalSlice";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

const Rematch = () => {
  const {
    rematchResponseMessage,
    isRematchProposed,
    isRematchProposalRecieved,
    roomId,
  } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  const onResponseRematch = (response: boolean) => {
    socket.emit("propose-rematch-response", roomId, response);
  };

  const onProposeRematch = () => {
    dispatch(setIsRematchProposed(true));
    socket.emit("propose-rematch", roomId);
  };

  return (
    <div className="flex items-center justify-center">
      {rematchResponseMessage ? (
        <>Rematch declined</>
      ) : isRematchProposed ? (
        <>Rematch request send</>
      ) : isRematchProposalRecieved ? (
        <div>
          <div className="text-center">Accept rematch?</div>
          <div className="flex items-center justify-center ">
            <IconButton
              onClick={() => onResponseRematch(true)}
              className="px-2 py-0 text-green-500"
            >
              <AiOutlineCheck />
            </IconButton>
            <IconButton
              onClick={() => onResponseRematch(false)}
              className="px-2 py-0 text-red-500"
            >
              <AiOutlineClose />
            </IconButton>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => {
            onProposeRematch();
          }}
        >
          Rematch
        </Button>
      )}
    </div>
  );
};

export default Rematch;
