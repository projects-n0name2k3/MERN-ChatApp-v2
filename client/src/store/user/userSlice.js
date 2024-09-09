import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const updateInfo = createAsyncThunk(
  "user/updateInfo",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/password/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateInfo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateInfo.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateInfo.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updatePassword.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default userSlice.reducer;
