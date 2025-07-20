import { configureStore } from "@reduxjs/toolkit";
import { useSelector as rawUseSelector, type TypedUseSelectorHook } from "react-redux";
import userReducer from "../features/users/store/user";


const store = configureStore({
    reducer: {
        user: userReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;

export default store;