import { setIsDrawProposed } from "~/state/globalSlice";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";
import Button from "../Common/Button";

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
    <div>
      {drawResponseMessage ? (
        <div>Draw declined</div>
      ) : isDrawProposed ? (
        <div>Draw proposed</div>
      ) : isDrawProposalRecieved ? (
        <div>
          <div>Draw?</div>
          <Button onClick={() => onResponseDraw(true)}>Accept</Button>
          <Button onClick={() => onResponseDraw(false)}>Decline</Button>
        </div>
      ) : (
        <Button onClick={onProposeDraw}>propose draw</Button>
      )}
    </div>
  );
};

export default DrawComponent;
