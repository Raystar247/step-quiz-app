import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { SignInData, SignInResponse } from "../type";
import userApi from "../api/userApi";
import type { AxiosError } from "axios";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";


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
            return rejectWithValue(axiosError.response?.data?.message || axiosError.message);
        }
    }
);

export { signInAsync };

const persistConfig = {
    key: "user",
    storage: storage
};

const persistedUserReducer = persistReducer(persistConfig, user.reducer);
export default persistedUserReducer;