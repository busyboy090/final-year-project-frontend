import { useSelector, useDispatch } from "react-redux";
import { 
  clearProfile,
  fetchUserProfile,
  setNeedsProfileCompletion,
  updateLocalProfile
} from "@/store/userSlice";
import type { RootState, AppDispatch } from "@/store";
import { useCallback } from "react";

function useUser() {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);
    const fetchProfile = useCallback(() => dispatch(fetchUserProfile()), [dispatch]);
    const updateProfile = useCallback((value: any) => dispatch(updateLocalProfile(value)), [dispatch]);
    const clearUserProfile = useCallback(() => dispatch(clearProfile()), [dispatch]);
    const setProfileCompletionRequired = useCallback((value: boolean) => dispatch(setNeedsProfileCompletion(value)), [dispatch]);

    return {
        ...userState,

        // --- Auth Methods (Thunks) ---
        
        fetchUserProfile: fetchProfile,

        updateLocalProfile: updateProfile,

        clearProfile: clearUserProfile,

        setNeedsProfileCompletion: setProfileCompletionRequired,
    };
}

export default useUser;
