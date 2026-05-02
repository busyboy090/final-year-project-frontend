import { useSelector, useDispatch } from "react-redux";
import { 
  bootstrapAuth,
  setIsLoading
} from "@/store/appSlice";
import type { RootState, AppDispatch } from "@/store";

function useApp() {
    const dispatch = useDispatch<AppDispatch>();
    const appState = useSelector((state: RootState) => state.app);

    return {
        ...appState,

        // --- Auth Methods (Thunks) ---
        
        /**
         * Runs the full startup sequence: Ping -> CSRF -> Refresh
         */
        bootstrap: () => dispatch(bootstrapAuth()),

        // Loading state
        setIsLoading: (value: boolean) => dispatch(setIsLoading(value)),

        
    };
}

export default useApp;