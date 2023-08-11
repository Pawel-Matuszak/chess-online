import { useAppSelector } from "~/utils/hooks";

const HistoryComponent = () => {
  const { pgn } = useAppSelector((state) => state.board);

  const moves = pgn
    .split(/\d+\./)
    .filter(Boolean)
    .map((move) => move.trim())
    .filter((move) => !move.includes("["));

  return (
    <div className=" col-span-1 my-4 h-96 w-full overflow-y-auto bg-background-secondary ">
      <table className=" w-full table-auto ">
        <tbody className="grid w-full grid-flow-row grid-rows-3">
          {moves.map((move, index) => (
            <tr
              key={index}
              className="grid grid-cols-3  px-3 last:border-none  even:bg-background-primary "
            >
              <td className="p-2">{`${index + 1}.`}</td>
              <td className="p-2 font-bold">{move.split(" ")[0]}</td>
              <td className="p-2 font-bold">{move.split(" ")[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryComponent;
