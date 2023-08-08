import { useAppSelector } from "~/utils/hooks";

const HistoryComponent = () => {
  const { pgn } = useAppSelector((state) => state.board);

  const moves = pgn
    .split(/\d+\./)
    .filter(Boolean)
    .map((move) => move.trim())
    .filter((move) => !move.includes("["));

  return (
    <div>
      {moves.map((move, index) => (
        <div key={index}>
          <span>{`${index + 1}.`}</span>
          <span>{move.split(" ")[0]}</span>
          <span>{move.split(" ")[1]}</span>
        </div>
      ))}
    </div>
  );
};

export default HistoryComponent;
