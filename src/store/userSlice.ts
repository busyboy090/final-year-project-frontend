import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiClient as api } from '@/apis/axios';

interface UserState {
  profile: any | null; // This will hold the flattened profile data
  loading: boolean;
  error: string | null;
  needsProfileCompletion?: boolean;
}

const initialState: UserState = {
  profile: null,
  loading: true,
  error: null,
  needsProfileCompletion: false
};

/**
 * Thunk to fetch the flattened profile.
 * Since a user can have multiple roles, we usually fetch the profile 
 * for their "primary" or "current" active role.
 */
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Endpoint matches your ProfileService.getFlattenedUserProfile logic
      const response = await api.get(`/v1/user/profile/me`);
      return response.data.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    updateLocalProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    setNeedsProfileCompletion: (state, action) => {
      state.needsProfileCompletion = action.payload;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile, updateLocalProfile, setNeedsProfileCompletion } = userSlice.actions;
export default userSlice.reducer;