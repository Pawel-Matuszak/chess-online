import { Chess, Square } from "chess.js";
import { useCallback, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { setGameFen, setGamePgn } from "~/state/boardSlice";
import {
  setDrawResponseMessage,
  setIsDrawProposalRecieved,
  setIsDrawProposed,
} from "~/state/globalSlice";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";
import GuestIcon from "./partials/GuestIcon";
import PlayerIcon from "./partials/PlayerIcon";

const Board = () => {
  const { roomId, gameState, drawResponseMessage } = useAppSelector(
    (state) => state.global
  );
  const { fen, pgn, playerColor, settings } = useAppSelector(
    (state) => state.board
  );
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

  //load updated game
  useEffect(() => {
    const gameCopy = copyGame();
    if (fen != game.fen()) gameCopy.load(fen);

    if (pgn != game.pgn()) gameCopy.loadPgn(pgn);

    setGame(gameCopy);
  }, [pgn, fen]);

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

    clearMoveClick();
    saveNewGameState(roomId, gameCopy);

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

      saveNewGameState(roomId, gameCopy);

      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  //promotion on click
  function onPromotionPieceSelect(piece?: PromotionPieceOption) {
    if (piece) {
      const gameCopy = copyGame();
      gameCopy.move({
        from: moveFrom,
        to: moveTo!,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });
      saveNewGameState(roomId, gameCopy);
    }

    clearMoveClick();
    setShowPromotionDialog(false);
    return true;
  }

  //promotion on drop
  const onPromotionCheck = (
    sourceSquare: Square,
    targetSquare: Square,
    piece: any
  ): boolean => {
    setMoveFrom(sourceSquare);
    setMoveTo(targetSquare);
    return (
      playerColor == game.turn() &&
      ((piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8") ||
        (piece === "bP" &&
          sourceSquare[1] === "2" &&
          targetSquare[1] === "1")) &&
      Math.abs(sourceSquare.charCodeAt(0) - targetSquare.charCodeAt(0)) <= 1
    );
  };

  const clearMoveClick = () => {
    setMoveFrom("");
    setMoveTo(null);
    setOptionSquares({});
  };

  const saveNewGameState = (roomId: string, gameCopy: Chess) => {
    setGame(gameCopy);
    if (gameState == "initial") {
      dispatch(setGameFen(gameCopy.fen()));
      dispatch(setGamePgn(gameCopy.pgn()));
      return;
    }
    if (gameState == "started")
      socket.emit("game-update", roomId, gameCopy.fen(), gameCopy.pgn());
  };

  const restartDrawRequest = () => {
    dispatch(setIsDrawProposed(false));
    dispatch(setIsDrawProposalRecieved(false));
    dispatch(setDrawResponseMessage(""));
  };

  useEffect(() => {
    if (drawResponseMessage) restartDrawRequest();
  }, [pgn]);

  return (
    <div className="relative w-3/4 max-w-2xl max-sm:w-11/12">
      <GuestIcon />
      <PlayerIcon />
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={playerColor == "w" ? "white" : "black"}
        showBoardNotation={showCoordinates}
        showPromotionDialog={showPromotionDialog}
        clearPremovesOnRightClick
        arePremovesAllowed={false} //todo premoves :(
        animationDuration={settings.animationDuration}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        customSquareStyles={{
          ...optionSquares,
          ...rightClickedSquares,
        }}
        onPromotionPieceSelect={onPromotionPieceSelect}
        onPromotionCheck={onPromotionCheck}
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
    </div>
  );
};

export default Board;
