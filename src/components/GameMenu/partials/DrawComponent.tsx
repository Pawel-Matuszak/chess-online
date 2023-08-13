import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import IconButton from "~/components/Common/IconButton";
import { setIsDrawProposed } from "~/state/globalSlice";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

const DrawComponent = () => {
  const dispatch = useAppDispatch();
  const {
    roomId,
    gameState,
    isDrawProposed,
    isDrawProposalRecieved,
    drawResponseMessage,
  } = useAppSelector((state) => state.global);

  const onProposeDraw = () => {
    dispatch(setIsDrawProposed(true));
    socket.emit("propose-draw", roomId);
  };

  const onResponseDraw = (response: boolean) => {
    socket.emit("propose-draw-response", roomId, response);
  };

  return (
    <div className="flex items-center justify-center">
      {drawResponseMessage ? (
        <>Draw declined</>
      ) : isDrawProposed ? (
        <>Draw proposed</>
      ) : isDrawProposalRecieved ? (
        <div>
          <div className="text-center">Accept draw?</div>
          <div className="flex items-center justify-center ">
            <IconButton
              onClick={() => onResponseDraw(true)}
              className="px-2 py-0 text-green-500"
            >
              <AiOutlineCheck />
            </IconButton>
            <IconButton
              onClick={() => onResponseDraw(false)}
              className="px-2 py-0 text-red-500"
            >
              <AiOutlineClose />
            </IconButton>
          </div>
        </div>
      ) : (
        <IconButton onClick={onProposeDraw} className="font- text-xl">
          1/2
        </IconButton>
      )}
    </div>
  );
};

export default DrawComponent;
