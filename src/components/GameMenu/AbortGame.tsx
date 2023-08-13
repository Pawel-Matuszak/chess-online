import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";
import Button from "../Common/Button";

const AbortGame = () => {
  const dispatch = useAppDispatch();
  const { roomId } = useAppSelector((state) => state.global);
  const { playerColor } = useAppSelector((state) => state.board);

  const onAbortGame = () => {
    socket.emit("abort-game", roomId, playerColor);
  };

  return (
    <div>
      <Button onClick={onAbortGame}>abort game</Button>
    </div>
  );
};

export default AbortGame;
