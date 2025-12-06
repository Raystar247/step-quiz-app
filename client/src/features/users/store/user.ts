import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { SignInData } from "../../../models";
import type { AxiosError } from "axios";
import persistReducer from "redux-persist/es/persistReducer";
import sessionStorage from "redux-persist/lib/storage/session";
import { userApiService } from "../infrastructure/api";
import type { SignInResponse } from "../../../api/client";
import { confirmTokenValid } from "../../../utils/auth/jwt";

// ---------------------------------------------------------
// ★ 初期化処理をここで実行する（差分部分）
// ---------------------------------------------------------

// persist:user には JSON 文字列が入っている
const persistedRaw = sessionStorage.getItem("persist:user");

let initialState = {
    isSignedIn: false,
    id: "",
    token: ""
};

// ---------------------------------------------------------
// Slice
// ---------------------------------------------------------
const user = createSlice({
    name: 'user',

    // ★ initialState を上書き
    initialState,

    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(signInAsync.fulfilled, (state, action) => {
                const payload = action.payload;
                const token = payload.data.token;

                if (!confirmTokenValid(token)) {
                    console.warn("Token expired or invalid.");
                    state.isSignedIn = false;
                    state.id = "";
                    state.token = "";
                    return;
                }

                state.isSignedIn = payload.success;
                if (state.isSignedIn) {
                    state.id = payload.data.user.id;
                    state.token = token;
                }
            })
    }
});

const signInAsync = createAsyncThunk<SignInResponse, SignInData>(
    'user/signInAsync',
    async (payload: SignInData, { rejectWithValue }) => {
        try {
            const res = await userApiService.signIn(payload);      
            return res;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.message || 'Unknown error');
        }
    }
);

export { signInAsync };

const persistConfig = {
    key: "user",
    storage: sessionStorage,
    whitelist: ["isSignedIn", "id", "token"]
};

const persistedUserReducer = persistReducer(persistConfig, user.reducer);
export { persistedUserReducer };
