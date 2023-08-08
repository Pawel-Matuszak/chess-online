import { Chess, Square } from "chess.js";
import { useCallback, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { setGameFen } from "~/state/boardSlice";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";
import GameEndDialog from "./GameEndDialog";

const Board = () => {
  const { roomId, gameState } = useAppSelector((state) => state.global);
  const { fen, playerColor, settings } = useAppSelector((state) => state.board);
  const { showCoordinates, arePremovesAllowed } = useAppSelector(
    (state) => state.board.settings
  );

  const [game, setGame] = useState<Chess>(new Chess(fen));
  const [rightClickedSquares, setRightClickedSquares] = useState(
    {} as Record<Square, Record<any, any>>
  );
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const dispatch = useAppDispatch();

  const copyGame = useCallback(() => {
    return Object.assign(
      Object.create(Object.getPrototypeOf(game) as object),
      game
    ) as Chess;
  }, [game]);

  useEffect(() => {
    if (fen == game.fen()) return;
    const gameCopy = copyGame();
    gameCopy.load(fen);
    setGame(gameCopy);
  }, [fen, game, copyGame]);

  const onDrop = (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ) => {
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
  };

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (
      moves.length === 0 ||
      (gameState == "started" && game.turn() !== playerColor)
    ) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {} as Record<Square, any>;
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: Square) {
    setRightClickedSquares({} as Record<Square, Record<any, any>>);

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moveFromSquare = moveFrom as Square;
      const moves = game.moves({
        square: moveFromSquare,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const gameCopy = copyGame();
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);
      dispatch(setGameFen(gameCopy.fen()));
      if (gameState == "started")
        socket.emit("game-update", roomId, move.after);

      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece?: PromotionPieceOption) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      const gameCopy = copyGame();
      gameCopy.move({
        from: moveFrom,
        to: moveTo!,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });
      setGame(gameCopy);
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  return (
    <div className="w-3/4 max-w-2xl">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={playerColor == "w" ? "white" : "black"}
        showBoardNotation={showCoordinates}
        showPromotionDialog={showPromotionDialog}
        clearPremovesOnRightClick
        arePremovesAllowed
        animationDuration={settings.animationDuration}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        customSquareStyles={{
          ...optionSquares,
          ...rightClickedSquares,
        }}
        onPromotionPieceSelect={onPromotionPieceSelect}
        arePiecesDraggable={gameState !== "ended"}

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

      {/* end game dialog */}
      <GameEndDialog />
    </div>
  );
};

export default Board;
