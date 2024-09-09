//create userSlice.js for redux toolkit
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getMessages = createAsyncThunk(
  "message/getMessages",
  async ({ user1, user2 }) => {
    const res = await axios.post(
      "http://localhost:3000/api/messages/get-messages",
      { user1: user1, user2: user2 },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  }
);

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

export const getContacts = createAsyncThunk("message/getContacts", async () => {
  const res = await axios.get(
    "http://localhost:3000/api/messages/get-contacts",
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
});

export const testSlice = createSlice({
  name: "test",
  initialState: {
    selectedChatData: null,
    selectedChatType: null,
    selectedChatMessages: [],
    isLoading: false,
    contacts: [],
  },
  reducers: {
    setSelectedId: (state, action) => {
      if (action.payload.type === "add") {
        state.selectedChatData = action.payload.data;
        state.selectedChatType = action.payload.chatType;
      } else if (action.payload.type === "remove") {
        state.selectedChatData = null;
        state.selectedChatType = null;
        state.selectedChatMessages = [];
      }
    },
    addMessage: (state, action) => {
      console.log(action);
      state.selectedChatMessages = [
        ...state.selectedChatMessages,
        {
          ...action.payload.message,
          receiver:
            state.selectedChatType === "channel"
              ? action.payload.message.receiver
              : action.payload.message.receiver._id,
          sender:
            state.selectedChatType === "channel"
              ? action.payload.message.sender
              : action.payload.message.sender._id,
        },
      ];
    },
    cleanState: (state) => {
      state.selectedChatData = null;
      state.selectedChatType = null;
      state.selectedChatMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMessages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedChatMessages = action.payload.data;
    });
    builder.addCase(getMessages.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContacts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.contacts = action.payload.data;
    });
    builder.addCase(getContacts.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getChannelMessages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getChannelMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedChatMessages = action.payload.data;
    });
    builder.addCase(getChannelMessages.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  setSelectedId,
  cleanState,
  addMessage,
  setSelectedChatMessages,
} = testSlice.actions;

export default testSlice.reducer;
