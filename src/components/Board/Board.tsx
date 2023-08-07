import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { setGameFen } from "~/state/boardSlice";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

const Board = () => {
  const { roomId, gameState } = useAppSelector((state) => state.global);
  const { fen, playerColor } = useAppSelector((state) => state.board);
  const { showCoordinates, arePremovesAllowed } = useAppSelector(
    (state) => state.board.settings
  );

  const [game, setGame] = useState<Chess>(new Chess(fen));
  const dispatch = useAppDispatch();
  const copyGame = () => {
    return Object.assign(
      Object.create(Object.getPrototypeOf(game) as object),
      game
    ) as Chess;
  };

  function onDrop(sourceSquare: string, targetSquare: string, piece: string) {
    if (gameState == "started" && playerColor !== game.turn()) return false;

    let move = null;
    const gameCopy: Chess = copyGame();

    try {
      move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });
    } catch (error) {}
    if (!move) return false;

    setGame(gameCopy);
    dispatch(setGameFen(gameCopy.fen()));
    if (gameState == "started") socket.emit("game-update", roomId, move.after);
    return true;
  }

  useEffect(() => {
    if (fen == game.fen()) return;
    const gameCopy = copyGame();
    gameCopy.load(fen);
    setGame(gameCopy);

    console.log("first");
  }, [fen]);

  return (
    <div className="w-3/4">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={playerColor == "w" ? "white" : "black"}
        isDraggablePiece={({ piece }) =>
          gameState == "started" ? piece.startsWith(playerColor) : true
        }
        showBoardNotation={showCoordinates}
        clearPremovesOnRightClick
        arePremovesAllowed
        // animationDuration

        // customSquare || customSquareStyles
        // customPremoveDarkSquareStyle
        // customPremoveLightSquareStyle
        // customPieces
        // customDropSquareStyle
        // customLightSquareStyle
        // customDarkSquareStyle
        // customBoardStyle
        // customArrowColor
      />
    </div>
  );
};

export default Board;
