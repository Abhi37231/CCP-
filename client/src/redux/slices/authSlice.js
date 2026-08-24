import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data; // Expecting { success: true, data: "OTP sent...", email: "..." }
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (verifyData, thunkAPI) => {
    try {
      const response = await api.post('/auth/verify-otp', verifyData);
      return response.data.data; // Expecting the success message
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', userData);
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      // If it's a verification error, we need the whole object, otherwise just the message
      if (error.response?.data?.isVerified === false) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await api.get('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Not authenticated');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  requiresVerification: false,
  verificationEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setVerificationEmail: (state, action) => {
      state.verificationEmail = action.payload;
      state.requiresVerification = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load user
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requiresVerification = true;
        state.verificationEmail = action.payload.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.requiresVerification = false;
        state.verificationEmail = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        // Check if error is because of verification
        if (typeof action.payload === 'object' && action.payload.isVerified === false) {
           state.requiresVerification = true;
           state.verificationEmail = action.payload.email;
           state.error = action.payload.error;
        } else {
           state.error = action.payload;
        }
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.requiresVerification = false;
        state.verificationEmail = null;
        state.error = null;
      });
  }
});

export const { clearError, setVerificationEmail } = authSlice.actions;
export default authSlice.reducer;
