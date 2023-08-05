import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameState, IGlobalSlice } from "~/types";

const initialState: IGlobalSlice = {
  gameState: "initial",
  roomId: "",
  message: "",
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
  },
});

export const { setRoomId, setGameState, setMessage } = globalSlice.actions;

export default globalSlice.reducer;
