import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Color } from "chess.js";
import { GameState, IGlobalSlice } from "~/types";

const initialState: IGlobalSlice = {
  gameState: "initial",
  gameWinner: null,
  gameStateMessage: "",
  roomId: "",
  message: "",
  isDrawProposed: false,
  isDrawProposalRecieved: false,
  drawResponseMessage: "",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setGameWinner: (state, action: PayloadAction<Color | "d">) => {
      state.gameWinner = action.payload;
    },
    setGameStateMessage: (state, action: PayloadAction<string>) => {
      state.gameStateMessage = action.payload;
    },
    setIsDrawProposed: (state, action: PayloadAction<boolean>) => {
      state.isDrawProposed = action.payload;
    },
    setIsDrawProposalRecieved: (state, action: PayloadAction<boolean>) => {
      state.isDrawProposalRecieved = action.payload;
    },
    setDrawResponseMessage: (state, action: PayloadAction<string>) => {
      state.drawResponseMessage = action.payload;
    },
  },
});

export const {
  setRoomId,
  setGameState,
  setMessage,
  setGameWinner,
  setGameStateMessage,
  setIsDrawProposed,
  setIsDrawProposalRecieved,
  setDrawResponseMessage,
} = globalSlice.actions;

export default globalSlice.reducer;
