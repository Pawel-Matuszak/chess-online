import { createSlice } from "@reduxjs/toolkit";
import { IGlobalSlice } from "~/types";

const initialState: IGlobalSlice = {
  gameState: "initial",
  roomId: "",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      console.log(action);
      state.roomId = action.payload;
    },
  },
});

export const { setRoomId } = globalSlice.actions;

export default globalSlice.reducer;
