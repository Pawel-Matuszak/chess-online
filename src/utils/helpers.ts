import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import { INITIAL_FEN } from "~/pages/api/socket";
import { setGameFen, setGamePgn, setPlayerColor } from "~/state/boardSlice";
import {
  setGameState,
  setGameStateMessage,
  setIsDrawProposalRecieved,
  setIsDrawProposed,
  setMessage,
  setRoomId,
} from "~/state/globalSlice";
import { IBoardSlice, IGlobalSlice } from "~/types";

export const setGameInit = (
  dispatch: ThunkDispatch<
    {
      global: IGlobalSlice;
      board: IBoardSlice;
    },
    undefined,
    AnyAction
  > &
    Dispatch<AnyAction>
) => {
  dispatch(setGameState("initial"));
  dispatch(setGameStateMessage(""));
  dispatch(setRoomId(""));
  dispatch(setMessage(""));
  dispatch(setIsDrawProposed(false));
  dispatch(setIsDrawProposalRecieved(false));
  dispatch(setGameFen(INITIAL_FEN));
  dispatch(setGamePgn(""));
  dispatch(setPlayerColor("w"));
};
