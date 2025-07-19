import { createAsyncThunk, createSlice, type Dispatch } from "@reduxjs/toolkit";
import type { SignInData, SignInResponse } from "../type";
import userApi from "../api/userApi";
import type { AxiosError } from "axios";

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
                console.log("Redux extraReducer:: start  ログイン状態・ID更新")
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
        console.log("Redux Middleware:: start");
        try {
            const res = await userApi.signIn(payload);
            return res;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || axiosError.message);
        }
    }
);

export { signInAsync };
export default user.reducer;