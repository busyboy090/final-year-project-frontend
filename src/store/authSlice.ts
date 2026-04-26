import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient as api } from "@/apis/axios";
import { API_BASE_URL } from "@/configs/api";
import axios from "axios";

/* -------------------- TYPES -------------------- */

export interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: "administrator" | "organiser" | "user";
}

export interface AuthError {
    message: string;
    status?: number;
    data?: unknown;
    requireEmailVerification?: boolean;
    isAuthenticated?: boolean;
}

export interface RegisterFormPayload {
    fullName: string;
    email: string;
    role: string;
    department: string;
    password: string;
    confirmPassword: string;
}

interface AuthState {
    initialized: boolean;       // True once the bootstrap check is done
    user: AuthUser | null;
    accessToken: string | null;
    csrfToken: string | null;
    isAuthenticated: boolean;
    serverState: "up" | "down" | null;
    isLoading: boolean;
    isError: boolean;
    error: AuthError | null;
    mfaPendingEmail: string | null;
}

/* -------------------- HELPERS -------------------- */

function splitFullName(fullName: string): { first_name: string; last_name: string } {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { first_name: "", last_name: "" };
    if (parts.length === 1) return { first_name: parts[0], last_name: parts[0] };
    return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

function mapUiRoleToApiRole(ui: string): "user" | "organiser" {
    return ui === "staff" ? "organiser" : "user";
}

/* -------------------- INITIAL STATE -------------------- */

const initialState: AuthState = {
    initialized: false,
    user: null,
    accessToken: null,
    csrfToken: null,
    isAuthenticated: false,
    isLoading: false,
    serverState: null,
    isError: false,
    error: null,
    mfaPendingEmail: null,
};

/* -------------------- THUNKS -------------------- */

// 1. Health Check
export const pingServer = createAsyncThunk<boolean, void, { rejectValue: AuthError }>(
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

// Check if user is Authenticated before fetching access token
export const checkIfAuthenticated = createAsyncThunk<
    boolean,
    void,
    { rejectValue: AuthError }
>("auth/checkIfAuthenticated", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/v1/auth/session");
        return data.isAuthenticated
    } catch (err: any) {
        return rejectWithValue({ message: "No active session", isAuthenticated: false });
    }
});

// Refresh Token / Session Recovery
// This replaces localStorage. It asks the server: "Who am I based on my cookie?"
export const refreshAccessToken = createAsyncThunk<
    { accessToken: string; user: AuthUser },
    void,
    { rejectValue: AuthError }
>("auth/refreshAccessToken", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/v1/auth/refresh-token");
        return {
            accessToken: data.accessToken,
            user: data.user, // Server must return user object here
        };
    } catch (err: any) {
        return rejectWithValue({ message: "No active session" });
    }
});

// 4. Main Bootstrap Sequence
export const bootstrapAuth = createAsyncThunk<void, void>(
    "auth/bootstrap",
    async (_, { dispatch }) => {
        try {
            await dispatch(pingServer()).unwrap();
            const isAuthenticated = await dispatch(checkIfAuthenticated()).unwrap();

            if(isAuthenticated) {
                await dispatch(refreshAccessToken()).unwrap();
            }
        } catch (error) {
            console.warn("Bootstrap: User not authenticated.");
        }
    }
);

// Login
export const logoutUser = createAsyncThunk<boolean, void, { rejectValue: AuthError }>(
    "auth/logout",
    async (_,{ rejectWithValue }) => {
        try {
            await api.post("/v1/auth/logout");

            return true;
        } catch (err: any) {
            return rejectWithValue({ message: err.response?.data?.message || "Logout failed" });
        }
    }
);

// 6. Registration
export const registerUser = createAsyncThunk<any, RegisterFormPayload, { rejectValue: AuthError }>(
    "auth/register",
    async (form, { rejectWithValue }) => {
        const { first_name, last_name } = splitFullName(form.fullName);
        try {
            const res = await api.post("/v1/auth/register", {
                first_name,
                last_name,
                email: form.email.trim().toLowerCase(),
                password: form.password,
                confirm_password: form.confirmPassword,
                role: mapUiRoleToApiRole(form.role),
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue({ message: err.response?.data?.message || "Registration failed" });
        }
    }
);

/* -------------------- SLICE -------------------- */

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.mfaPendingEmail = null;
        }, 
        logout: (state) => {
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
            state.mfaPendingEmail = null;
            // Note: Call the API logout separately to clear the HTTP-only cookie
        },
        clearAuthError: (state) => {
            state.isError = false;
            state.error = null;
        },
        clearMfaChallenge: (state) => {
            state.mfaPendingEmail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Bootstrap
            .addCase(bootstrapAuth.fulfilled, (state) => { state.initialized = true; })
            .addCase(bootstrapAuth.rejected, (state) => { state.initialized = true; })

            // Ping
            .addCase(pingServer.fulfilled, (state) => { state.serverState = "up"; })
            .addCase(pingServer.rejected, (state) => { state.serverState = "down"; })

            // Refresh / Session Recovery
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })

            // logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.accessToken = null;
                state.user = null;
                state.isAuthenticated = false;
                state.mfaPendingEmail = null;
            })

            // Register
            .addCase(registerUser.pending, (state) => { state.isLoading = true; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload as AuthError;
            });
    },
});

export const { logout, clearAuthError, clearMfaChallenge, login } = authSlice.actions;
export default authSlice.reducer;