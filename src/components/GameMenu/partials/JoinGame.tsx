import { useState } from "react";
import Button from "~/components/Common/Button";
import { setMessage } from "~/state/globalSlice";
import { api } from "~/utils/api";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

const JoinGame = () => {
  const [code, setCode] = useState("");
  const { userId } = useAppSelector((state) => state.global);
  const { mutateAsync } = api.main.joinRoom.useMutation();
  const dispatch = useAppDispatch();

  const onJoinGame = async () => {
    const { status, message } = await mutateAsync({ roomId: code, userId });
    dispatch(setMessage(!status ? message : ""));
    if (status) socket.emit("join-game", code);
  };
  return (
    <div className="my-4 flex w-full items-center justify-center">
      <input
        className="m-2 rounded-sm border-none bg-text-primary p-2 text-background-primary outline-none"
        type="text"
        placeholder="Join Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button onClick={() => onJoinGame()}>Join</Button>
    </div>
  );
};

export default JoinGame;
