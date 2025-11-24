import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { SignInData, SignInResponse } from "../../../models";
import { userApi } from "../api/userApi";
import type { AxiosError } from "axios";
import persistReducer from "redux-persist/es/persistReducer";
import sessionStorage from "redux-persist/lib/storage/session";


const user = createSlice({
    name: 'user',
    initialState: {
        isSignedIn: false,
        id: ""
    },
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(signInAsync.fulfilled, (state, action) => {
                const payload = action.payload;
                state.isSignedIn = payload.isAuthenticated;
                if (state.isSignedIn) {
                    state.id = payload.id;
                }
                sessionStorage.setItem("userId_", payload.id);
            })
    }
});


// const signIn = createAsyncThunk(
//     'user/signIn',
//     async (payload: SignInData, { rejectWithValue }) => {

//     }
// );

const signInAsync = createAsyncThunk<SignInResponse, SignInData>(
    'user/signInAsync',
    async (payload: SignInData, { rejectWithValue }) => {
        try {
            const res = await userApi.signIn(payload);
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
    storage: sessionStorage
};

const persistedUserReducer = persistReducer(persistConfig, user.reducer);
export { persistedUserReducer };