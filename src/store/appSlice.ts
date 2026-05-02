import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/configs/api";
import axios from "axios";
import { refreshAccessToken, checkIfAuthenticated } from "./authSlice";
import { fetchUserProfile } from "./userSlice";

/* -------------------- TYPES -------------------- */

export interface AppError {
    message: string;
    status?: number;
    data?: unknown;
}

interface AppState {
    initialized: boolean;       // True once the bootstrap check is done
    serverState: "up" | "down" | null;
    isLoading: boolean;
    isError: boolean;
    error: AppError | null;
}

/* -------------------- INITIAL STATE -------------------- */

const initialState: AppState = {
    initialized: false,
    isLoading: false,
    serverState: null,
    isError: false,
    error: null,
};

/* -------------------- THUNKS -------------------- */

// 1. Health Check
export const pingServer = createAsyncThunk<boolean, void, { rejectValue: AppError }>(
    "auth/pingServer",
    async (_, { rejectWithValue }) => {
        try {
            await axios.get(`${API_BASE_URL}/health`);
            return true;
        } catch (err: any) {
            return rejectWithValue({ message: "Server is offline" });
        }
    }
);


// 4. Main Bootstrap Sequence
export const bootstrapAuth = createAsyncThunk<void, void>(
    "auth/bootstrap",
    async (_, { dispatch }) => {
        try {
            await dispatch(pingServer()).unwrap();
            const isAuthenticated = await dispatch(checkIfAuthenticated()).unwrap();

            if (isAuthenticated) {
                await dispatch(refreshAccessToken()).unwrap();
                await dispatch(fetchUserProfile())
            }
        } catch (error) {
            console.warn("App Bootstrap Failed");
        }
    }
);

/* -------------------- SLICE -------------------- */

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Bootstrap
            .addCase(bootstrapAuth.pending, (state) => {
                state.isLoading = true
            })
            .addCase(bootstrapAuth.fulfilled, (state) => {
                state.initialized = true;
                state.isLoading = false
            })
            .addCase(bootstrapAuth.rejected, (state) => {
                state.initialized = true;
                state.isLoading = false
            })

            // Ping
            .addCase(pingServer.fulfilled, (state) => { state.serverState = "up"; })
            .addCase(pingServer.rejected, (state) => { state.serverState = "down"; })
    },
});

export const { setIsLoading } = appSlice.actions;
export default appSlice.reducer;