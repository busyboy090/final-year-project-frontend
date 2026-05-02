import { useSelector, useDispatch } from "react-redux";
import { 
  clearAuthError, 
  registerUser,
  refreshAccessToken, 
  logoutUser,
  login,
  setAccessToken
} from "@/store/authSlice";
import type { RootState, AppDispatch } from "@/store";
import type { RegisterFormPayload } from "@/store/authSlice";

function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const authState = useSelector((state: RootState) => state.auth);

    return {
        ...authState,

        login: ({ accessToken, user }: { accessToken: string, user: string }) => dispatch(login({ accessToken, user })),

        // --- Auth Methods (Thunks) ---

        /**
         * Handles full registration flow including role mapping
         */
        register: (form: RegisterFormPayload) => 
            dispatch(registerUser(form)),

        /**
         * Manual token refresh if needed
         */
        refresh: () => dispatch(refreshAccessToken()),

        /**
         * Clears local state and HTTP-only cookies via API
         */
        logout: () => dispatch(logoutUser()),

        /**
         * Clear UI error messages (useful for Sonner/Toasts)
         */
        clearError: () => dispatch(clearAuthError()),

        setAccessToken: (accessToken: string) => dispatch(setAccessToken({ accessToken }))
    };
}

export default useAuth;