import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Color } from "chess.js";
import { INITIAL_FEN } from "~/pages/api/socket";
import { setGameFen, setGamePgn, setPlayerColor } from "~/state/boardSlice";
import {
  setDrawResponseMessage,
  setGameState,
  setGameStateMessage,
  setIsDrawProposalRecieved,
  setIsDrawProposed,
  setIsRematchProposalRecieved,
  setIsRematchProposed,
  setMessage,
  setRematchResponseMessage,
} from "~/state/globalSlice";
import { GameState, IBoardSlice, IGlobalSlice } from "~/types";

interface Props {
  dispatch: ThunkDispatch<IGlobalSlice | IBoardSlice, void, AnyAction>;
  gameState?: GameState;
  gamePgn?: string;
  gameFen?: string;
  playerColor?: Color;
}

export const setGameInit = ({
  gameState = "initial",
  gamePgn = "",
  gameFen = INITIAL_FEN,
  playerColor = "w",
  dispatch,
}: Props) => {
  dispatch(setGamePgn(gamePgn));
  dispatch(setGameFen(gameFen));
  dispatch(setPlayerColor(playerColor));
  dispatch(setGameState(gameState));
  dispatch(setGameStateMessage(""));
  dispatch(setMessage(""));
  dispatch(setIsDrawProposed(false));
  dispatch(setIsDrawProposalRecieved(false));
  dispatch(setIsRematchProposalRecieved(false));
  dispatch(setIsRematchProposed(false));
  dispatch(setDrawResponseMessage(""));
  dispatch(setRematchResponseMessage(""));
};
