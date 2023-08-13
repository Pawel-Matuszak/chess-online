import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import {
  setGameState,
  setGameStateMessage,
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
};
