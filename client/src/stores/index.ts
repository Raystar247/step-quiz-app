import { configureStore } from "@reduxjs/toolkit";
import { useSelector as rawUseSelector, type TypedUseSelectorHook } from "react-redux";
import { persistedUserReducer as userReducer } from "../features/users/store/user";
import { trialReducer } from "../features/stepq/store/trial";
import { persistStore } from "redux-persist";

const store = configureStore({
    reducer: {
        user: userReducer,
        trial: trialReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST"
                ],
            }
        })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
export const persistor = persistStore(store);

export { store };