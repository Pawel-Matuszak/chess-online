import { useEffect, useRef } from "react";
import { useAppSelector } from "~/utils/hooks";

const HistoryComponent = () => {
  const { pgn } = useAppSelector((state) => state.board);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContent = scrollContentRef.current;

    if (scrollContent) {
      scrollContent.scrollTop =
        scrollContent.scrollHeight - scrollContent.clientHeight;
    }
  }, [pgn]);

  const moves = pgn
    .split(/\d+\./)
    .filter(Boolean)
    .map((move) => move.trim())
    .filter((move) => !move.includes("["));

  return (
    <div
      ref={scrollContentRef}
      className="col-span-1 my-4 h-96 min-w-[340px]  overflow-y-auto bg-background-secondary scrollbar-thin  scrollbar-thumb-text-primary-1/3  scrollbar-thumb-rounded-lg"
    >
      <table className=" w-full table-auto ">
        <tbody className="grid w-full grid-flow-row grid-rows-3">
          {moves.map((move, index) => {
            const isLastMove = index === moves.length - 1;
            const moveWhite = move.split(" ")[0];
            const moveBlack = move.split(" ")[1];
            const selectedStyle = "bg-white bg-opacity-30  rounded-sm px-2";
            return (
              <tr
                key={index}
                className="grid grid-cols-2/3 px-3 text-center last:border-none  even:bg-background-primary even:bg-opacity-70"
              >
                <td className="p-2">{`${index + 1}.`}</td>
                <td className="p-2 font-bold">
                  <span
                    className={`${
                      isLastMove && moveWhite != "" && !moveBlack
                        ? selectedStyle
                        : ""
                    } p-1`}
                  >
                    {moveWhite}
                  </span>
                </td>
                <td className="p-2 font-bold ">
                  <span
                    className={`${
                      isLastMove && moveBlack ? selectedStyle : ""
                    } p-1`}
                  >
                    {moveBlack}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryComponent;
