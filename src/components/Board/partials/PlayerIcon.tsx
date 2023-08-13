import { FaUser } from "react-icons/fa";
import { useAppSelector } from "~/utils/hooks";

const PlayerIcon = () => {
  const { gameState } = useAppSelector((state) => state.global);
  return (
    <div className="h-8">
      {(gameState == "joined" ||
        gameState == "started" ||
        gameState == "ended") && (
        <div className="m-1 flex items-center gap-2 text-lg">
          <FaUser /> You
        </div>
      )}
    </div>
  );
};

export default PlayerIcon;
