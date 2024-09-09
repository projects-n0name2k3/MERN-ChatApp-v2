//create basic store.js for redux toolkit
import { configureStore } from "@reduxjs/toolkit";
import testSlice from "./test/testSlice";
import authSlice from "./auth/authSlice";
import searchSlice from "./search/searchSlice";
import userSlice from "./user/userSlice";
import channelSlice from "./channel/channelSlice";

export default configureStore({
  reducer: {
    test: testSlice,
    auth: authSlice,
    search: searchSlice,
    user: userSlice,
    channel: channelSlice,
  },
});
