import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createChannel = createAsyncThunk(
  "/channel/create",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/api/channels/create",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const getChannels = createAsyncThunk("/channel/get", async () => {
  const response = await axios.get("http://localhost:3000/api/channels", {
    withCredentials: true,
  });

  return response.data;
});

export const getChannelMessages = createAsyncThunk(
  "/channel/getMessages",
  async (channelId) => {
    const response = await axios.get(
      `http://localhost:3000/api/channels/messages/${channelId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    isLoading: false,
    channels: [],
    channelMessages: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createChannel.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createChannel.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createChannel.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getChannels.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getChannels.fulfilled, (state, action) => {
      state.isLoading = false;
      state.channels = action?.payload?.success ? action.payload.data : [];
    });
    builder.addCase(getChannels.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getChannelMessages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getChannelMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.channelMessages = action?.payload?.success
        ? action.payload.data
        : [];
    });
    builder.addCase(getChannelMessages.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default channelSlice.reducer;
