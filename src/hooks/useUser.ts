import { useSelector, useDispatch } from "react-redux";
import { 
  fetchUserProfile,
  setNeedsProfileCompletion
} from "@/store/userSlice";
import type { RootState, AppDispatch } from "@/store";

function useUser() {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);

    return {
        ...userState,

        // --- Auth Methods (Thunks) ---
        
        fetchUserProfile: () => dispatch(fetchUserProfile()),

        setNeedsProfileCompletion: (value:boolean) => dispatch(setNeedsProfileCompletion(value)),
    };
}

export default useUser;