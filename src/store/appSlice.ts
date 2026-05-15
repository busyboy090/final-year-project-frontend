import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { refreshAccessToken, checkIfAuthenticated } from "./authSlice";

/* -------------------- TYPES -------------------- */

export interface AppError {
    message: string;
    status?: number;
    data?: unknown;
}

interface AppState {
    initialized: boolean;       // True once the bootstrap check is done
    isLoading: boolean;
    isError: boolean;
    error: AppError | null;
}

/* -------------------- INITIAL STATE -------------------- */

const initialState: AppState = {
    initialized: false,
    isLoading: false,
    isError: false,
    error: null,
};

/* -------------------- THUNKS -------------------- */

// 4. Main Bootstrap Sequence
export const bootstrapAuth = createAsyncThunk<void, void>(
    "auth/bootstrap",
    async (_, { dispatch }) => {
        try {
            const isAuthenticated = await dispatch(checkIfAuthenticated()).unwrap();

            if (isAuthenticated) {
                await dispatch(refreshAccessToken()).unwrap();
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
    },
});

export const { setIsLoading } = appSlice.actions;
export default appSlice.reducer;