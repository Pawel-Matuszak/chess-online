import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "~/state/boardSlice";
import globalSlice from "../state/globalSlice";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    board: boardSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
