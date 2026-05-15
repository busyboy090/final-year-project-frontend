import { useSelector, useDispatch } from "react-redux";
import { 
  clearProfile,
  fetchUserProfile,
  setNeedsProfileCompletion,
  updateLocalProfile
} from "@/store/userSlice";
import type { RootState, AppDispatch } from "@/store";

function useUser() {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);

    return {
        ...userState,

        // --- Auth Methods (Thunks) ---
        
        fetchUserProfile: () => dispatch(fetchUserProfile()),

        updateLocalProfile: (value :any) => dispatch(updateLocalProfile(value)),

        clearProfile: () => dispatch(clearProfile()),

        setNeedsProfileCompletion: (value:boolean) => dispatch(setNeedsProfileCompletion(value)),
    };
}

export default useUser;