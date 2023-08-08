import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Color } from "chess.js";
import { IBoardSlice } from "~/types";

const initialState: IBoardSlice = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  playerColor: "w",
  settings: {
    showCoordinates: true,
    arePremovesAllowed: true,
    animationDuration: 0,
  },
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setPlayerColor: (state, action: PayloadAction<Color>) => {
      state.playerColor = action.payload;
    },
    setGameFen: (state, action: PayloadAction<string>) => {
      state.fen = action.payload;
    },
    setNextMove: (state, action: PayloadAction<string>) => {
      state.fen = action.payload;
    },
  },
});

export const { setPlayerColor, setGameFen, setNextMove } = boardSlice.actions;

export default boardSlice.reducer;
