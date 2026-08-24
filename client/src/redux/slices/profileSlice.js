import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/profile');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createOrUpdateProfile = createAsyncThunk(
  'profile/createOrUpdate',
  async (profileData, thunkAPI) => {
    try {
      const response = await api.post('/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleSaveJob = createAsyncThunk(
  'profile/toggleSaveJob',
  async (jobId, thunkAPI) => {
    try {
      const response = await api.post(`/profile/save-job/${jobId}`);
      return response.data.data; // array of saved job IDs
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createOrUpdateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleSaveJob.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.savedJobs = action.payload;
        }
      });
  }
});

export const { clearProfileError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
